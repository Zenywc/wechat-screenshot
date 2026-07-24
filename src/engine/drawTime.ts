import { WECHAT } from '../constants/wechat';

/**
 * Draw centered gray system text (time label or revoke notice).
 */
export function drawTime(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number
): void {
  if (!text) return;
  ctx.save();
  ctx.font = WECHAT.SYSTEM_FONT;
  ctx.fillStyle = WECHAT.SYSTEM_COLOR;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(text, x, y);
  ctx.restore();
}
