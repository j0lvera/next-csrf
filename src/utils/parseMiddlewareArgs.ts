import { GetServerSidePropsContext } from "next";
import { IncomingMessage, ServerResponse } from "http";
import { MiddlewareArgs } from "../types";


// Parse args to make middlewares compatible with Next.js API routes or SSR pages
function parseMiddlewareArgs(
    args: MiddlewareArgs
): { req: IncomingMessage; res: ServerResponse } {
    const isApi = args.length > 1;

    // One argument means we are in `getServerSideProps` and `context` is passed,
    // otherwise we are in an API route and `req` and `res` are passed instead.
    const req = isApi
        ? (args[0] as IncomingMessage)
        : (args[0] as GetServerSidePropsContext).req;
    const res = isApi
        ? (args[1] as ServerResponse)
        : (args[0] as GetServerSidePropsContext).res;

    return { req, res };
}

export { parseMiddlewareArgs };
