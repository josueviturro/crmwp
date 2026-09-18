export type Stage = {
  id: string;
  name: string;
  order: number;
};

export type MessageDirection = 'INBOUND' | 'OUTBOUND';
export type MessageType = 'TEXT' | 'IMAGE' | 'LOCATION' | 'CONTACT_CARD';

export type Message = {
  id: string;
  type: MessageType;
  text: string | null;
  mediaUrl: string | null;
  locationLat: number | null;
  locationLng: number | null;
  locationName: string | null;
  contactName: string | null;
  contactPhone: string | null;
  direction: MessageDirection;
  contactId: string;
  sentBy: { id: string; name: string } | null;
  createdAt: string;
};

export type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  notes: string | null;
  stageId: string;
  stage: { id: string; name: string };
  assignedTo: { id: string; name: string } | null;
  createdAt: string;
  /** Vista previa: viene con como mucho 1 elemento (el mensaje mas reciente) */
  messages: Message[];
};
