import { nextCsrf } from "next-csrf";

const options = {
  // secret: process.env.CSRF_SECRET,
  secret: "P*3NGEEaJV3yUGDJA9428EQRg!ad",
};

export const { csrf, setup, csrfToken } = nextCsrf(options);
