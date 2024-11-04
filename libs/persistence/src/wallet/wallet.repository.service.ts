import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletEntity } from './wallet.entity';

@Injectable()
export class WalletRepositoryService {
  constructor(
    @InjectRepository(WalletEntity)
    private walletRepository: Repository<WalletEntity>,
  ) {}

  async saveWallet(walletEntity: WalletEntity): Promise<WalletEntity> {
    const wallet = await this.walletRepository.save(walletEntity);
    return wallet;
  }
}
