import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY,
});

export function getPinataGatewayUrl(cid: string) {
  const gateway = process.env.PINATA_GATEWAY;

  if (!gateway) {
    throw new Error("PINATA_GATEWAY is not configured.");
  }

  const normalizedGateway = gateway.replace(/^https?:\/\//, "").replace(/\/+$/, "");

  return `https://${normalizedGateway}/ipfs/${cid}`;
}
