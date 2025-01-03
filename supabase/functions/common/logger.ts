import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import * as Sentry from "npm:@sentry/deno";

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  VERBOSE = 3,
  DEBUG = 4,
}

const env = config();

export class Logger {
  private logLevel: LogLevel;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${LogLevel[level]}: ${message}`;
  }

  public log(message: string, level: LogLevel): void {
    if (this.shouldLog(level)) {
      const formattedMessage = this.formatMessage(level, message);
      switch (level) {
        case LogLevel.ERROR:
          console.error(formattedMessage);
          Sentry.captureMessage(formattedMessage, "error");
          break;
        case LogLevel.INFO:
          console.log(formattedMessage);
          Sentry.captureMessage(formattedMessage, "info");
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage);
          Sentry.captureMessage(formattedMessage, "warning");
          break;
        case LogLevel.VERBOSE:
          console.log(formattedMessage);
          Sentry.captureMessage(formattedMessage, "info");
          break;
        case LogLevel.DEBUG:
          console.log(formattedMessage);
          Sentry.captureMessage(formattedMessage, "debug");
          break;
      }
    }
  }

  public error(message: string, error?: Error): void {
    this.log(
      `${message}${error ? ` | ${error.message}` : ""}`,
      LogLevel.ERROR,
    );
  }

  public warn(message: string): void {
    this.log(message, LogLevel.WARN);
  }

  public info(message: string): void {
    this.log(message, LogLevel.INFO);
  }

  public verbose(message: string): void {
    this.log(message, LogLevel.VERBOSE);
  }

  public debug(message: string): void {
    this.log(message, LogLevel.DEBUG);
  }
}

const logLevel = LogLevel[env.LOG_LEVEL as keyof typeof LogLevel] ||
  LogLevel.INFO;
export const logger = new Logger(logLevel);
