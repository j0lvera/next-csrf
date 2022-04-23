import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <p className={styles.description}>
        Get started by editing{" "}
        <code className={styles.code}>pages/index.js</code>
      </p>

      <div>
        <div className={styles.card}>
          <h3>Send a request without the CSRF token</h3>

          <p>
            Because any request we send from the browser will have a cookie with
            the token attached, try to send a request from a terminal and see
            what happens with a missing or an invalid CSRF token.
          </p>

          <pre>
            <code className={styles.code}>
              $ curl -X POST http://localhost:3000/api/protected
            </code>
          </pre>

          <pre>
            <code className={styles.code}>
              {`>> {"message": "Invalid CSRF token"}`}
            </code>
          </pre>
        </div>

        <div className={styles.card}>
          <h3>Send a request with the proper CSRF token setup</h3>

          <ol>
            <li>
              Go to the <Link href="login">Login</Link> page
            </li>
            <li>Open the Console</li>
            <li>
              Fill the form with "demo" for username and "demo" for password
            </li>
            <li>Submit the form, inspect the Console and the Network</li>
            <li>
              Try to modify the cookie values, try again, and see the request
              being blocked.
            </li>
          </ol>
        </div>
      </div>
      <style jsx>{`
        ol li {
          margin-bottom: 0.8rem;
        }
      `}</style>
    </>
  );
}
