import { WECHAT } from '../constants/wechat';
import type { TextLine } from './types';

/**
 * Draw multi-line message text centered within the bubble.
 * Uses textBaseline 'middle' with a small CJK optical correction —
 * Chinese glyphs sit slightly above the em-square middle, so we nudge
 * them down by ~2px at 32px font size for visual balance.
 */
export function drawMessageText(
  ctx: CanvasRenderingContext2D,
  lines: TextLine[],
  startX: number,
  startY: number
): void {
  ctx.save();
  ctx.font = WECHAT.MESSAGE_FONT;
  ctx.fillStyle = WECHAT.MESSAGE_COLOR;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  const lineHeight = WECHAT.MESSAGE_FONT_SIZE * WECHAT.LINE_HEIGHT_RATIO;
  // CJK glyphs are visually top-heavy within the em-box;
  // a ~6% downward nudge compensates the optical illusion
  const visualAdjust = WECHAT.MESSAGE_FONT_SIZE * 0.06;

  for (let i = 0; i < lines.length; i++) {
    const lineCenterY = startY + i * lineHeight + lineHeight / 2 + visualAdjust;
    ctx.fillText(lines[i].text, startX, lineCenterY);
  }

  ctx.restore();
}
