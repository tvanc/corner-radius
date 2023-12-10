import { defineConfig } from "cypress"

export default defineConfig({
  e2e: {
    supportFile: false,
    specPattern: "cypress/integration/**/*.{js,jsx,ts,tsx}",
  },
})
