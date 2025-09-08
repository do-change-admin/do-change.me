const { validateBuildEnv } = require("./validate-env");
const { execSync } = require("child_process");

try {
  validateBuildEnv();
  console.log("🚀 Running next build...");
  execSync("next build", { stdio: "inherit" });
} catch (error) {
  console.error("❌ Build failed due to invalid environment variables.");
  process.exit(1);
}