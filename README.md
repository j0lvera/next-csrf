# next-csrf

CSRF mitigation for Next.js.

## Features

Mitigation patterns that `next-csrf` implements:

* [Synchronizer Token Pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern) using [`csrf`](https://github.com/pillarjs/csrf) (Also [read Understanding CSRF](https://github.com/pillarjs/understanding-csrf#csrf-tokens))
* [Double-submit cookie pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie)
* [Custom request headers](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#use-of-custom-request-headers)

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

```js
// file: lib/csrf.js
import { nextCsrf } from "next-csrf";

const options = {
    secret: process.env.CSRF_SECRET // Long, randomly-generated, unique, and unpredictable value
}

export const { csrf, csrfToken } = nextCsrf(options);
```

When you initialize `nextCsrf` it will return the middleware, and a valid signed CSRF token. You can send it along with a custom header on your first request to a protected API route. Is not required, but recommended.

If you don't send the given CSRF token on the first request one is set up on any first request you send to a protected API route.

You can pass the token down as a prop on a custom `_app.js` and then use it on your first request.

Keep in mind that the token is valid only on the first request, since we create a new one on each request.

Custom App:

```js
// file: pages/_app.js
import App from 'next/app'
import { csrfToken } from '../lib/csrf';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} csrfToken={csrfToken} />
}

export default MyApp
```

Usage with `fetch`:

```jsx
function Login({ csrfToken }) {
    const sendRequest = async (e) => {
        e.preventDefault(); 
        const response = await fetch('/api/protected', {
            'headers': {
                'XSRF-TOKEN': csrfToken,
            }
        });
        // ...
    };

    return (
        <Form onSubmit={sendRequest}>
            // ...
        </Form>
    );
}

export default Login;
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
