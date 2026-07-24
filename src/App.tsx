import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';

function App() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <EditorPanel />
      <PreviewPanel />
    </div>
  );
}

export default App;
