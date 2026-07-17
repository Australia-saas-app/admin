import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ProfileClientService {
  private readonly logger = new Logger(ProfileClientService.name);
  private readonly userClient: AxiosInstance;
  private readonly businessClient: AxiosInstance;
  private readonly userBaseUrl: string;
  private readonly businessBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    const rawUserProfileUrl = this.configService.get<string>('USER_PROFILE_SERVICE_URL', 'http://user-service:3013');
    // The new user-service has a controller prefix 'user' and public profile at 'profile/public'
    this.userBaseUrl = `${rawUserProfileUrl}/user/profile/public/`;
    this.userClient = axios.create({
      baseURL: this.userBaseUrl,
      timeout: 5000,
    });

    const rawBusinessUrl = this.configService.get<string>('BUSINESS_SERVICE_URL', 'http://business-service:3012');
    // The business service prefix is 'business'
    this.businessBaseUrl = `${rawBusinessUrl}/business/`;
    this.businessClient = axios.create({
      baseURL: this.businessBaseUrl,
      timeout: 5000,
    });
  }

  async getProfileName(id: string, token?: string, type: string = 'user'): Promise<string | null> {
    try {
      const config: any = {};
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }

      // We always use userClient for profile names because the user-service 
      // is the source of truth for all account types (user, business, agency)
      // and it exposes public profiles for all of them.
      const usedUrl = `${this.userBaseUrl}${id}`;
      this.logger.debug(`Fetching profile name for ${id} (${type}) from ${usedUrl}`);

      const response = await this.userClient.get(id, config);

      // Some services return { success: true, data: { ... } }, others just return the object
      const profileData = response.data?.data || response.data;

      if (!profileData) {
        this.logger.warn(`No data found for profile ${id} (${type}) at ${usedUrl}`);
        return null;
      }

      this.logger.debug(`Profile data received for ${id}: ${JSON.stringify(profileData)}`);

      // 1. For business or agency types, prioritize specific names
      if (type === 'business') {
        if (profileData.businessInfo?.businessName) {
          return profileData.businessInfo.businessName;
        }
      }

      // 2. Primary choice for users (and secondary for businesses)
      if (profileData.fullName) {
        return profileData.fullName;
      }

      // 3. Fallbacks
      if (profileData.businessInfo?.businessName) {
        return profileData.businessInfo.businessName;
      }

      this.logger.warn(`Profile name not found for ${id} (${type}). Response keys: ${Object.keys(profileData)}`);
      return null;
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;
      const baseUrl = (this.userClient.defaults.baseURL || '').toString();
      const fullUrl = `${baseUrl}${id}`;

      this.logger.error(`Failed to get profile name for ${id} (${type}). URL: ${fullUrl}. Status: ${status}, Error: ${error.message}, Data: ${JSON.stringify(data)}`);

      return null;
    }
  }
}


