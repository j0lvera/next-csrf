import { tokens } from '../csrf/tokens'
import { MiddlewareArgs } from "../types";
import { parseMiddlewareArgs } from "../utils";

function csrf(handler: Function, { secret, csrfSecret }: { secret: string, csrfSecret: string}) {
    return async function(...args: MiddlewareArgs) {
        const { req, res } = parseMiddlewareArgs(args);

        // 1. extract token from request
        const token = req.body && req.body._csrf;
        // 2. verify token
        if (!tokens.verify(csrfSecret, token)) {
            return res.status(403).json({ message: "Invalid CSRF token"})
        }
        // 3. return handler

        // sign CSRF secret
        // const csrfSecretSigned = sign(csrfSecret, secret);

        // Save CSRF secret in a cookie session
        // res.setHeader("Set-Cookie", serialize('_csrf', csrfSecretSigned))

        return handler(req, res)
    }

}

export { csrf }

