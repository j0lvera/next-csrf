import { nextCsrf } from "next-csrf";

const options = {
  // eslint-disable-next-line no-undef
  secret: process.env.CSRF_SECRET,
};

console.log("options", options);

export const { csrf, setup, csrfToken } = nextCsrf(options);
