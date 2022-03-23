import { serialize } from "cookie";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function setSecret(req, res, secret, cookieOptions) {
  res.setHeader("Set-Cookie", serialize("csrfSecret", secret, cookieOptions));
}

export { setSecret };
