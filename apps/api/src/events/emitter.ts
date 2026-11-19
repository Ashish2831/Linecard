type Handler = (payload: unknown) => void | Promise<void>;

class SimpleEventEmitter {
  private listeners = new Map<string, Handler[]>();

  on(event: string, handler: Handler) {
    const list = this.listeners.get(event) ?? [];
    list.push(handler);
    this.listeners.set(event, list);
  }

  async emit(event: string, payload: unknown): Promise<void> {
    const list = this.listeners.get(event) ?? [];
    for (const handler of list) {
      await handler(payload);
    }
  }
}

export const eventBus = new SimpleEventEmitter();

export const EVENTS = {
  ENQUIRY_SUBMITTED: 'enquiry.submitted',
} as const;

export interface EnquirySubmittedEvent {
  productId: string;
  productTitle: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
}
