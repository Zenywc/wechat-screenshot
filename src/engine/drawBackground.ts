import { WECHAT } from '../constants/wechat';

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.fillStyle = WECHAT.BACKGROUND_COLOR;
  ctx.fillRect(0, 0, width, height);
}
