import { NextApiHandler } from "next";
import { sign } from "cookie-signature";
import { tokens } from "./csrf/tokens";
import { csrf } from "./middleware";
import { NextCsrfOptions } from "./types";

const defaultOptions = {
  tokenKey: "XSRF-TOKEN",
  csrfErrorMessage: "Invalid CSRF token",
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  cookieOptions: {
    httpOnly: true,
    path: "/",
  },
};

function nextCsrf(userOptions: NextCsrfOptions) {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  // generate CSRF secret
  const csrfSecret = tokens.secretSync();

  // generate CSRF token
  const csrfToken = sign(tokens.create(csrfSecret), options.secret);

  // generate options for the csrf middleware
  const csrfOptions = {
    ...options,
    csrfSecret,
  };

  // generate middleware to verify CSRF token with the CSRF as parameter
  return {
    csrfToken,
    csrf: (handler: NextApiHandler) => csrf(handler, csrfOptions),
  };
}

export { nextCsrf };
