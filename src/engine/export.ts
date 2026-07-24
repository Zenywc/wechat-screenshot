/**
 * Export the canvas as a downloadable PNG file.
 */
export function downloadPNG(
  canvas: HTMLCanvasElement,
  filename: string = 'wechat-chat.png'
): void {
  canvas.toBlob((blob) => {
    if (!blob) {
      alert('导出失败：无法生成图片');
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/**
 * Copy the canvas image to the system clipboard.
 * Uses a dual-path strategy for cross-browser compatibility.
 */
export async function copyToClipboard(canvas: HTMLCanvasElement): Promise<void> {
  try {
    // Path 1: Modern async clipboard API (Chrome, Firefox, Edge)
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/png')
    );

    if (!blob) {
      throw new Error('Failed to create blob');
    }

    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
  } catch {
    // Path 2: Safari fallback — synchronous blob construction
    // Must stay within the same event handler call stack
    try {
      const dataURL = canvas.toDataURL('image/png');
      const byteString = atob(dataURL.split(',')[1]);
      const buffer = new ArrayBuffer(byteString.length);
      const intArray = new Uint8Array(buffer);
      for (let i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([buffer], { type: 'image/png' });
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
    } catch (safariError) {
      alert('复制失败：请尝试下载图片后手动粘贴');
      console.error('Clipboard write failed:', safariError);
    }
  }
}
