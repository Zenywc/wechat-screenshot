import type { TextLayoutResult, TextLine } from './types';

/**
 * Chinese-aware text layout with automatic line breaking.
 * Measures whole candidate substrings each step to preserve
 * kerning/ligature accuracy (sum of parts ≠ whole in HarfBuzz).
 */
export function layoutText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  font: string,
  lineHeight: number
): TextLayoutResult {
  ctx.font = font;

  const chars = Array.from(text); // handles emoji / surrogate pairs
  const lines: TextLine[] = [];
  let currentLine = '';

  for (const ch of chars) {
    const candidate = currentLine + ch;
    const measured = ctx.measureText(candidate).width;

    if (measured > maxWidth && currentLine.length > 0) {
      // Break before this character
      lines.push({ text: currentLine, width: ctx.measureText(currentLine).width });
      currentLine = ch;
    } else {
      currentLine = candidate;
    }
  }

  // Push the last line
  if (currentLine.length > 0) {
    lines.push({ text: currentLine, width: ctx.measureText(currentLine).width });
  }

  // Empty text → one empty line so bubble still renders
  if (lines.length === 0) {
    lines.push({ text: '', width: 0 });
  }

  const totalWidth = Math.max(...lines.map((l) => l.width));
  const totalHeight = lines.length * lineHeight;

  return {
    lines,
    totalWidth,
    totalHeight,
    lineCount: lines.length,
  };
}
