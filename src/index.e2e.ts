import { test, expect } from "@playwright/test";
// import axios from "axios";

// Go to login page
// Check for secret and token
// Submit the form
// Expect 200

// Go to login page
// Check for secret and token
// Modify token
// Expect 403

// Go to login page
// Check for secret and token
// Modify token
// Expect 403

// Send a GET request to /login
// Grab the cookies
// Send a POST request to /api/protected with the same cookies
// Expect 200

// Send a GET request to /login
// Grab the cookies
// Modify the cookies
// Send a POST request to /api/protected with the same cookies
// Expect 403

test("config is setup correctly in the example", async ({ page, baseURL }) => {
  if (baseURL != null) {
    await page.goto(baseURL);

    const [response] = await Promise.all([
      page.waitForResponse((res) => res.status() === 200),
      page.click("button#with-csrf"),
    ]);

    expect(response.status()).toBe(200);

    // const axiosResponse = await axios.post(`${baseURL}/api/protected`);
    // console.log("axios response", axiosResponse.status);
  }
});
