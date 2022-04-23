import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testMatch: "**/*.e2e.ts",
  webServer: {
    command: "npm --prefix example run dev",
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
