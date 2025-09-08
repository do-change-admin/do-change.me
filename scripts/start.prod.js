const { validateRuntimeEnv } = require("./validate-env");
const { execSync } = require("child_process");

try {
  validateRuntimeEnv();
  console.log("🚀 Starting Next.js app...");
  execSync("next start", { stdio: "inherit" });
} catch (error) {
  console.error("❌ Start failed due to invalid environment variables.");
  process.exit(1);
}