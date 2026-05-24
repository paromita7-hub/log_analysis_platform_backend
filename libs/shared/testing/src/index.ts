import { randomUUID } from "node:crypto";

export function createOrganizationId(): string {
  return randomUUID();
}

export function createUserId(): string {
  return randomUUID();
}

export function createLogId(): string {
  return randomUUID();
}
