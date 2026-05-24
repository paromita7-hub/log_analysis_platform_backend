export interface UserLoggedInEvent {
  userId: string;
  organizationId: string;
  sessionId: string;
  loggedInAt: string;
}
