import Head from "next/head";
import styles from "../styles/Home.module.css";
import { setup } from "../lib/csrf";

export default function Home() {
  // We send a request to setup the csrf token
  // fetch("http://localhost:3000/api/csrf/setup")
  //   .then((response) => {
  //     console.log(response);
  //     if (response.ok) {
  //       console.log("response ok");
  //       console.log("csrf token setup correctly");
  //       // console.log("cookies", document.cookie);
  //     }
  //   })
  //   .catch((error) => console.error(error));

  const requestWithToken = () =>
    fetch("/api/protected", {
      method: "post",
    })
      .then((response) => {
        if (response.ok) {
          console.log("protected response ok");
          console.log(response);
        }
      })
      .catch((error) => console.error(error));

  return (
    <div className={styles.container}>
      <Head>
        <title>Next CSRF</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Next CSRF</h1>

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

            <button className={styles.button} onClick={requestWithToken}>
              With CSRF token
            </button>
          </div>

          <div className={styles.card}>
            <h3>Send a request without the CSRF token</h3>

            <p>
              Because any request we send from the browser will have a cookie
              with the token attached, try to send a request from a terminal and
              see what happens with a missing or an invalid CSRF token.
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
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

export const getServerSideProps = setup(async () => {
  return { props: {} };
});
