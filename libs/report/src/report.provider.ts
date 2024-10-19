export class ReportProvider {
  static report(
    message: string,
    extra: Record<string, unknown>,
    moduleName: string,
  ): void {
    // Sentry.withScope((scope) => {
    //   for (const [key, value] of Object.entries(extra)) {
    //     scope.setExtra(key, value);
    //   }
    //   scope.setExtra('moduleName', moduleName);
    //   Sentry.captureMessage(message);
    // });
  }
}
