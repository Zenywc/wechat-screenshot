import { WECHAT } from '../constants/wechat';

/**
 * Draw a rounded-rectangle avatar clipped from the source image.
 * WeChat uses square-ish avatars (not circles).
 */
export function drawAvatar(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number
): void {
  const { AVATAR_SIZE, AVATAR_RADIUS } = WECHAT;

  ctx.save();
  ctx.beginPath();
  roundRect(ctx, x, y, AVATAR_SIZE, AVATAR_SIZE, AVATAR_RADIUS);
  ctx.clip();
  ctx.drawImage(image, x, y, AVATAR_SIZE, AVATAR_SIZE);
  ctx.restore();
}

function roundRect(
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
