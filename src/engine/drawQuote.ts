import { WECHAT } from '../constants/wechat';

/**
 * Draw a quoted reply below the bubble: vertical bar + gray text.
 */
export function drawQuote(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,     // left edge of bar
  y: number      // top of quote row
): void {
  if (!text) return;

  const { QUOTE_BAR_WIDTH, QUOTE_BAR_GAP, QUOTE_FONT, QUOTE_COLOR } = WECHAT;

  ctx.save();
  ctx.font = QUOTE_FONT;
  ctx.fillStyle = QUOTE_COLOR;

  const barHeight = WECHAT.QUOTE_FONT_SIZE * 1.4;

  // Vertical bar
  ctx.fillRect(x, y, QUOTE_BAR_WIDTH, barHeight);

  // Text — centered vertically on the bar (small CJK optical nudge)
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + QUOTE_BAR_WIDTH + QUOTE_BAR_GAP, y + barHeight / 2 + 1);

  ctx.restore();
}

/**
 * Measure quote text width (including bar + gap).
 */
export function measureQuoteWidth(ctx: CanvasRenderingContext2D, text: string): number {
  ctx.font = WECHAT.QUOTE_FONT;
  return WECHAT.QUOTE_BAR_WIDTH + WECHAT.QUOTE_BAR_GAP + ctx.measureText(text).width;
}
