import { config } from '../config.js';
import type { IEmailSender } from '../email/IEmailSender.js';
import { logger } from '../lib/logger.js';
import { EVENTS, eventBus, type EnquirySubmittedEvent } from './emitter.js';

export function registerEnquiryListener(emailSender: IEmailSender) {
  eventBus.on(EVENTS.ENQUIRY_SUBMITTED, async (payload) => {
    const event = payload as EnquirySubmittedEvent;
    const text = [
      `New Linecard enquiry`,
      `Product: ${event.productTitle} (id ${event.productId})`,
      `Name: ${event.name}`,
      `Email: ${event.email}`,
      event.phone ? `Phone: ${event.phone}` : undefined,
      '',
      event.message,
    ]
      .filter(Boolean)
      .join('\n');

    await emailSender.send({
      to: config.salesInbox,
      from: config.smtpFrom,
      subject: `[Linecard] Enquiry: ${event.productTitle}`,
      text,
    });
    logger.info('Enquiry email dispatched', { productId: event.productId });
  });
}
