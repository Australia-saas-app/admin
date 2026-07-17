import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from 'redis';

@Injectable()
export class OtpUtil {
  private readonly ttlSeconds: number;

  constructor(private readonly configService: ConfigService) {
    this.ttlSeconds = parseInt(this.configService.get('OTP_TTL_SECONDS', '600'), 10);
  }

  generateOTP(length = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i += 1) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }

  async storeOTP(redisClient: RedisClientType, key: string, otp: string) {
    await redisClient.set(key, otp, { EX: this.ttlSeconds });
  }

  async verifyOTP(redisClient: RedisClientType, key: string, otp: string) {
    const stored = await redisClient.get(key);
    if (!stored || stored !== otp) {
      return false;
    }
    await redisClient.del(key);
    return true;
  }

  async sendOTPEmail(email: string, otp: string) {
    Logger.log(`OTP for ${email}: ${otp}`, 'OtpUtil');
    // TODO: Integrate actual email provider (SendGrid/SES)
  }

  async sendOTPSMS(phone: string, otp: string) {
    Logger.log(`OTP for ${phone}: ${otp}`, 'OtpUtil');
    // TODO: Integrate SMS provider (Twilio)
  }
}


