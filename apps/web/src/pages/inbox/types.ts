export type ConversationStatus = 'online' | 'away' | 'offline';

export type Conversation = {
  id: string;
  name: string;
  company: string;
  initials: string;
  status: ConversationStatus;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  tag?: { label: string; tone: 'primary' | 'warning' | 'info' | 'neutral' };
};

export type Message = {
  id: string;
  from: 'customer' | 'agent';
  authorName: string;
  text: string;
  time: string;
};

export type ContactDetails = {
  name: string;
  role: string;
  company: string;
  phone: string;
  email: string;
  companySize: string;
  source: string;
  dealValue: string;
  pipelineStage: string;
  pipelineStepIndex: number;
  tags: string[];
  note: string;
};
