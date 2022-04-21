// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { csrf } from "../../lib/csrf";

const handler = (req, res) => {
  res.statusCode = 200;
  res.json({ message: "Request successful" });
};

export default csrf(handler);
