import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { AWSXRayIdGenerator } from '@opentelemetry/id-generator-aws-xray';
import process from 'node:process';

// import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// Export spans only when a collector endpoint is configured. With no
// collector the SDK still creates spans and propagates W3C trace context,
// which is enough to stamp trace_id/span_id onto logs for correlation.
const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;

const otelSDK = new NodeSDK({
  ...(otlpEndpoint ? { traceExporter: new OTLPTraceExporter() } : {}),
  instrumentations: [getNodeAutoInstrumentations()],
  idGenerator: new AWSXRayIdGenerator(),
});

export default otelSDK;

// You can also use the shutdown method to gracefully shut down the SDK before process shutdown
// or on some operating system signal.
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
