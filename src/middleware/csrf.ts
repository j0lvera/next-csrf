import { HttpError } from "../utils";
import { serialize, parse } from "cookie";
import { sign, unsign } from "cookie-signature";
import { tokens } from "../csrf/tokens";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "../cookies";
import { MiddlewareArgs } from "../types";

const getToken = (req: NextApiRequest, tokenKey: string): string | string[] =>
  req.headers[tokenKey.toLowerCase()] || "";

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

    // If no token in cookie then we assume first request and proceed to setup CSRF mitigation
    if (!tokenFromCookie) {
      const reqCsrfToken = tokens.create(csrfSecret);
      const reqCsrfTokenSigned = sign(reqCsrfToken, secret);

      res.setHeader(
        "Set-Cookie",
        serialize(tokenKey, reqCsrfTokenSigned, cookieOptions)
      );
      return handler(req, res);
    }

    // Do nothing on if method is in `ignoreMethods`
    if (ignoredMethods.includes(req.method as string)) {
      return handler(req, res);
    }

    // 2. extract token from custom header
    const tokenFromHeaders = <string>getToken(req, tokenKey);

    // We need the token in a custom header to verify Double-submit cookie pattern
    if (!tokenFromHeaders) {
      throw new HttpError(403, csrfErrorMessage);
    }

    const tokenFromCookieUnsigned = unsign(tokenFromCookie, secret);
    const tokenFromHeadersUnsigned = unsign(
      <string>tokenFromHeaders,
      secret
    );

    // 3. verify signature
    if (!tokenFromCookieUnsigned || !tokenFromHeadersUnsigned) {
      throw new HttpError(403, csrfErrorMessage);
    }

    // 4. double-submit cookie pattern
    if (tokenFromCookieUnsigned != tokenFromHeadersUnsigned) {
      throw new HttpError(403, csrfErrorMessage);
    }

    // 5. verify CSRF token
    if (!tokens.verify(csrfSecret, tokenFromCookieUnsigned)) {
      throw new HttpError(403, csrfErrorMessage);
    }

    // 6. If everything is okay and verified, generate a new token and save it in the cookie
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
