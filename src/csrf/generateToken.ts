import { tokens } from "./tokens";

function generateCsrfToken() {
    const csrfSecret = tokens.secretSync();
    return () => tokens.create(csrfSecret);
}

export { generateCsrfToken };
