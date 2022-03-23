import { HttpError } from "../utils";
import { serialize, parse } from "cookie";
import { sign, unsign } from "cookie-signature";
import { tokens } from "../csrf";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "../cookies";
import { MiddlewareArgs } from "../types";
import { getSecret } from "../get-secret";

const csrf = (
  handler: NextApiHandler,
  { ignoredMethods, csrfErrorMessage, tokenKey, cookieOptions }: MiddlewareArgs
) => async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    // Do nothing on if method is in `ignoreMethods`
    if (ignoredMethods.includes(req.method as string)) {
      return handler(req, res);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const cookie = parse(req.headers?.cookie);
    console.log("cookies", cookie);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const token = cookie[tokenKey];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const secret = cookie["csrfSecret"];

    console.log("token", token);
    console.log("secret", secret);

    // 1. extract secret and token from their cookies

    // 5. verify CSRF token
    if (!tokens.verify(secret, token)) {
      throw new HttpError(403, csrfErrorMessage);
    }

    // If everything is okay and verified, generate a new token and save it in the cookie
    const newToken = tokens.create(secret);

    res.setHeader("Set-Cookie", serialize(tokenKey, newToken, cookieOptions));

    return handler(req, res);
  } catch (error) {
    return res.status(error.status ?? 500).json({ message: error.message });
  }
};

export { csrf };
