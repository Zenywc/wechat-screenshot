import { useAppContext } from '../context/AppContext';
import { MessageCard } from './MessageCard';
import { AddMessageButton } from './AddMessageButton';

export function EditorPanel() {
  const { state, dispatch } = useAppContext();
  const { messages } = state;

  const handleClearAll = () => {
    if (messages.length === 0) return;
    if (confirm('确定清空所有消息？')) {
      dispatch({ type: 'CLEAR_ALL' });
    }
  };

  return (
    <aside className="w-2/5 overflow-y-auto bg-gray-50 border-r border-gray-200">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
            消息列表 ({messages.length})
          </h2>
          <button
            type="button"
            onClick={handleClearAll}
            disabled={messages.length === 0}
            className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            清空全部
          </button>
        </div>

        {messages.map((msg, i) => (
          <MessageCard key={msg.id} message={msg} index={i} total={messages.length} />
        ))}

        <AddMessageButton />
      </div>
    </aside>
  );
}
