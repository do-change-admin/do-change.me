import { injectable } from "inversify";
import { AnyErrorModel, ILoggerProvider } from "../logger.provider";

@injectable()
export class ConsoleLoggerProvider implements ILoggerProvider {
    async info(message: string, context?: Record<string, unknown>) {
        console.log(`[INFO] ${message}`, context || "");
    }

    async warn(message: string, context?: Record<string, unknown>) {
        console.warn(`[WARN] ${message}`, context || "");
    }

    async error(error: AnyErrorModel) {
        console.error(`[ERROR] ${error.name}: ${error.message}`, error);
    }
}
