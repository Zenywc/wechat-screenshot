import { WECHAT } from '../constants/wechat';

export function drawNickname(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  align: 'left' | 'right'
): void {
  ctx.save();
  ctx.font = WECHAT.NICKNAME_FONT;
  ctx.fillStyle = WECHAT.NICKNAME_COLOR;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  ctx.fillText(text, x, y);
  ctx.restore();
}
