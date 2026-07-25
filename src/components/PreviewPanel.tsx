import { CanvasPreview } from './CanvasPreview';
import { ExportToolbar } from './ExportToolbar';
import { useAppContext } from '../context/AppContext';
import { sharedCanvasRef } from '../hooks/canvasRefStore';

export function PreviewPanel() {
  const { state } = useAppContext();
  const hasContent = state.messages.some((m) => m.text.length > 0);

  return (
    <main className="
      w-full lg:w-3/5
      flex flex-col items-center gap-3 lg:gap-4
      p-3 lg:p-6
      overflow-y-auto bg-[#e0e0e0]
    ">
      <ExportToolbar canvasRef={sharedCanvasRef} hasMessages={hasContent} />
      <CanvasPreview />
    </main>
  );
}
