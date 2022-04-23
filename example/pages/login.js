import styles from "../styles/Home.module.css";
import { setup } from "../lib/csrf";

function Login() {
  const requestWithToken = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/protected", {
      method: "post",
    });

    if (response.ok) {
      console.log("protected response ok");
      console.log(response);
    }
  };

  return (
    <>
      <p>Use "demo" for both username and password</p>
      <form className={styles.form} onSubmit={requestWithToken}>
        <label>
          Username
          <input type="text" required />
        </label>

        <label htmlFor="password">
          Password
          <input type="password" required />
        </label>

        <button>Submit</button>
      </form>
    </>
  );
}

export const getServerSideProps = setup(async ({ req, res }) => {
  return { props: {} };
});

export default Login;
