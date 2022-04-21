import { parse } from "cookie";
import { NextApiRequest } from "next";
import { IncomingMessage } from "http";

function getCookie(req: IncomingMessage, name: string): string {
  if (req.headers.cookie != null) {
    const parsedCookie = parse(req.headers.cookie);
    return parsedCookie[name];
  }

  return "";
}

export { getCookie };
