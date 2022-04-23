import { CookieSerializeOptions } from "cookie";

interface NextCsrfOptions {
  ignoredMethods?: string[];
  csrfErrorMessage?: string;
  tokenKey?: string;
  cookieOptions?: CookieSerializeOptions;
  secret?: string;
}

// Make the optional parameters in `nextCsrf` required in the `csrf` middleware
interface MiddlewareArgs extends NextCsrfOptions {
  csrfErrorMessage: string;
  ignoredMethods: string[];
  tokenKey: string;
  cookieOptions: CookieSerializeOptions;
}

interface SetupMiddlewareArgs {
  tokenKey: string;
  cookieOptions: CookieSerializeOptions;
  secret?: string;
}

export { NextCsrfOptions, MiddlewareArgs, SetupMiddlewareArgs };
