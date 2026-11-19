export interface EnquiryEmailPayload {
  to: string;
  from: string;
  subject: string;
  text: string;
}

export interface IEmailSender {
  send(payload: EnquiryEmailPayload): Promise<void>;
}
