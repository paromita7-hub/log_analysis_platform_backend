export interface UserReadModel {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}
