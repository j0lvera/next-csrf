import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <p className={styles.description}>
        Get started by editing{" "}
        <code className={styles.code}>pages/index.js</code>
      </p>

      <div>
        <div className={styles.card}>
          <h3>Send a request with a valid CSRF token</h3>

          <p>
            Open the Web Console and click in the button below to see how a
            valid request works.
          </p>

          {/*<button*/}
          {/*  id="with-csrf"*/}
          {/*  className={styles.button}*/}
          {/*  onClick={requestWithToken}*/}
          {/*>*/}
          {/*  With CSRF token*/}
          {/*</button>*/}
        </div>

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
      </div>
    </>
  );
}
