import type { Message } from '../types';
import { WECHAT } from '../constants/wechat';
import { layoutText } from './textLayout';
import { calculateGeometry } from './geometry';
import { drawBackground } from './drawBackground';
import { drawAvatar } from './drawAvatar';
import { drawBubble } from './drawBubble';
import { drawNickname } from './drawNickname';
import { drawMessageText } from './drawMessageText';
import type { TextLayoutResult } from './types';

/**
 * Preload an image from a data URL.
 * Returns null if the URL is empty/invalid (so rendering can continue without it).
 */
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Main rendering orchestrator.
 * 1. Measure text → 2. Calculate positions → 3. Draw everything.
 */
export async function renderToCanvas(
  canvas: HTMLCanvasElement,
  messages: Message[]
): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // --- Step 1: Text layout for every message ---
  const maxBubbleContentW =
    WECHAT.CANVAS_WIDTH * WECHAT.BUBBLE_MAX_WIDTH_RATIO - WECHAT.BUBBLE_PADDING_H * 2;
  const lineHeight = WECHAT.MESSAGE_FONT_SIZE * WECHAT.LINE_HEIGHT_RATIO;

  const textLayouts = new Map<string, TextLayoutResult>();
  for (const msg of messages) {
    const layout = layoutText(ctx, msg.text, maxBubbleContentW, WECHAT.MESSAGE_FONT, lineHeight);
    textLayouts.set(msg.id, layout);
  }

  // --- Step 2: Geometry calculation ---
  const { geometries, totalHeight, contentWidth } = calculateGeometry(messages, textLayouts, WECHAT);

  // --- Step 3: Resize canvas ---
  canvas.width = contentWidth;
  canvas.height = totalHeight;

  // --- Step 4: Draw background ---
  drawBackground(ctx, canvas.width, canvas.height);

  // --- Step 5: Preload all avatar images ---
  const avatarUrls = [
    ...new Set(messages.map((m) => m.avatar).filter(Boolean) as string[]),
  ];
  const imagePromises = avatarUrls.map(loadImage);
  const images = await Promise.all(imagePromises);
  const imageMap = new Map<string, HTMLImageElement>();
  avatarUrls.forEach((url, i) => {
    if (images[i]) {
      imageMap.set(url, images[i]!);
    }
  });

  // --- Step 6: Draw each message ---
  try {
    for (const geom of geometries) {
      const msg = messages.find((m) => m.id === geom.messageId);
      if (!msg) continue;

      // Avatar
      if (geom.avatar && msg.avatar) {
        const avatarImg = imageMap.get(msg.avatar);
        if (avatarImg) {
          drawAvatar(ctx, avatarImg, geom.avatar.x, geom.avatar.y);
        }
      }

      // Nickname
      if (geom.nickname) {
        drawNickname(ctx, msg.username, geom.nickname.x, geom.nickname.y, geom.nickname.align);
      }

      // Bubble
      drawBubble(
        ctx,
        geom.bubble.x,
        geom.bubble.y,
        geom.bubble.width,
        geom.bubble.height,
        msg.bubbleType
      );

      // Message text
      drawMessageText(ctx, geom.textLayout.lines, geom.textOffsetX, geom.textOffsetY);
    }
  } catch (drawError) {
    console.error('Canvas rendering failed:', drawError);
    throw drawError;
  }
}
