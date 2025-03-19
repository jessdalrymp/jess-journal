
export interface ConversationMessage {
  id: string;
  role: string;
  content: string;
  metadata?: any;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  type: string;
  title: string;
  messages: ConversationMessage[];
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}
