import request from "supertest";
import http, { IncomingMessage, ServerResponse } from "http";
import { apiResolver } from "next/dist/next-server/server/api-utils";
import { NextApiRequest, NextApiResponse } from "next";
import { nextCsrf } from "../index";

describe("csrf middleware", () => {
  const secret = "yoMqR8xtQUhbmLwM*kRK";
  const tokenKey = "XSRF-TOKEN";
  const secretKey = "_csrf";
  const userOptions = {
    secret,
    tokenKey,
    secretKey,
    cookieOptions: { httpOnly: true, path: "/" },
  };

  // mock for `apiResolver`'s 5th parameter to please TS
  const apiPreviewPropsMock = {
    previewModeId: "id",
    previewModeEncryptionKey: "key",
    previewModeSigningKey: "key",
  };

  const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    apiResolver(
      req,
      res,
      undefined,
      csrf((req: NextApiRequest, res: NextApiResponse) => {
        return res.status(200).json({ message: "Hello, world." });
      }),
      apiPreviewPropsMock
    );
  };

  const { csrf } = nextCsrf(userOptions);
  it("should setup a CSRF token on the first request, i.e. when there's no token already in a cookie", async () => {
    // If we receive a request without secret in a cookie we assume it's the first request to an API route

    const server = http.createServer(requestListener);
    const agent = await request.agent(server).get("/");

    expect(agent.header["set-cookie"][0]).toEqual(
      expect.stringMatching(/XSRF-TOKEN=(.+); Path=\/; HttpOnly/g)
    );

    expect(agent.text).toBe(JSON.stringify({ message: "Hello, world." }));
  });

  it("should validate a token with a secret and send 200 if everything is okay after the first request", async () => {
    const server = http.createServer(requestListener);
    const firstRequest = await request.agent(server).get("/");

    // Grab the token and secret from the response
    const [reqCsrfToken] = firstRequest.header["set-cookie"];

    // Send back the token in a header and a cookie
    const secondRequest = await request
      .agent(server)
      .get("/")
      .set("Cookie", reqCsrfToken)
      .set(tokenKey, reqCsrfToken);

    expect(secondRequest.status).toBe(200);
  });

  it("should return 403 if we don't send a valid token in a custom header and a cookie", async () => {
    const server = http.createServer(requestListener);
    const firstRequest = await request.agent(server).get("/");

    // Grab the token and secret from the response
    const [reqCsrfToken] = firstRequest.header["set-cookie"];

    const [token, signature] = reqCsrfToken.split(".");
    const tamperedToken = `${token}.invalidSignature`;

    // Request without token in a custom header
    const secondRequest = await request
      .agent(server)
      .get("/")
      .set("Cookie", reqCsrfToken);

    // Request with an invalid token in a custom header
    const thirdRequest = await request
      .agent(server)
      .get("/")
      .set("Cookie", reqCsrfToken)
      .set(tokenKey, tamperedToken);

    // Request with an invalid token in the cookie
    const fourthRequest = await request
      .agent(server)
      .get("/")
      .set("Cookie", tamperedToken)
      .set(tokenKey, reqCsrfToken);

    expect(secondRequest.status).toBe(403);
    expect(thirdRequest.status).toBe(403);
    expect(fourthRequest.status).toBe(403);
  });
});
