import { useEffect, useRef, useState, useCallback } from 'react';
import type { Message } from '../types';
import { renderToCanvas } from '../engine/renderer';

interface UseCanvasRendererResult {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isRendering: boolean;
  error: string | null;
}

export function useCanvasRenderer(
  messages: Message[]
): UseCanvasRendererResult {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const renderIdRef = useRef(0);

  const render = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderIdRef.current += 1;
    const thisRenderId = renderIdRef.current;

    setIsRendering(true);
    setError(null);

    try {
      await renderToCanvas(canvas, messages);
      // Only update state if this is still the latest render
      if (thisRenderId === renderIdRef.current) {
        setIsRendering(false);
      }
    } catch (err) {
      if (thisRenderId === renderIdRef.current) {
        setError(err instanceof Error ? err.message : '渲染失败');
        setIsRendering(false);
      }
    }
  }, [messages]);

  useEffect(() => {
    // Small debounce: wait for rapid typing to settle
    const timer = setTimeout(() => {
      render();
    }, 100);

    return () => clearTimeout(timer);
  }, [render]);

  return { canvasRef, isRendering, error };
}
