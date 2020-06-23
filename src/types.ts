import { CookieSerializeOptions } from "cookie";

interface NextCsrfOptions {
  secret: string;
  csrfSecret: string;
  secretKey: string;
  tokenKey: string;
  cookieOptions: CookieSerializeOptions;
}

export { NextCsrfOptions };
