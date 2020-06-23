import { HttpError } from "../utils/httpError";
import { serialize } from "cookie";
import { sign, unsign } from "cookie-signature";
import { tokens } from "../csrf/tokens";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "../cookies";
import { NextCsrfOptions } from "../types";

const getToken = (req: NextApiRequest): string | string[] => {
  return (
    req.headers["csrf-token"] ||
    req.headers["xsrf-token"] ||
    req.headers["x-csrf-token"] ||
    req.headers["x-xsrf-token"] ||
    ""
  );
};

const csrf = (
  handler: NextApiHandler,
  { csrfSecret, secretKey, secret, tokenKey, cookieOptions }: NextCsrfOptions
) => async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    // If no secret in memory it means we do per-request token generation without custom `_app.js`
    if (csrfSecret === null) {
      // 1. extract secret and token from their cookies
      const secretFromCookie = unsign(getCookie(req, secretKey), secret);
      const tokenFromCookie = unsign(getCookie(req, tokenKey), secret);

      // 2. extract token from custom header
      const tokenFromHeaders = unsign(<string>getToken(req), secret);

      // 3. verify signature
      if (!secretFromCookie || !tokenFromCookie || !tokenFromHeaders) {
        throw new HttpError(403, "Invalid CSRF token");
      }

      // 4. double-submit cookie pattern
      if (tokenFromCookie != tokenFromHeaders) {
        throw new HttpError(403, "Invalid CSRF token");
      }

      // 5. verify CSRF token
      if (!tokens.verify(secretFromCookie, tokenFromCookie)) {
        throw new HttpError(403, "Invalid CSRF token");
      }

      // If secret is not present in cookie and memory it means it's the first request to an API route.
      // So, we generate a new secret and sign the cookie
      const reqCsrfSecret =
        secretFromCookie ?? sign(tokens.secretSync(), secret);
      const reqCsrfToken = sign(tokens.create(reqCsrfSecret), secret);

      res.setHeader(
        "Set-Cookie",
        serialize(secretKey, reqCsrfSecret, cookieOptions)
      );
      res.setHeader(
        "Set-Cookie",
        serialize(tokenKey, reqCsrfToken, cookieOptions)
      );

      return handler(req, res);
    }
  } catch (error) {
    res.statusCode = error.status ?? 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: error.message }));
    return;
  }
};

export { csrf };
