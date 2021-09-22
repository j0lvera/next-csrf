import { CookieSerializeOptions } from "cookie";

interface NextCsrfOptions {
  secret: string;
  ignoredMethods?: string[];
  csrfErrorMessage?: string;
  tokenKey?: string;
  cookieOptions?: CookieSerializeOptions;
}

// Make the optional parameters in `nextCsrf` required in the `csrf` middleware
interface MiddlewareArgs extends NextCsrfOptions {
  csrfErrorMessage: string;
  ignoredMethods: string[];
  csrfSecret: string;
  tokenKey: string;
  cookieOptions: CookieSerializeOptions;
}

interface SetupMiddlewareArgs {
  csrfSecret: string;
  secret: string;
  tokenKey: string;
  cookieOptions: CookieSerializeOptions;
}

export { NextCsrfOptions, MiddlewareArgs, SetupMiddlewareArgs };
