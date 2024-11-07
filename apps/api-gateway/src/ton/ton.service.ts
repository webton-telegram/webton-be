import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@app/common/config/config.service';
import {
  beginCell,
  Address,
  TonClient,
  WalletContractV5R1,
  internal,
  external,
  storeMessage,
  toNano,
  OpenedContract,
  SendMode,
} from '@ton/ton';
import { KeyPair, mnemonicToWalletKey } from '@ton/crypto';
import { TransactionStatus } from '@app/persistence/transaction-log/transaction-log.enum';
import { TransactionLogRepositoryService } from '@app/persistence/transaction-log/transaction-log.repository.service';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TransactionLogEntity } from '@app/persistence/transaction-log/transaction-log.entity';

@Injectable()
export class TonService {
  constructor(
    private readonly transactionLogRepositoryService: TransactionLogRepositoryService,
  ) {}

  async sendJetton(address: string, amount: number): Promise<string> {
    let logEntity = await TransactionLogEntity.from({
      toWalletAddress: address,
      amount: toNano(amount).toString(),
      status: TransactionStatus.Pending,
    });

    logEntity = (
      await this.transactionLogRepositoryService.saveTransactionLogs([
        logEntity,
      ])
    )[0];

    const mnemonic = ConfigService.getConfig().TON_ADMIN_WALLET_MNEMONIC;
    const keyPair = await mnemonicToWalletKey(mnemonic.split(' '));

    let txHash;
    try {
      txHash = await this.transferToken(
        keyPair,
        Address.parse(address),
        amount,
        logEntity,
      );
    } catch (error) {
      logEntity.setStatus(TransactionStatus.Error);

      await this.transactionLogRepositoryService.saveTransactionLogs([
        logEntity,
      ]);

      Logger.error(error);

      throw error;
    }

    return txHash;
  }

  async transferToken(
    keyPair: KeyPair,
    toAddress: Address,
    amount: number,
    logEntity: TransactionLogEntity,
  ) {
    const endpoint = await getHttpEndpoint({
      network: ConfigService.isProduction() ? 'mainnet' : 'testnet',
    });
    const client = new TonClient({
      endpoint,
    });

    const secretKey = Buffer.from(keyPair.secretKey);
    const publicKey = Buffer.from(keyPair.publicKey);

    const workchain = 0;
    const wallet = WalletContractV5R1.create({ workchain, publicKey });
    const address = wallet.address.toString({
      urlSafe: true,
      bounceable: false,
      testOnly: ConfigService.isProduction() ? false : true,
    });
    const contract = client.open(wallet);

    const seqno = await contract.getSeqno();
    console.log({ address, seqno });

    const { init } = contract;
    const contractDeployed = await client.isContractDeployed(
      Address.parse(address),
    );
    let neededInit: null | typeof init = null;

    if (init && !contractDeployed) {
      neededInit = init;
    }

    const jettonWalletAddress = await this.getUserJettonWalletAddress(
      address,
      ConfigService.getConfig().TOKEN_CONTRACT_ADDRESS,
    );

    const messageBody = beginCell()
      .storeUint(0x0f8a7ea5, 32) // jetton transfer의 opcode
      .storeUint(0, 64) // query id
      .storeCoins(toNano(amount)) // 전송할 토큰 양
      .storeAddress(toAddress)
      .storeAddress(toAddress) // 수신자 지갑 주소
      .storeBit(0) // custom payload 설정 여부
      .storeCoins(0) // forward amount 값. 0보다 크면 notification message를 전송함
      .storeBit(0) // forwardPayload (comment)를 보낼지 여부
      .endCell();

    const internalMessage = internal({
      to: jettonWalletAddress,
      value: toNano('0.1'),
      bounce: true,
      body: messageBody,
    });

    const body = wallet.createTransfer({
      seqno,
      secretKey,
      messages: [internalMessage],
      sendMode: SendMode.NONE,
    });

    const externalMessage = external({
      to: address,
      init: neededInit,
      body,
    });

    const externalMessageCell = beginCell()
      .store(storeMessage(externalMessage))
      .endCell();

    const signedTransaction = externalMessageCell.toBoc();
    const hash = externalMessageCell.hash().toString('hex');

    await client.sendFile(signedTransaction);

    logEntity.setTransactionHash(hash);
    logEntity.setStatus(TransactionStatus.Processing);
    logEntity = (
      await this.transactionLogRepositoryService.saveTransactionLogs([
        logEntity,
      ])
    )[0];

    Logger.log(
      'Transaction sent. Waiting for confirmation...',
      TonService.name,
    );
    // await this.waitForTransactionConfirmation(contract, seqno);

    logEntity.setStatus(TransactionStatus.Completed);
    await this.transactionLogRepositoryService.saveTransactionLogs([logEntity]);

    return hash;
  }

  private async waitForTransactionConfirmation(
    contract: OpenedContract<WalletContractV5R1>,
    initialSeqno: number,
  ): Promise<void> {
    const intervalTime = 5000;
    return new Promise((resolve) => {
      const intervalId = setInterval(async () => {
        const currentSeqno = await contract.getSeqno();
        if (currentSeqno > initialSeqno) {
          Logger.log('Transaction confirmed!', TonService.name);
          clearInterval(intervalId);
          resolve();
        }
      }, intervalTime);
    });
  }

  async getUserJettonWalletAddress(
    userAddress: string,
    jettonMasterAddress: string,
  ) {
    const endpoint = await getHttpEndpoint({
      network: ConfigService.isProduction() ? 'mainnet' : 'testnet',
    });
    const client = new TonClient({
      endpoint,
    });

    const userAddressCell = beginCell()
      .storeAddress(Address.parse(userAddress))
      .endCell();

    const response = await client.runMethod(
      Address.parse(jettonMasterAddress),
      'get_wallet_address',
      [{ type: 'slice', cell: userAddressCell }],
    );

    return response.stack.readAddress();
  }
}
