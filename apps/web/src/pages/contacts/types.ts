export type Stage = {
  id: string;
  name: string;
  order: number;
};

export type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  notes: string | null;
  stageId: string;
  assignedTo: { id: string; name: string } | null;
  createdAt: string;
};
