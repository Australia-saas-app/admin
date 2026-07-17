import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async getWalletByUserId(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { userId } });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  async createWallet(userId: string): Promise<Wallet> {
    const wallet = this.walletRepository.create({ userId, balance: 0 });
    return await this.walletRepository.save(wallet);
  }

  async deposit(userId: string, amount: number): Promise<Wallet> {
    const wallet = await this.getWalletByUserId(userId);
    wallet.balance += amount;
    return await this.walletRepository.save(wallet);
  }

  async withdraw(userId: string, amount: number): Promise<Wallet> {
    const wallet = await this.getWalletByUserId(userId);
    if (wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }
    wallet.balance -= amount;
    return await this.walletRepository.save(wallet);
  }

  async getBalance(userId: string): Promise<number> {
    const wallet = await this.getWalletByUserId(userId);
    return wallet.balance;
  }
}