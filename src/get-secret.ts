import { NextApiRequest } from "next";
import { getCookie } from "./cookies";

const getSecret = (req: NextApiRequest, tokenKey: string): string => {
  return getCookie(req, tokenKey.toLowerCase());
};

export { getSecret };
