import { sign} from "cookie-signature";
import {tokens} from "./csrf/tokens";
import {csrf} from "./middleware";

function nextCsrf({secret}: { secret: string }) {
    // generate CSRF secret
    const csrfSecret = tokens.secretSync();

    // generate CSRF token
    const csrfToken = tokens.create(csrfSecret)

    // sign CSRF secret
    const csrfSecretSigned = sign(csrfSecret, secret);

    // generate middleware to verify CSRF token with the CSRF as parameter
    return {
        csrfToken,
        csrf: (handler: Function) =>
            csrf(handler, {secret, csrfSecret: csrfSecretSigned}),
    }
}

export {nextCsrf}