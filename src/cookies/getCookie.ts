import { parse } from "cookie";
import { NextApiRequest } from "next";

function getCookie(req: NextApiRequest, name: string): string {
  if (req.headers.cookie != null) {
    const parsedCookie = parse(req.headers.cookie);
    return parsedCookie[name];
  }

  return "";
}

export { getCookie };
