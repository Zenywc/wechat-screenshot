/** Which side the bubble appears on */
export type BubbleType = 'received' | 'sent';

/** A single message in the conversation */
export interface Message {
  id: string;
  avatar: string | null;   // base64 data URL, or null if no avatar
  username: string;        // display name, empty string = anonymous mode
  time: string;            // optional time label, empty = not shown (e.g. "星期四 14:30")
  text: string;            // message body
  bubbleType: BubbleType;  // 'received' = white left, 'sent' = green right
  revokeId: string;        // ID of the person who revoked, default "你"
  showRevoke: boolean;     // checkbox: show "{revokeId}撤回了一条消息"
}

/** The global application state */
export interface AppState {
  messages: Message[];
}

/** Actions for the reducer */
export type AppAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<Message> } }
  | { type: 'DELETE_MESSAGE'; payload: { id: string } }
  | { type: 'MOVE_MESSAGE'; payload: { id: string; direction: 'up' | 'down' } }
  | { type: 'DUPLICATE_MESSAGE'; payload: { id: string } }
  | { type: 'CLEAR_ALL' };
