import { z } from "zod";

export const logLevelSchema = z.enum(["DEBUG", "INFO", "WARN", "ERROR", "FATAL"]);
export const environmentSchema = z.enum(["prod", "staging", "dev"]);
export const serviceStatusSchema = z.enum(["healthy", "degraded", "critical", "offline"]);

export interface KafkaEnvelope<TPayload> {
  eventId: string;
  eventType: string;
  version: number;
  occurredAt: string;
  organizationId: string;
  payload: TPayload;
}

export function createKafkaEnvelope<TPayload>(input: KafkaEnvelope<TPayload>): KafkaEnvelope<TPayload> {
  return input;
}

export const LOG_INGESTED_TOPIC = "logpulse.ingestion.log-ingested" as const;
export const LOG_BATCH_INGESTED_TOPIC = "logpulse.ingestion.log-batch-ingested" as const;
export const LOG_REJECTED_TOPIC = "logpulse.ingestion.log-rejected" as const;
export const ALERT_TRIGGERED_TOPIC = "logpulse.alerting.alert-triggered" as const;
export const ALERT_RESOLVED_TOPIC = "logpulse.alerting.alert-resolved" as const;
export const ALERT_RULE_CREATED_TOPIC = "logpulse.alerting.alert-rule-created" as const;
export const ALERT_RULE_UPDATED_TOPIC = "logpulse.alerting.alert-rule-updated" as const;
export const METRIC_AGGREGATE_COMPUTED_TOPIC = "logpulse.metrics.aggregate-computed" as const;
export const USER_CREATED_TOPIC = "logpulse.iam.user-created" as const;
export const API_KEY_CREATED_TOPIC = "logpulse.iam.api-key-created" as const;
export const API_KEY_REVOKED_TOPIC = "logpulse.iam.api-key-revoked" as const;
export const SERVICE_DISCOVERED_TOPIC = "logpulse.service-registry.service-discovered" as const;
export const SERVICE_HEALTH_CHANGED_TOPIC = "logpulse.service-registry.service-health-changed" as const;

export const logIngestedPayloadSchema = z.object({
  logId: z.string().uuid(),
  organizationId: z.string().uuid(),
  sourceType: z.enum(["sdk-http", "fluentbit-http", "vector-http", "kafka-direct"]),
  serviceId: z.string().uuid().nullable(),
  serviceSlug: z.string().min(1),
  serviceName: z.string().min(1),
  level: logLevelSchema,
  message: z.string().min(1).max(10_000),
  timestamp: z.string().datetime(),
  host: z.string().min(1),
  source: z.string().min(1),
  environment: environmentSchema,
  traceId: z.string().nullable(),
  spanId: z.string().nullable(),
  statusCode: z.number().int().nullable(),
  latencyMs: z.number().nonnegative().nullable(),
  fields: z.record(z.string(), z.unknown()),
  rawJson: z.string(),
  ingestionTimestamp: z.string().datetime()
});

export type LogIngestedEventPayload = z.infer<typeof logIngestedPayloadSchema>;

export const alertTriggeredPayloadSchema = z.object({
  alertFiringId: z.string().uuid(),
  organizationId: z.string().uuid(),
  ruleId: z.string().uuid(),
  ruleName: z.string().min(1),
  severity: z.enum(["critical", "high", "medium", "low"]),
  summary: z.string().min(1),
  timestamp: z.string().datetime()
});

export type AlertTriggeredEventPayload = z.infer<typeof alertTriggeredPayloadSchema>;

export const serviceHealthChangedPayloadSchema = z.object({
  serviceId: z.string().uuid(),
  organizationId: z.string().uuid(),
  serviceSlug: z.string().min(1),
  previousStatus: serviceStatusSchema,
  currentStatus: serviceStatusSchema,
  errorRateLast5m: z.number().nonnegative(),
  lastSeenAt: z.string().datetime(),
  computedAt: z.string().datetime()
});

export type ServiceHealthChangedEventPayload = z.infer<typeof serviceHealthChangedPayloadSchema>;
