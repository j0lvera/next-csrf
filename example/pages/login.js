import styles from "../styles/Home.module.css";
import { setup } from "../lib/csrf";

function Login() {
  const requestWithToken = (event) => {
    event.preventDefault();

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
  };

  return (
    <>
      <p>Use "demo" for both login and password</p>
      <form className={styles.form} onSubmit={requestWithToken}>
        <label>
          Login
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
