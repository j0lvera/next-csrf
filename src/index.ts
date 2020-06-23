import { NextApiHandler } from "next";
import { tokens } from "./csrf/tokens";
import { csrf } from "./middleware";
import { NextCsrfOptions } from "./types";

const defaultOptions = {
  secret: "",
  secretKey: "_csrf",
  tokenKey: "XSRF-TOKEN",
};

function nextCsrf(userOptions: NextCsrfOptions) {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  // generate CSRF secret
  const csrfSecret = tokens.secretSync();

  // generate CSRF token
  const csrfToken = tokens.create(csrfSecret);

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
