import { getCookie } from "./get-cookie";
import { IncomingMessage } from "http";

const getSecret = (req: IncomingMessage, tokenKey: string): string => {
  return getCookie(req, tokenKey.toLowerCase());
};

export { getSecret };
