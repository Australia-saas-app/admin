import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class UserKycInitService implements OnModuleInit {
  private readonly logger = new Logger(UserKycInitService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    await this.ensureKycColumns();
  }

  private async ensureKycColumns() {
    const columns = [
      { name: 'kycStatus', type: 'varchar(20) DEFAULT \'NONE\'' },
      { name: 'kycPhotoUrl', type: 'varchar(500)' },
      { name: 'kycIdentityType', type: 'varchar(50)' },
      { name: 'kycIdentityNumber', type: 'varchar(50)' },
      { name: 'kycDateOfBirth', type: 'date' },
      { name: 'kycNationality', type: 'varchar(100)' },
      { name: 'kycDocumentUrl', type: 'varchar(500)' },
      { name: 'kycCountry', type: 'varchar(100)' },
      { name: 'kycCity', type: 'varchar(100)' },
      { name: 'kycState', type: 'varchar(100)' },
      { name: 'kycZipCode', type: 'varchar(20)' },
      { name: 'kycPermanentAddress', type: 'text' },
      { name: 'kycReviewedBy', type: 'varchar(50)' },
      { name: 'kycRejectionReason', type: 'text' },
      { name: 'kycSubmittedAt', type: 'timestamp' },
      { name: 'kycReviewedAt', type: 'timestamp' },
    ];

    for (const col of columns) {
      try {
        await this.dataSource.query(
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type} NULL`,
        );
      } catch (error: any) {
        if (!error.message?.includes('duplicate column')) {
          this.logger.warn(`Column ${col.name}: ${error.message}`);
        }
      }
    }

    this.logger.log('KYC columns ensured');
  }
}