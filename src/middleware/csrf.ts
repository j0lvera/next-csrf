import { HttpError } from "../utils";
import { serialize, parse } from "cookie";
import { sign, unsign } from "cookie-signature";
import { createToken } from "../utils/create-token";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { MiddlewareArgs } from "../types";

const csrf = (
  handler: NextApiHandler,
  {
    ignoredMethods,
    csrfErrorMessage,
    tokenKey,
    cookieOptions,
    secret,
  }: MiddlewareArgs
) => async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    if (typeof req.method !== "string") {
      throw new HttpError(403, csrfErrorMessage);
    }

    // Do nothing on if method is in `ignoreMethods`
    if (ignoredMethods.includes(req.method)) {
      return handler(req, res);
    }

    // Fail if no cookie is present
    if (req.headers?.cookie === undefined) {
      throw new HttpError(403, csrfErrorMessage);
    }

    const cookie = parse(req.headers?.cookie);
    // Extract secret and token from their cookies
    let token = cookie[tokenKey];
    const csrfSecret = cookie["csrfSecret"];

    // Check token is in the cookie
    if (!token) {
      throw new HttpError(403, csrfErrorMessage);
    }

    // If user provided a secret, then the cookie is signed.
    // Unsign and verify aka Synchronizer token pattern.
    // https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern
    if (secret != null) {
      // unsign cookie
      const unsignedToken = unsign(token, secret);

      // validate signature
      if (!unsignedToken) {
        throw new HttpError(403, csrfErrorMessage);
      }

      token = unsignedToken;
    }

    // 5. verify CSRF token
    if (!createToken.verify(csrfSecret, token)) {
      throw new HttpError(403, csrfErrorMessage);
    }

    // If token is verified, generate a new one and save it in the cookie
    let newToken;
    if (secret != null) {
      // Sign if `secret` is present
      newToken = sign(createToken.create(csrfSecret), secret);
    } else {
      newToken = createToken.create(csrfSecret);
    }

    res.setHeader("Set-Cookie", serialize(tokenKey, newToken, cookieOptions));

    return handler(req, res);
  } catch (error) {
    return res.status(error.status ?? 500).json({ message: error.message });
  }
};

export { csrf };
