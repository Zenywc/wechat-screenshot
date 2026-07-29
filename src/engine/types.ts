// Engine-internal types

export interface TextLine {
  text: string;
  width: number;
}

export interface TextLayoutResult {
  lines: TextLine[];
  totalWidth: number;
  totalHeight: number;
  lineCount: number;
}

export interface AvatarGeometry {
  x: number;
  y: number;
}

export interface BubbleGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
  triangleDirection: 'left' | 'right';
  triangleTipX: number;
  triangleTipY: number;
}

export interface TimeGeometry {
  x: number;
  y: number;
  text: string;
}

export interface RevokeGeometry {
  x: number;
  y: number;
  text: string;  // "xx撤回了一条消息"
}

export interface QuoteGeometry {
  x: number;     // bar left edge
  y: number;
  text: string;
}

export interface MessageGeometry {
  messageId: string;
  avatar: AvatarGeometry | null;
  nickname: { x: number; y: number; align: 'left' | 'right' } | null;
  time: TimeGeometry | null;
  bubble: BubbleGeometry | null;           // null when revoked
  textLayout: TextLayoutResult;            // empty when revoked
  textOffsetX: number;
  textOffsetY: number;
  revoke: RevokeGeometry | null;           // set when revoked && !hasTime
  quote: QuoteGeometry | null;             // set when quote text present
  blockHeight: number;
}
