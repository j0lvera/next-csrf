import {
  GetServerSidePropsContext,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { SetupMiddlewareArgs } from "../types";
import { createToken } from "../utils/create-token";
import { sign } from "cookie-signature";
import { serialize } from "cookie";
import { getSecret } from "../utils/get-secret";

type SetupArgs =
  | NextApiRequest[]
  | NextApiResponse[]
  | GetServerSidePropsContext[];

const setup = (
  handler: NextApiHandler,
  { secret, tokenKey, cookieOptions }: SetupMiddlewareArgs
) => async (...args: SetupArgs): Promise<void> => {
  const isApi = args.length > 1;

  const req = isApi
    ? (args[0] as NextApiRequest) // (*req*, res)
    : (args[0] as GetServerSidePropsContext).req; // (context).req
  const res = isApi
    ? (args[1] as NextApiResponse) // (req, *res*)
    : (args[0] as GetServerSidePropsContext).res; // (context).res

  const csrfSecret = getSecret(req, "csrfSecret") || createToken.secretSync();
  const unsignedToken = createToken.create(csrfSecret);

  // TODO:
  // Make a note that if the user changes the secret in the backend all the sessions
  // will invalidate
  let token;
  if (secret != null) {
    token = sign(unsignedToken, secret);
  } else {
    token = unsignedToken;
  }

  res.setHeader("Set-Cookie", [
    serialize("csrfSecret", csrfSecret, cookieOptions),
    serialize(tokenKey, token, cookieOptions),
  ]);

  return handler(req as NextApiRequest, res as NextApiResponse);
};

export { setup };
