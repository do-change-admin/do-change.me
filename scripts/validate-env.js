require("dotenv").config();
const { z, ZodError } = require("zod");

const buildEnvSchema = z.object();

const runtimeEnvSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().min(1, "Cannot be empty"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "Cannot be empty"),
  STRIPE_SECRET_KEY: z.string().min(1, "Cannot be empty"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "Cannot be empty"),
  TOKEN_TTL_MS: z.coerce.number().min(60000, "Must be at least 60,000 ms (1 min)"),
  RESEND_API_KEY: z.string().min(1, "Cannot be empty"),
  NEXTAUTH_URL: z.url(),
  DATABASE_URL: z.string(),
  ADMIN_EMAILS: z.string(),
  DEMO_VIN: z.string(),
  BLOB_READ_WRITE_TOKEN: z.string(),
  BASE_INFO_API_URL: z.string(),
  ODOMETER_API: z.string(),
  ODOMETER_API_KEY_01: z.string(),
  ODOMETER_API_KEY_02: z.string(),
  ODOMETER_API_KEY_03: z.string(),
  REPORT_ENDPOINT: z.string(),
  SALVAGE_HOST: z.string(),
  SALVAGE_ENDPOINT: z.string(),
  VIN_SCANNER_HOST: z.string(),
  VIN_SCANNER_ENDPOINT: z.string(),
  MARKET_VALUE_HOST: z.string(),
  MARKET_VALUE_ENDPOINT: z.string(),
  RAPID_API_KEY: z.string(),
})

function validateBuildEnv() {
  try {
    buildEnvSchema.parse(process.env);
    console.log("✅ Build environment variables are valid.");
  } catch (err) {
    handleValidationError(err);
    process.exit(1);
  }
}

function validateRuntimeEnv() {
  try {
    runtimeEnvSchema.parse(process.env);
    console.log("✅ Runtime environment variables are valid.");
  } catch (err) {
    handleValidationError(err);
    process.exit(1);
  }
}

function handleValidationError(error) {
  if (error instanceof ZodError) {
    console.error("❌ Environment validation failed:");
    for (const issue of error.issues) {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    }
  } else {
    console.error(error);
  }
}

module.exports = { validateBuildEnv, validateRuntimeEnv };
