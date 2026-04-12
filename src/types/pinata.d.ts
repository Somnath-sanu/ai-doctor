declare module "pinata" {
  export class PinataSDK {
    constructor(config: {
      pinataJwt?: string;
      pinataGateway?: string;
    });

    upload: {
      public: {
        file(file: File): Promise<{
          id: string;
          cid: string;
          name: string;
          size: number;
          mime_type?: string;
          created_at: string;
        }>;
      };
    };

    gateways?: unknown;
  }
}
