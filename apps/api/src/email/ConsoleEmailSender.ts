import { logger } from '../lib/logger.js';
import type { EnquiryEmailPayload, IEmailSender } from './IEmailSender.js';

export class ConsoleEmailSender implements IEmailSender {
  async send(payload: EnquiryEmailPayload): Promise<void> {
    logger.info('Email (console)', {
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
    });
  }
}
