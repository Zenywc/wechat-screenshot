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
    <aside className="
      w-full lg:w-2/5 shrink-0
      overflow-y-auto bg-gray-50
      border-b-2 border-gray-200
      lg:border-b-0 lg:border-r lg:border-gray-200
      max-h-[45vh] lg:max-h-none
    ">
      <div className="p-3 lg:p-4 space-y-3 lg:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs lg:text-sm font-semibold text-gray-600 uppercase tracking-wider">
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
