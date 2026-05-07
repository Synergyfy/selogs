import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  private readonly secretKey: string;
  private readonly baseUrl = 'https://api.paystack.co';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.secretKey = this.configService.getOrThrow<string>(
      'PAYSTACK_SECRET_KEY',
    );
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Create a plan on Paystack for recurring billing
   */
  async createPlan(
    name: string,
    amount: number,
    interval: 'monthly' | 'quarterly' | 'annually',
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/plan`,
          {
            name,
            amount: Math.round(amount * 100), // Paystack expects amount in kobo
            interval,
          },
          { headers: this.headers },
        ),
      );
      return response.data as unknown;
    } catch (error: any) {
      this.logger.error(`Failed to create Paystack plan: ${error.message}`);
      throw error;
    }
  }

  /**
   * Initialize a transaction
   */
  async initializeTransaction(
    email: string,
    amount: number,
    metadata?: Record<string, unknown>,
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/transaction/initialize`,
          {
            email,
            amount: Math.round(amount * 100),
            metadata,
          },
          { headers: this.headers },
        ),
      );
      return response.data as unknown;
    } catch (error: any) {
      this.logger.error(
        `Failed to initialize Paystack transaction: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Verify a transaction
   */
  async verifyTransaction(reference: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/transaction/verify/${reference}`,
          {
            headers: this.headers,
          },
        ),
      );
      return response.data as unknown;
    } catch (error: any) {
      this.logger.error(
        `Failed to verify Paystack transaction: ${error.message}`,
      );
      throw error;
    }
  }
}
