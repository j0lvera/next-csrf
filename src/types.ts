import { CookieSerializeOptions } from "cookie";

interface NextCsrfOptions {
  secret: string;
  csrfErrorMessage?: string;
  tokenKey?: string;
  cookieOptions?: CookieSerializeOptions;
}

// Make the optional parameters in `nextCsrf` required in the `csrf` middleware
interface MiddlewareArgs extends NextCsrfOptions {
  csrfErrorMessage: string;
  csrfSecret: string;
  tokenKey: string;
  cookieOptions: CookieSerializeOptions;
}

export { NextCsrfOptions, MiddlewareArgs };
