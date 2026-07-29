import type { Message } from '../types';
import type { MessageGeometry, TextLayoutResult, TimeGeometry, RevokeGeometry, QuoteGeometry } from './types';
import type { WeChatConstants } from '../constants/wechat';

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
    SYSTEM_FONT_SIZE,
    SYSTEM_ROW_GAP,
    QUOTE_FONT_SIZE,
    QUOTE_BAR_WIDTH,
    QUOTE_BAR_GAP,
  } = constants;

  const maxBubbleWidth = CANVAS_WIDTH * BUBBLE_MAX_WIDTH_RATIO;

  const geometries: MessageGeometry[] = [];
  let currentY = TOP_PADDING;
  let contentRight = 0;
  let hasAnyTime = false;
  let hasAnyRevoke = false;

  for (const msg of messages) {
    const layout = textLayouts.get(msg.id);
    if (!layout) continue;

    const hasAvatar = msg.avatar !== null;
    const hasName = msg.username.length > 0;
    const hasTime = msg.time.length > 0;
    const isRevoked = msg.showRevoke && msg.revokeId.length > 0;
    const showPersona = hasAvatar || hasName;
    const isSent = msg.bubbleType === 'sent';

    if (hasTime) hasAnyTime = true;
    if (isRevoked) hasAnyRevoke = true;

    // ---- Bubble dimensions (each message sized independently) ----
    const bubbleContentW = isRevoked ? 0 : Math.min(layout.totalWidth, maxBubbleWidth);
    const bubbleW = bubbleContentW + BUBBLE_PADDING_H * 2;
    const bubbleH = isRevoked ? 0 : layout.totalHeight + BUBBLE_PADDING_V * 2;

    // ---- Time / Revoke rows (time above revoke, both centered) ----
    let timeGeom: TimeGeometry | null = null;
    let revokeGeom: RevokeGeometry | null = null;

    if (hasTime) {
      timeGeom = { x: CANVAS_WIDTH / 2, y: currentY, text: msg.time };
      currentY += SYSTEM_FONT_SIZE + SYSTEM_ROW_GAP;
    }
    if (isRevoked) {
      const label = msg.revokeId || '你';
      revokeGeom = { x: CANVAS_WIDTH / 2, y: currentY, text: `${label}撤回了一条消息` };
      currentY += SYSTEM_FONT_SIZE + SYSTEM_ROW_GAP;
    }

    // ---- Nickname position ----
    const nicknameY = currentY;
    const nameRowHeight = hasName ? NICKNAME_FONT_SIZE + 4 : 0;
    const bubbleStartY = showPersona ? nicknameY + nameRowHeight : currentY;

    // ---- Avatar + Bubble X ----
    let avatarGeom: MessageGeometry['avatar'] = null;
    let nicknameGeom: MessageGeometry['nickname'] = null;
    let bubbleX = 0;
    let triangleDir: 'left' | 'right' = 'left';

    if (!isRevoked) {
      if (showPersona) {
        if (isSent) {
          const avatarX = CANVAS_WIDTH - MARGIN_RIGHT - AVATAR_SIZE;
          const bodyEdge = avatarX - AVATAR_BUBBLE_GAP - TW;
          if (hasAvatar) avatarGeom = { x: avatarX, y: currentY };
          if (hasName) nicknameGeom = { x: bodyEdge, y: nicknameY, align: 'right' };
          bubbleX = avatarX - AVATAR_BUBBLE_GAP - bubbleW;
          triangleDir = 'right';
        } else {
          const avatarX = MARGIN_LEFT;
          const bodyEdge = avatarX + AVATAR_SIZE + AVATAR_BUBBLE_GAP + TW;
          if (hasAvatar) avatarGeom = { x: avatarX, y: currentY };
          if (hasName) nicknameGeom = { x: bodyEdge, y: nicknameY, align: 'left' };
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
    }

    // ---- Triangle tip ----
    const triangleTipX = triangleDir === 'left' ? bubbleX + TW : bubbleX + bubbleW - TW;
    const triangleTipY = bubbleStartY + BUBBLE_TRIANGLE_OFFSET;

    // ---- Text offset ----
    const bubbleBodyX = triangleDir === 'left' ? bubbleX + TW : bubbleX;
    const bubbleBodyW = bubbleW - TW;
    const textOffsetX = bubbleBodyX + (bubbleBodyW - bubbleContentW) / 2;
    const textOffsetY = bubbleStartY + BUBBLE_PADDING_V;

    // ---- Quote row (below bubble) ----
    let quoteGeom: QuoteGeometry | null = null;
    const hasQuote = !isRevoked && msg.quote.length > 0;
    const quoteRowH = hasQuote ? QUOTE_FONT_SIZE * 1.4 + 4 : 0;
    if (hasQuote) {
      quoteGeom = {
        x: bubbleBodyX,
        y: bubbleStartY + bubbleH + 4,
        text: msg.quote,
      };
      // Track quote right edge
      const quoteW = QUOTE_BAR_WIDTH + QUOTE_BAR_GAP + layout.totalWidth; // approximate
      contentRight = Math.max(contentRight, bubbleBodyX + quoteW);
    }

    // ---- Block height ----
    const personaHeight = hasAvatar ? AVATAR_SIZE : 0;
    const bubbleColHeight = nameRowHeight + (isRevoked ? 0 : bubbleH);
    const bodyHeight = showPersona ? Math.max(personaHeight, bubbleColHeight) : (isRevoked ? 0 : bubbleH);
    const sysRowH = (hasTime || isRevoked) ? SYSTEM_FONT_SIZE + SYSTEM_ROW_GAP : 0;
    const blockHeight = sysRowH + bodyHeight + quoteRowH;

    // Track rightmost edge
    const bubbleRight = isRevoked ? 0 : bubbleX + bubbleW;
    const avatarRight = avatarGeom ? avatarGeom.x + AVATAR_SIZE : 0;
    contentRight = Math.max(contentRight, bubbleRight, avatarRight);

    geometries.push({
      messageId: msg.id,
      avatar: avatarGeom,
      nickname: nicknameGeom,
      time: timeGeom,
      bubble: isRevoked ? null : {
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
      revoke: revokeGeom,
      quote: quoteGeom,
      blockHeight,
    });

    // Revoke uses tight spacing like WeChat system messages
    currentY += bodyHeight + (isRevoked ? SYSTEM_ROW_GAP : MESSAGE_GAP);
  }

  const totalHeight = geometries.length > 0
    ? currentY - MESSAGE_GAP + BOTTOM_PADDING
    : TOP_PADDING + BOTTOM_PADDING;

  // Full width when time or revoke present (centered text needs space)
  const contentWidth = (hasAnyTime || hasAnyRevoke)
    ? CANVAS_WIDTH
    : contentRight + MARGIN_RIGHT;

  return { geometries, totalHeight, contentWidth };
}
