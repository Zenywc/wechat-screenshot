import { useEffect, useRef } from 'react';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';
import { useAppContext } from '../context/AppContext';
import { sharedCanvasRef } from '../hooks/canvasRefStore';

export function CanvasPreview() {
  const { state } = useAppContext();
  const { canvasRef, isRendering, error } = useCanvasRenderer(state.messages);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync to shared ref for export
  useEffect(() => {
    sharedCanvasRef.current = canvasRef.current;
  });

  const hasMessages = state.messages.length > 0;
  const hasText = state.messages.some((m) => m.text.length > 0);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[420px]">
      {/* Phone frame */}
      <div className="
        bg-white rounded-3xl shadow-2xl overflow-hidden
        border border-gray-300 w-full
      ">
        {/* Status bar area (decorative only) */}
        <div className="h-8 bg-[#EDEDED] flex items-center justify-between px-6">
          <span className="text-[10px] text-gray-400 font-medium">9:41</span>
          <div className="flex items-center gap-1">
            <span className="block w-3 h-3 border border-gray-400 rounded-sm" />
            <span className="text-[10px] text-gray-400">100%</span>
          </div>
        </div>

        {/* Canvas area */}
        <div className="bg-[#EDEDED] min-h-[200px] relative">
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50/90 z-10">
              <svg className="w-8 h-8 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-600 text-sm font-medium">渲染出错</p>
              <p className="text-red-400 text-xs mt-1 max-w-[200px] text-center">{error}</p>
            </div>
          ) : null}
          {!hasMessages || !hasText ? (
            <EmptyState />
          ) : (
            <canvas
              ref={canvasRef}
              className="w-full block"
              style={{ imageRendering: 'auto' }}
            />
          )}
        </div>

        {/* Home indicator */}
        <div className="h-7 bg-[#EDEDED] flex items-center justify-center">
          <div className="w-32 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* Status badges */}
      <div className="absolute -top-3 right-3 flex items-center gap-2">
        {isRendering && (
          <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
            渲染中...
          </span>
        )}
        {!isRendering && !error && hasText && (
          <span className="bg-[#07C160] text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
            实时预览
          </span>
        )}
        {error && (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
            渲染失败
          </span>
        )}
      </div>

      {error && (
        <div className="mt-2 text-red-500 text-sm bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 w-full text-center">
          {error}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400 select-none">
      <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <p className="text-sm font-medium">暂无消息</p>
      <p className="text-xs mt-1">在左侧添加消息开始生成截图</p>
    </div>
  );
}
