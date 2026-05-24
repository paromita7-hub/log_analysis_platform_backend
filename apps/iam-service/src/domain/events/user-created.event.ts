export interface UserCreatedEvent {
  userId: string;
  organizationId: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}
