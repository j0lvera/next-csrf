import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Next CSRF</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <header>
          <h1 className={styles.title}>Next CSRF</h1>

          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="login">Login</Link>
          </nav>
        </header>

        <div>{children}</div>
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

export default Layout;
