# next-csrf

![Discord](https://discord.com/api/guilds/778076094112464926/widget.png)

CSRF mitigation for Next.js.

## Features

Mitigation patterns that `next-csrf` implements:

* [Synchronizer Token Pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern) using [`csrf`](https://github.com/pillarjs/csrf) (Also [read Understanding CSRF](https://github.com/pillarjs/understanding-csrf#csrf-tokens))

### Installation

With yarn:

```bash
yarn add next-csrf
```

With npm:

```bash
npm i next-csrf --save
```

### Usage

Setup:

Create an initialization file to add options:

```js
// file: lib/csrf.js
import { nextCsrf } from "next-csrf";

const { csrf, setup } = nextCsrf({
    // eslint-disable-next-line no-undef
    secret: process.env.CSRF_SECRET,
});

export { csrf, setup };

```

Create a setup endpoint:

```js
// file: pages/api/csrf/setup.js
import { setup } from "../../../lib/csrf";

const handler = (req, res) => {
  res.statusCode = 200;
  res.json({ message: "CSRF token added to cookies" });
};

export default setup(handler);
```

On the first request, or any time you want to set up the CSRF token, send a GET request to the setup endpoint, in this example `/api/csrf/setup`, and you will receive a cookie with the CSRF token on the response.

```js
const response = await fetch('/api/csrf/setup');

if (response.ok) {
    console.log('CSRF token setup')
}
```

Protect an API endpoint:

```js
// file: pages/api/protected.js

import { csrf } from '../lib/csrf';

const handler = (req, res) => {
    return res.status(200).json({ message: "This API route is protected."})
}

export default csrf(handler);
```

Every time you hit a protected API route you will replace the token in your cookie with a new one.