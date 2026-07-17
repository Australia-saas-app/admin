import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../../entities/wallet.entity';
import { Transaction, TransactionType, TransactionStatus } from '../../entities/transaction.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getWallet(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { userId } });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  async createWallet(userId: string): Promise<Wallet> {
    const existing = await this.walletRepository.findOne({ where: { userId } });
    if (existing) {
      return existing;
    }

    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const wallet = this.walletRepository.create({
      userId,
      currency: user.currency,
    });

    return await this.walletRepository.save(wallet);
  }

  async getBalance(userId: string): Promise<number> {
    const wallet = await this.getWallet(userId);
    return +wallet.balance;
  }

  async deposit(userId: string, amount: number, description?: string): Promise<Wallet> {
    const wallet = await this.getWallet(userId);

    wallet.balance = +wallet.balance + +amount;
    await this.walletRepository.save(wallet);

    await this.createTransaction(userId, wallet.id, TransactionType.DEPOSIT, amount, wallet.currency, description);

    return wallet;
  }

  async withdraw(userId: string, amount: number, description?: string): Promise<Wallet> {
    const wallet = await this.getWallet(userId);

    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    wallet.balance = +wallet.balance - +amount;
    await this.walletRepository.save(wallet);

    await this.createTransaction(userId, wallet.id, TransactionType.WITHDRAWAL, amount, wallet.currency, description);

    return wallet;
  }

  async getTransactions(userId: string, page: number = 1, limit: number = 20): Promise<any> {
    const skip = (page - 1) * limit;
    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async createTransaction(
    userId: string,
    walletId: string,
    type: TransactionType,
    amount: number,
    currency: string,
    description?: string,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      userId,
      walletId,
      type,
      amount,
      currency,
      status: TransactionStatus.COMPLETED,
      description,
    });

    return await this.transactionRepository.save(transaction);
  }
}