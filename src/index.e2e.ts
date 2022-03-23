import { test, expect } from "@playwright/test";
// import axios from "axios";

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
