import type { Message } from '../types';
import type { MessageGeometry, TextLayoutResult } from './types';
import type { WeChatConstants } from '../constants/wechat';

/**
 * Calculate positioning for every message in the conversation.
 * Pure function — no side effects.
 *
 * Returns geometries, total canvas height, and the minimal content width.
 */
export function calculateGeometry(
  messages: Message[],
  textLayouts: Map<string, TextLayoutResult>,
  constants: WeChatConstants
): { geometries: MessageGeometry[]; totalHeight: number; contentWidth: number } {
  const {
    CANVAS_WIDTH,
    AVATAR_SIZE,
    AVATAR_BUBBLE_GAP,
    BUBBLE_PADDING_H,
    BUBBLE_PADDING_V,
    BUBBLE_MAX_WIDTH_RATIO,
    BUBBLE_TRIANGLE_WIDTH: TW,
    BUBBLE_TRIANGLE_OFFSET,
    MARGIN_LEFT,
    MARGIN_RIGHT,
    MESSAGE_GAP,
    TOP_PADDING,
    BOTTOM_PADDING,
    NICKNAME_FONT_SIZE,
  } = constants;

  const geometries: MessageGeometry[] = [];
  let currentY = TOP_PADDING;
  let contentRight = 0;

  const maxBubbleWidth = CANVAS_WIDTH * BUBBLE_MAX_WIDTH_RATIO;

  for (const msg of messages) {
    const layout = textLayouts.get(msg.id);
    if (!layout) continue;

    const hasAvatar = msg.avatar !== null;
    const hasName = msg.username.length > 0;
    const showPersona = hasAvatar || hasName;
    const isSent = msg.bubbleType === 'sent';

    // ---- Bubble dimensions ----
    const bubbleContentW = Math.min(layout.totalWidth, maxBubbleWidth);
    const bubbleW = bubbleContentW + BUBBLE_PADDING_H * 2;
    const bubbleH = layout.totalHeight + BUBBLE_PADDING_V * 2;

    // ---- Nickname position (above bubble) ----
    const nicknameY = currentY;
    const nameRowHeight = hasName ? NICKNAME_FONT_SIZE + 4 : 0;
    const bubbleStartY = showPersona ? nicknameY + nameRowHeight : currentY;

    // ---- Avatar + Bubble X positioning ----
    let avatarGeom: MessageGeometry['avatar'] = null;
    let nicknameGeom: MessageGeometry['nickname'] = null;
    let bubbleX: number;
    let triangleDir: 'left' | 'right';

    if (showPersona) {
      if (isSent) {
        const avatarX = CANVAS_WIDTH - MARGIN_RIGHT - AVATAR_SIZE;
        if (hasAvatar) {
          avatarGeom = { x: avatarX, y: currentY };
        }
        if (hasName) {
          nicknameGeom = {
            x: avatarX - AVATAR_BUBBLE_GAP,
            y: nicknameY,
            align: 'right',
          };
        }
        bubbleX = avatarX - AVATAR_BUBBLE_GAP - bubbleW;
        triangleDir = 'right';
      } else {
        const avatarX = MARGIN_LEFT;
        if (hasAvatar) {
          avatarGeom = { x: avatarX, y: currentY };
        }
        if (hasName) {
          nicknameGeom = {
            x: avatarX + AVATAR_SIZE + AVATAR_BUBBLE_GAP,
            y: nicknameY,
            align: 'left',
          };
        }
        bubbleX = avatarX + AVATAR_SIZE + AVATAR_BUBBLE_GAP;
        triangleDir = 'left';
      }
    } else {
      if (isSent) {
        bubbleX = CANVAS_WIDTH - MARGIN_RIGHT - bubbleW;
        triangleDir = 'right';
      } else {
        bubbleX = MARGIN_LEFT;
        triangleDir = 'left';
      }
    }

    // ---- Triangle tip position ----
    const triangleTipX =
      triangleDir === 'left'
        ? bubbleX + TW
        : bubbleX + bubbleW - TW;
    const triangleTipY = bubbleStartY + BUBBLE_TRIANGLE_OFFSET;

    // ---- Text offset: center text within the bubble BODY (excludes triangle) ----
    const bubbleBodyX = triangleDir === 'left' ? bubbleX + TW : bubbleX;
    const bubbleBodyW = bubbleW - TW;
    const textOffsetX = bubbleBodyX + (bubbleBodyW - layout.totalWidth) / 2;
    const textOffsetY = bubbleStartY + BUBBLE_PADDING_V;

    // ---- Block height ----
    const personaHeight = hasAvatar ? AVATAR_SIZE : 0;
    const bubbleColHeight = nameRowHeight + bubbleH;
    const blockHeight = showPersona
      ? Math.max(personaHeight, bubbleColHeight)
      : bubbleH;

    // Track the rightmost pixel of any content
    const bubbleRight = bubbleX + bubbleW;
    const avatarRight = avatarGeom ? avatarGeom.x + AVATAR_SIZE : 0;
    contentRight = Math.max(contentRight, bubbleRight, avatarRight);

    geometries.push({
      messageId: msg.id,
      avatar: avatarGeom,
      nickname: nicknameGeom,
      bubble: {
        x: bubbleX,
        y: bubbleStartY,
        width: bubbleW,
        height: bubbleH,
        triangleDirection: triangleDir,
        triangleTipX,
        triangleTipY,
      },
      textLayout: layout,
      textOffsetX,
      textOffsetY,
      blockHeight,
    });

    currentY += blockHeight + MESSAGE_GAP;
  }

  const totalHeight =
    geometries.length > 0
      ? currentY - MESSAGE_GAP + BOTTOM_PADDING
      : TOP_PADDING + BOTTOM_PADDING;

  // Right margin equals left margin for symmetric crop
  const contentWidth = contentRight + MARGIN_RIGHT;

  return { geometries, totalHeight, contentWidth };
}
