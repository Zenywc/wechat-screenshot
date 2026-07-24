import { useAppContext } from '../context/AppContext';

export function AddMessageButton() {
  const { dispatch, defaultMessage } = useAppContext();

  const handleAdd = () => {
    dispatch({ type: 'ADD_MESSAGE', payload: defaultMessage() });
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="
        w-full py-3 border-2 border-dashed border-gray-300 rounded-xl
        text-gray-400 hover:text-blue-500 hover:border-blue-400
        transition-all flex items-center justify-center gap-2
        bg-white hover:bg-blue-50/50
      "
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m-8-8h16" />
      </svg>
      <span className="text-sm font-medium">添加消息</span>
    </button>
  );
}
