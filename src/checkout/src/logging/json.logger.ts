/**
 * JSON logger so FluentBit/OpenSearch can parse `level` reliably.
 * Emits one compact JSON object per line on stdout, using the shared log
 * schema shared across all services: timestamp, level, message, logger, service.
 */
import { LoggerService } from '@nestjs/common';
import { trace } from '@opentelemetry/api';

export class JsonLogger implements LoggerService {
  private static readonly SERVICE = 'checkout';

  private write(level: string, message: unknown, logger?: string) {
    const entry: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      logger: logger ?? 'app',
      service: JsonLogger.SERVICE,
    };
    // Correlate this log line with the distributed trace, so logs from every
    // service handling the same request share one trace_id.
    const span = trace.getActiveSpan();
    if (span) {
      const sc = span.spanContext();
      entry.trace_id = sc.traceId;
      entry.span_id = sc.spanId;
    }
    process.stdout.write(JSON.stringify(entry) + '\n');
  }

  log(message: unknown, context?: string) {
    this.write('INFO', message, context);
  }

  error(message: unknown, stack?: string, context?: string) {
    this.write('ERROR', stack ? `${message}\n${stack}` : message, context);
  }

  warn(message: unknown, context?: string) {
    this.write('WARN', message, context);
  }

  debug(message: unknown, context?: string) {
    this.write('DEBUG', message, context);
  }

  verbose(message: unknown, context?: string) {
    this.write('DEBUG', message, context);
  }
}
