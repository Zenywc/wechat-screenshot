import { CanvasPreview } from './CanvasPreview';
import { ExportToolbar } from './ExportToolbar';
import { useAppContext } from '../context/AppContext';
import { sharedCanvasRef } from '../hooks/canvasRefStore';

export function PreviewPanel() {
  const { state } = useAppContext();
  const hasContent = state.messages.some((m) => m.text.length > 0);

  return (
    <main className="w-3/5 flex flex-col items-center gap-4 p-6 overflow-y-auto bg-[#e0e0e0]">
      <ExportToolbar canvasRef={sharedCanvasRef} hasMessages={hasContent} />
      <CanvasPreview />
    </main>
  );
}
