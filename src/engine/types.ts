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

export interface MessageGeometry {
  messageId: string;
  avatar: AvatarGeometry | null;
  nickname: { x: number; y: number; align: 'left' | 'right' } | null;
  bubble: BubbleGeometry;
  textLayout: TextLayoutResult;
  textOffsetX: number;
  textOffsetY: number;
  blockHeight: number;
}
