import { ConfigService } from '@app/common/config/config.service';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import {
  Address,
  Cell,
  TonClient4,
  loadStateInit,
  contractAddress,
} from '@ton/ton';
import {
  CheckProofRequestDto,
  Payload,
  WithdrawResult,
} from './dto/wallet.dto';
import { tryParsePublicKey } from './wrappers/wallets-data';
import { sha256 } from '@ton/crypto';
import { randomBytes, sign } from 'tweetnacl';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@app/persistence/user/user.entity';
import { WalletRepositoryService } from '@app/persistence/wallet/wallet.repository.service';
import { WalletEntity } from '@app/persistence/wallet/wallet.entity';
import {
  ServiceException,
  ServiceExceptionCode,
} from '@app/common/ServiceException';
import { TonService } from '../ton/ton.service';
import { UserRepositoryService } from '@app/persistence/user/user.repository.service';

const tonProofPrefix = 'ton-proof-item-v2/';
const tonConnectPrefix = 'ton-connect';
const allowedDomains = [
  'ton-connect.github.io',
  'webton.ai',
  'localhost:3000',
  'localhost:8000',
  'firmly-rational-beagle.ngrok-free.app',
  'app.webton.ai',
];

@Injectable()
export class WalletService {
  constructor(
    private readonly userRepositoryService: UserRepositoryService,
    private readonly walletRepositoryService: WalletRepositoryService,
    private readonly tonService: TonService,

    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async withdraw(
    userEntity: UserEntity,
    amount: number,
  ): Promise<WithdrawResult> {
    if (!userEntity.wallet) {
      throw new ServiceException(
        ServiceExceptionCode.WalletNotConnected,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (userEntity.point! < amount) {
      throw new ServiceException(
        ServiceExceptionCode.InsufficientPoint,
        HttpStatus.BAD_REQUEST,
      );
    }

    const txHash = await this.tonService.sendJetton(
      userEntity.wallet.address,
      amount,
    );

    userEntity.updatePoint(-amount);

    await this.userRepositoryService.saveUser(userEntity);

    const result = await WithdrawResult.from({ txHash });
    return result;
  }

  async generatePayload(): Promise<Payload> {
    const payload = Buffer.from(randomBytes(32)).toString('hex');
    const jwt = await this.jwtService.signAsync(
      { payload },
      {
        expiresIn: ConfigService.getConfig().JWT_ACCESS_EXPIRES_IN,
      },
    );

    return await Payload.from({ payload: jwt });
  }

  async getWalletPublicKey(address: string): Promise<Buffer> {
    const endpoint = await getHttpEndpoint({
      network: ConfigService.isProduction() ? 'mainnet' : 'testnet',
    });
    const client = new TonClient4({
      endpoint,
    });
    const masterAt = await client.getLastBlock();
    const result = await client.runMethod(
      masterAt.last.seqno,
      Address.parse(address),
      'get_public_key',
      [],
    );
    return Buffer.from(
      result.reader.readBigNumber().toString(16).padStart(64, '0'),
      'hex',
    );
  }

  async connectWallet(
    userEntity: UserEntity,
    dto: CheckProofRequestDto,
  ): Promise<boolean> {
    try {
      this.jwtService.verify(dto.proof.payload);

      const stateInit = loadStateInit(
        Cell.fromBase64(dto.proof.stateInit).beginParse(),
      );

      const publicKey =
        tryParsePublicKey(stateInit) ??
        (await this.getWalletPublicKey(dto.address));
      if (!publicKey) {
        return false;
      }

      const wantedPublicKey = Buffer.from(dto.publicKey, 'hex');
      if (!publicKey.equals(wantedPublicKey)) {
        return false;
      }

      const wantedAddress = Address.parse(dto.address);
      const address = contractAddress(wantedAddress.workChain, stateInit);
      if (!address.equals(wantedAddress)) {
        return false;
      }

      if (!allowedDomains.includes(dto.proof.domain.value)) {
        return false;
      }

      const now = Math.floor(Date.now() / 1000);
      if (now - 3600 > dto.proof.timestamp) {
        return false;
      }

      const message = {
        workchain: address.workChain,
        address: address.hash,
        domain: {
          lengthBytes: dto.proof.domain.lengthBytes,
          value: dto.proof.domain.value,
        },
        signature: Buffer.from(dto.proof.signature, 'base64'),
        payload: dto.proof.payload,
        stateInit: dto.proof.stateInit,
        timestamp: dto.proof.timestamp,
      };

      const wc = Buffer.alloc(4);
      wc.writeUInt32BE(message.workchain, 0);

      const ts = Buffer.alloc(8);
      ts.writeBigUInt64LE(BigInt(message.timestamp), 0);

      const dl = Buffer.alloc(4);
      dl.writeUInt32LE(message.domain.lengthBytes, 0);

      const msg = Buffer.concat([
        Buffer.from(tonProofPrefix),
        wc,
        message.address,
        dl,
        Buffer.from(message.domain.value),
        ts,
        Buffer.from(message.payload),
      ]);

      const msgHash = Buffer.from(await sha256(msg));

      const fullMsg = Buffer.concat([
        Buffer.from([0xff, 0xff]),
        Buffer.from(tonConnectPrefix),
        msgHash,
      ]);

      const result = Buffer.from(await sha256(fullMsg));

      const isVerified = sign.detached.verify(
        result,
        message.signature,
        publicKey,
      );

      if (isVerified && !userEntity.wallet) {
        const walletEntity = await WalletEntity.from({
          userId: userEntity.id!,
          address: address.toString({
            urlSafe: true,
            bounceable: false,
            testOnly: !ConfigService.isProduction(),
          }),
        });

        await this.walletRepositoryService.saveWallet(walletEntity);
      }

      return isVerified;
    } catch (e) {
      Logger.error(e);
      return false;
    }
  }
}
