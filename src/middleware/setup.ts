import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { SetupMiddlewareArgs } from "../types";
import { tokens } from "../csrf";
import { sign } from "cookie-signature";
import { serialize } from "cookie";

const setup = (
  handler: NextApiHandler,
  { csrfSecret, secret, tokenKey, cookieOptions }: SetupMiddlewareArgs
) => async (req: NextApiRequest, res: NextApiResponse) => {
  const reqCsrfToken = tokens.create(csrfSecret);
  const reqCsrfTokenSigned = sign(reqCsrfToken, secret);

  res.setHeader(
    "Set-Cookie",
    serialize(tokenKey, reqCsrfTokenSigned, cookieOptions)
  );
  return handler(req, res);
};

export { setup };
