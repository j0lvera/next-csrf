import {
  GetServerSidePropsContext,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { SetupMiddlewareArgs } from "../types";
import { tokens } from "../csrf";
import { sign } from "cookie-signature";
import { serialize } from "cookie";

type SetupArgs =
  | NextApiRequest[]
  | NextApiResponse[]
  | GetServerSidePropsContext[];

const setup = (
  handler: NextApiHandler,
  { csrfSecret, secret, tokenKey, cookieOptions }: SetupMiddlewareArgs
) => async (...args: SetupArgs): Promise<void> => {
  const isApi = args.length > 1;

  const req = isApi
    ? (args[0] as NextApiRequest) // (*req*, res)
    : (args[0] as GetServerSidePropsContext).req; // (context).req
  const res = isApi
    ? (args[1] as NextApiResponse) // (req, *res*)
    : (args[0] as GetServerSidePropsContext).res; // (context).res

  const reqCsrfToken = tokens.create(csrfSecret);
  const reqCsrfTokenSigned = sign(reqCsrfToken, secret);

  res.setHeader(
    "Set-Cookie",
    serialize(tokenKey, reqCsrfTokenSigned, cookieOptions)
  );

  return handler(req as NextApiRequest, res as NextApiResponse);
};

export { setup };
