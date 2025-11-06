import { injectable } from "inversify";
import { AnyErrorModel, ILogger } from "../logger.service";

@injectable()
export class ConsoleLogger implements ILogger {
    async info(message: string, context?: Record<string, unknown>) {
        console.log(`[INFO] ${message}`, context || "");
    }

    async warn(message: string, context?: Record<string, unknown>) {
        console.warn(`[WARN] ${message}`, context || "");
    }

    async error(error: AnyErrorModel) {
        console.error(`[ERROR] ${error.name}: ${error.message}`, {
            code: error.code,
            timestamp: new Date(error.timestamp).toISOString(),
            details: error.details,
            stack: error.stack,
            module: "module" in error ? error.module : undefined,
            method: "method" in error ? error.method : undefined,
            source: "source" in error ? error.source : undefined,
            cause: "cause" in error ? error.cause : undefined,
        });
    }
}
