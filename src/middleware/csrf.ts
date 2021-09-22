import { HttpError } from "../utils";
import { serialize, parse } from "cookie";
import { sign, unsign } from "cookie-signature";
import { tokens } from "../csrf";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "../cookies";
import { MiddlewareArgs } from "../types";

const csrf = (
  handler: NextApiHandler,
  {
    ignoredMethods,
    csrfSecret,
    csrfErrorMessage,
    secret,
    tokenKey,
    cookieOptions,
  }: MiddlewareArgs
) => async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    // 1. extract secret and token from their cookies
    const tokenFromCookie = getCookie(req, tokenKey);
    const tokenFromCookieUnsigned = unsign(tokenFromCookie, secret);

    // Do nothing on if method is in `ignoreMethods`
    if (ignoredMethods.includes(req.method as string)) {
      return handler(req, res);
    }

    if (!tokenFromCookieUnsigned) {
      throw new HttpError(403, csrfErrorMessage);
    }

    // verify CSRF token
    if (!tokens.verify(csrfSecret, tokenFromCookieUnsigned)) {
      throw new HttpError(403, csrfErrorMessage);
    }

    // If everything is okay and verified, generate a new token and save it in the cookie
    const newReqCsrfToken = tokens.create(csrfSecret);
    const newReqCsrfTokenSigned = sign(newReqCsrfToken, secret);

    res.setHeader(
      "Set-Cookie",
      serialize(tokenKey, newReqCsrfTokenSigned, cookieOptions)
    );

    return handler(req, res);
  } catch (error) {
    return res.status(error.status ?? 500).json({ message: error.message });
  }
};

export { csrf };
