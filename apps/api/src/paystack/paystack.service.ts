import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import {
  PaystackInitializeResponse,
  PaystackVerifyResponse,
  PaystackPlanResponse,
  PaystackChargeAuthorizationResponse,
  PaystackSubscriptionResponse,
} from './paystack.types';

@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  private readonly secretKey: string;
  private readonly baseUrl = 'https://api.paystack.co';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.secretKey = this.configService.getOrThrow<string>('PAYSTACK_SECRET_KEY');
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
  async createPlan(name: string, amount: number, interval: 'monthly' | 'quarterly' | 'annually' | 'biannually'): Promise<PaystackPlanResponse> {
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
      return response.data as PaystackPlanResponse;
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
    plan?: string,
  ): Promise<PaystackInitializeResponse> {
    try {
      const payload: any = {
        email,
        amount: Math.round(amount * 100),
        metadata,
      };

      if (plan) {
        payload.plan = plan;
      }

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/transaction/initialize`, payload, {
          headers: this.headers,
        }),
      );
      return response.data as PaystackInitializeResponse;
    } catch (error: any) {
      this.logger.error(`Failed to initialize Paystack transaction: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify a transaction
   */
  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/transaction/verify/${reference}`, {
          headers: this.headers,
        }),
      );
      return response.data as PaystackVerifyResponse;
    } catch (error: any) {
      this.logger.error(`Failed to verify Paystack transaction: ${error.message}`);
      throw error;
    }
  }

  /**
   * Charge a returning customer using an authorization code
   */
  async chargeAuthorization(
    email: string,
    amount: number,
    authorization_code: string,
    metadata?: Record<string, unknown>,
  ): Promise<PaystackChargeAuthorizationResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/transaction/charge_authorization`,
          {
            email,
            amount: Math.round(amount * 100),
            authorization_code,
            metadata,
          },
          { headers: this.headers },
        ),
      );
      return response.data as PaystackChargeAuthorizationResponse;
    } catch (error: any) {
      this.logger.error(`Failed to charge Paystack authorization: ${error.message}`);
      throw error;
    }
  }

  /**
   * Enable a subscription
   */
  async enableSubscription(code: string, token: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/subscription/enable`,
          { code, token },
          { headers: this.headers },
        ),
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to enable Paystack subscription: ${error.message}`);
      throw error;
    }
  }

  /**
   * Disable a subscription
   */
  async disableSubscription(code: string, token: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/subscription/disable`,
          { code, token },
          { headers: this.headers },
        ),
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to disable Paystack subscription: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify Webhook Signature
   */
  verifyWebhookSignature(signature: string, rawBody: Buffer): boolean {
    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(rawBody)
      .digest('hex');
    return hash === signature;
  }
}
