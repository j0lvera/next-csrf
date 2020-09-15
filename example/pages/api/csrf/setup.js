import { setup } from "../../../lib/csrf";

const handler = (req, res) => {
  res.statusCode = 200;
  res.json({ message: "CSRF token added to cookies" });
};

export default setup(handler);
