import * as qs from "querystring";
import { NextApiRequest } from "next";

function parseBody(req: NextApiRequest): Promise<string | object> {
  const contentType = req.headers["content-type"];
  const isForm = contentType === "application/x-www-form-urlencoded";
  const isJson = contentType === "application/json";

  return new Promise((resolve, reject) => {
    if (req.headers["content-type"] === "application/x-www-form-urlencoded") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        if (isForm) {
          resolve(qs.parse(body));
        }

        if (isJson) {
          resolve(JSON.parse(body));
        }
      });
    } else {
      reject(new Error(`Content type ${contentType} not supported`));
    }
  });
}

export { parseBody };
