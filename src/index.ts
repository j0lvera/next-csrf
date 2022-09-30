import { NextApiHandler } from "next";
import { csrf, setup } from "./middleware";
import { NextCsrfOptions } from "./types";
import { CookieSerializeOptions } from "cookie";

const cookieDefaultOptions: CookieSerializeOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

const defaultOptions = {
  tokenKey: "XSRF-TOKEN",
  csrfErrorMessage: "Invalid CSRF token",
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  cookieOptions: cookieDefaultOptions,
};

type Middleware = (handler: NextApiHandler) => any;

type NextCSRF = {
  setup: Middleware;
  csrf: Middleware;
};

function nextCsrf(userOptions: NextCsrfOptions): NextCSRF {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  // generate middleware
  return {
    setup: (handler: NextApiHandler) =>
      setup(handler, {
        tokenKey: options.tokenKey,
        cookieOptions: options.cookieOptions,
        secret: options.secret,
      }),
    csrf: (handler: NextApiHandler) => csrf(handler, options),
  };
}

export { nextCsrf };
