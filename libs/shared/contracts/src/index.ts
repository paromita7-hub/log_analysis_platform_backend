export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";
export type Environment = "prod" | "staging" | "dev";
export type ServiceStatus = "healthy" | "degraded" | "critical" | "offline";
export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type AlertRuleStatus = "active" | "muted";
export type AlertFiringStatus = "triggered" | "acknowledged" | "resolved";

export interface UserMe {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface UserProfile {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: "Bearer";
  user: UserMe;
}

export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: "Bearer";
}

export interface LogEntry {
  id: string;
  organizationId: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  serviceSlug: string;
  serviceId: string | null;
  host: string;
  message: string;
  source: string;
  traceId?: string;
  spanId?: string;
  environment: Environment;
  latencyMs?: number;
  statusCode?: number;
  stackTrace?: string;
  fields: Record<string, string | number | boolean | null>;
  rawJson: string;
}

export interface LogFilterRequest {
  timeRange?: "15m" | "1h" | "6h" | "24h" | "7d";
  levels?: LogLevel[];
  services?: string[];
  hosts?: string[];
  traceId?: string;
  query?: string;
  cursor?: string;
  limit?: number;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  displayValue: string;
  delta: number;
  trend: "up" | "down" | "flat";
  unit?: "%" | "ms" | "logs" | "services";
  icon: "database" | "triangle-alert" | "activity" | "server";
}

export interface AlertRule {
  id: string;
  organizationId: string;
  name: string;
  metric: "error_rate" | "log_volume" | "latency" | "service_health";
  operator: ">" | "<" | ">=" | "<=" | "=";
  threshold: number;
  window: "5m" | "15m" | "1h" | "6h";
  notificationChannels: Array<"Slack" | "PagerDuty" | "Email">;
  severity: AlertSeverity;
  status: AlertRuleStatus;
  lastTriggered?: string;
  serviceId?: string;
  serviceSlug?: string;
}

export interface AlertFiring {
  id: string;
  organizationId: string;
  ruleId: string;
  ruleName: string;
  severity: AlertSeverity;
  status: AlertFiringStatus;
  timestamp: string;
  summary: string;
}

export interface ApiKeyRecord {
  id: string;
  organizationId: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  status: "active" | "revoked";
}

export interface TeamMember {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Engineer" | "Viewer";
  avatarUrl?: string;
  status: "active" | "invited";
}

export interface IntegrationRecord {
  id: string;
  organizationId: string;
  name: "Slack" | "PagerDuty" | "Email";
  status: "connected" | "not_connected";
  lastSync?: string;
}

export interface AppearancePreferences {
  organizationId: string;
  theme: "dark" | "light";
  density: "compact" | "comfortable" | "spacious";
  dateFormat: "relative" | "absolute_24h" | "absolute_12h";
}

export interface SavedQuery {
  id: string;
  organizationId: string;
  userId: string;
  name: string;
  filters: LogFilterRequest;
  createdAt: string;
}
