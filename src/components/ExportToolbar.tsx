import { useState } from 'react';
import { downloadPNG, copyToClipboard } from '../engine/export';
import { useToast } from './Toast';

interface ExportToolbarProps {
  canvasRef: { current: HTMLCanvasElement | null };
  hasMessages: boolean;
}

export function ExportToolbar({ canvasRef, hasMessages }: ExportToolbarProps) {
  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);
    downloadPNG(canvas);
    showToast('图片已开始下载', 'success');
    setTimeout(() => setDownloading(false), 500);
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      await copyToClipboard(canvas);
      showToast('已复制到剪贴板', 'success');
    } catch {
      showToast('复制失败，请尝试下载', 'error');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={!hasMessages || downloading}
        className="
          px-4 py-2 text-sm font-medium rounded-lg
          bg-[#07C160] text-white
          hover:bg-[#06AD56] active:bg-[#05944A]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors shadow-sm
        "
      >
        {downloading ? '下载中...' : '下载 PNG'}
      </button>

      <button
        type="button"
        onClick={handleCopy}
        disabled={!hasMessages}
        className="
          px-4 py-2 text-sm font-medium rounded-lg
          bg-white text-gray-700 border border-gray-300
          hover:bg-gray-50 hover:border-gray-400
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors shadow-sm
        "
      >
        复制图片
      </button>
    </div>
  );
}
