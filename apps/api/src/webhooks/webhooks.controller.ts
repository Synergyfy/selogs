import { Controller, Post, Req, Res, RawBodyRequest } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { Request, Response } from 'express';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('paystack')
  @ApiExcludeEndpoint()
  async handlePaystackWebhook(@Req() req: RawBodyRequest<Request>, @Res() res: Response) {
    const result = await this.webhooksService.handlePaystackWebhook(req);
    return res.status(200).json(result);
  }
}
