import nodemailer from 'nodemailer';
import type { EnquiryEmailPayload, IEmailSender } from './IEmailSender.js';
import { UpstreamError } from '../domain/errors.js';

export class SmtpEmailSender implements IEmailSender {
  private transporter: nodemailer.Transporter;

  constructor(host: string, port: number) {
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
    });
  }

  async send(payload: EnquiryEmailPayload): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: payload.from,
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
      });
    } catch {
      throw new UpstreamError('Failed to send enquiry email');
    }
  }
}
