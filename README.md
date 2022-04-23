# next-csrf

![Discord](https://discord.com/api/guilds/778076094112464926/widget.png)

CSRF mitigation for Next.js.

## Features

Mitigation patterns that `next-csrf` implements:

* [Synchronizer Token Pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern) using [`csrf`](https://github.com/pillarjs/csrf) (Also [read Understanding CSRF](https://github.com/pillarjs/understanding-csrf#csrf-tokens))

## Installation

With yarn:

```bash
yarn add next-csrf
```

With npm:

```bash
npm i next-csrf --save
```

## Usage

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

Protect an API endpoint:

```js
// file: pages/api/protected.js

import { csrf } from '../lib/csrf';

const handler = (req, res) => {
    return res.status(200).json({ message: "This API route is protected."})
}

export default csrf(handler);
```

Test the protected API route by sending a POST request from your terminal. Since this request doesn't have the proper token setup, it wil fail.

```shell
curl -X POST http://localhost:3000/api/protected
>> {"message": "Invalid CSRF token"}
```

Use an [SSG page](https://nextjs.org/docs/basic-features/pages#server-side-rendering) to set up the token. Usually, you use CSRF mitigation to harden your requests from authenticated users, if this is the case then you should use the login page.

```js
// file: pages/login.js

import { setup } from '../lib/csrf';

function Login() {
    const loginRequest = async (event) => {
        event.preventDefault();
        
        // The secret and token are sent with the request by default, so no extra
        // configuration is needed in the request.
        const response = await fetch('/api/protected', {
            method: 'post'
        });
        
        if (response.ok) {
            console.log('protected response ok');
        }
    }
    
    return (
        <form onSubmit={loginRequest}>
            <label>
                Username
                <input type="text" required />
            </label>
            
            <label>
                Password
                <input type="password" required />
            </label>
            
            <button>Submit</button>
        </form>
    )
}

// Here's the important part. `setup` saves the necesary secret and token.
export const getServerSideProps = setup(async ({req, res}) => {
    return { props: {}}
});

export default Login;
```

## API

### `nextCsrf(options);`

Returns two functions: 

* `setup` Setups two cookies, one for the secret and other one for the token. Only works on SSG pages.
* `csrf` Protects API routes from requests without the token. Validates and verify signatures on the cookies.

#### `options`

* `tokenKey` (`string`) The name of the cookie to store the CSRF token. Default is `"XSRF-TOKEN"`.
* `csrfErrorMessage` (`string`) Error message to return for unauthorized requests. Default is `"Invalid CSRF token"`.
* `ignoredMethods`: (`string[]`) Methods to ignore, i.e. let pass all requests with these methods. Default is `["GET", "HEAD", "OPTIONS"]`.
* `cookieOptions`: Same options as https://www.npmjs.com/package/cookie