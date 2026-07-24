/** WeChat design tokens, normalized for a 1080px canvas */
export const WECHAT = {
  // Canvas
  CANVAS_WIDTH: 1080,
  MIN_CANVAS_WIDTH: 540,       // minimum canvas width for short messages
  BACKGROUND_COLOR: '#EDEDED',

  // Avatar
  AVATAR_SIZE: 80,
  AVATAR_RADIUS: 8,

  // Nickname
  NICKNAME_FONT_SIZE: 24,
  NICKNAME_FONT: '24px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif',
  NICKNAME_COLOR: '#999999',

  // Bubble
  BUBBLE_RADIUS: 12,
  BUBBLE_PADDING_H: 24,
  BUBBLE_PADDING_V: 16,
  BUBBLE_MAX_WIDTH_RATIO: 0.65,
  BUBBLE_TRIANGLE_WIDTH: 12,
  BUBBLE_TRIANGLE_HEIGHT: 16,
  BUBBLE_TRIANGLE_OFFSET: 20,

  // Colors
  BUBBLE_WHITE: '#FFFFFF',
  BUBBLE_GREEN: '#95EC69',

  // Time & Revoke (same visual style — centered gray system message)
  SYSTEM_FONT_SIZE: 22,
  SYSTEM_FONT: '22px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif',
  SYSTEM_COLOR: '#B0B0B0',
  SYSTEM_ROW_GAP: 8,         // gap from system row to next element

  // Text
  MESSAGE_FONT_SIZE: 32,
  MESSAGE_FONT: '32px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif',
  MESSAGE_COLOR: '#1A1A1A',
  LINE_HEIGHT_RATIO: 1.5,

  // Layout margins (in canvas pixels)
  MARGIN_LEFT: 40,
  MARGIN_RIGHT: 40,
  AVATAR_BUBBLE_GAP: 16,
  MESSAGE_GAP: 28,
  TOP_PADDING: 30,
  BOTTOM_PADDING: 30,
} as const;

export type WeChatConstants = typeof WECHAT;
