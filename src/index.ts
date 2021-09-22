import { NextApiHandler } from "next";
import { sign } from "cookie-signature";
import { tokens } from "./csrf";
import { csrf, setup } from "./middleware";
import { NextCsrfOptions } from "./types";

const defaultOptions = {
  tokenKey: "XSRF-TOKEN",
  csrfErrorMessage: "Invalid CSRF token",
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  cookieOptions: {
    httpOnly: true,
    path: "/",
    SameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
  csrfSecret: tokens.secretSync(),
};

function nextCsrf(userOptions: NextCsrfOptions) {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  // generate CSRF token
  const csrfToken = sign(tokens.create(options.csrfSecret), options.secret);

  // generate options for the csrf middleware
  const csrfOptions = {
    ...options,
  };

  // generate middleware to verify CSRF token with the CSRF as parameter
  return {
    csrfToken,
    setup: (handler: NextApiHandler) =>
      setup(handler, {
        csrfSecret: options.csrfSecret,
        secret: options.secret,
        tokenKey: options.tokenKey,
        cookieOptions: options.cookieOptions,
      }),
    csrf: (handler: NextApiHandler) => csrf(handler, csrfOptions),
  };
}

export { nextCsrf };
