declare module 'midtrans-client' {
  export class Snap {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });
    createTransaction(parameter: Record<string, any>): Promise<Record<string, any>>;
    createTransactionToken(parameter: Record<string, any>): Promise<string>;
  }

  export class CoreApi {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });
    charge(parameter: Record<string, any>): Promise<Record<string, any>>;
    transaction: {
      status(orderId: string): Promise<Record<string, any>>;
    };
  }
}
