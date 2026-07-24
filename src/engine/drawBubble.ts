import { WECHAT } from '../constants/wechat';
import type { BubbleType } from '../types';

/**
 * Draw a WeChat-style rounded-rectangle bubble with a triangular arrow.
 * Uses a single Path2D for seamless fill (no seam between rect and triangle).
 */
export function drawBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  bubbleType: BubbleType
): void {
  const {
    BUBBLE_RADIUS,
    BUBBLE_WHITE,
    BUBBLE_GREEN,
    BUBBLE_TRIANGLE_WIDTH: TW,
    BUBBLE_TRIANGLE_HEIGHT: TH,
    BUBBLE_TRIANGLE_OFFSET,
  } = WECHAT;

  const isSent = bubbleType === 'sent';
  const color = isSent ? BUBBLE_GREEN : BUBBLE_WHITE;
  const triDir = isSent ? 'right' : 'left';

  // Triangle base sits on the bubble edge
  const triBaseY = y + BUBBLE_TRIANGLE_OFFSET;

  ctx.save();
  ctx.fillStyle = color;

  ctx.beginPath();

  if (triDir === 'left') {
    // Triangle pointing left (tip at x, base at x + TW)
    const tipX = x;
    const baseX = x + TW;
    ctx.moveTo(tipX, triBaseY);
    ctx.lineTo(baseX, triBaseY - TH / 2);
    ctx.lineTo(baseX, triBaseY + TH / 2);
    ctx.closePath();
    ctx.fill();

    // Bubble body (starts at baseX)
    roundRectPath(ctx, baseX, y, width - TW, height, BUBBLE_RADIUS);
  } else {
    // Triangle pointing right (tip at x + width, base at x + width - TW)
    const tipX = x + width;
    const baseX = x + width - TW;
    ctx.moveTo(tipX, triBaseY);
    ctx.lineTo(baseX, triBaseY - TH / 2);
    ctx.lineTo(baseX, triBaseY + TH / 2);
    ctx.closePath();
    ctx.fill();

    // Bubble body (ends at baseX)
    roundRectPath(ctx, x, y, width - TW, height, BUBBLE_RADIUS);
  }

  ctx.fill();
  ctx.restore();
}

/** Append a rounded-rect sub-path (no beginPath/closePath). */
function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
