export type Role = 'ADMIN' | 'AGENT';

export type Member = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  lastLoginAt: string | null;
};
