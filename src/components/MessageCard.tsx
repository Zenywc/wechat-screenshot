import type { Message } from '../types';
import { useAppContext } from '../context/AppContext';
import { AvatarUpload } from './AvatarUpload';
import { BubbleTypeToggle } from './BubbleTypeToggle';
import { MessageTextInput } from './MessageTextInput';

interface MessageCardProps {
  message: Message;
  index: number;
  total: number;
}

export function MessageCard({ message, index, total }: MessageCardProps) {
  const { dispatch } = useAppContext();
  const { id, avatar, username, text, bubbleType } = message;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header row: drag, type toggle, delete */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Move buttons */}
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => dispatch({ type: 'MOVE_MESSAGE', payload: { id, direction: 'up' } })}
              disabled={index === 0}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-25 disabled:cursor-not-allowed leading-none"
              title="上移"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: 'MOVE_MESSAGE', payload: { id, direction: 'down' } })}
              disabled={index === total - 1}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-25 disabled:cursor-not-allowed leading-none"
              title="下移"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <span className="text-xs text-gray-400 font-mono">#{index + 1}</span>
        </div>

        <div className="flex items-center gap-2">
          <BubbleTypeToggle
            value={bubbleType}
            onChange={(type) =>
              dispatch({ type: 'UPDATE_MESSAGE', payload: { id, updates: { bubbleType: type } } })
            }
          />

          <button
            type="button"
            onClick={() => dispatch({ type: 'DELETE_MESSAGE', payload: { id } })}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="删除"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content row */}
      <div className="flex items-start gap-4">
        {/* Avatar + Username column */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <AvatarUpload
            value={avatar}
            onChange={(base64) =>
              dispatch({ type: 'UPDATE_MESSAGE', payload: { id, updates: { avatar: base64 } } })
            }
          />
        </div>

        {/* Text + Username column */}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={username}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_MESSAGE', payload: { id, updates: { username: e.target.value } } })
            }
            placeholder="用户ID（选填）"
            className="
              w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400
              placeholder-gray-400 bg-gray-50
            "
          />

          <MessageTextInput
            value={text}
            onChange={(newText) =>
              dispatch({ type: 'UPDATE_MESSAGE', payload: { id, updates: { text: newText } } })
            }
          />
        </div>
      </div>

      {/* Duplicate button */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
        <button
          type="button"
          onClick={() => dispatch({ type: 'DUPLICATE_MESSAGE', payload: { id } })}
          className="text-xs text-gray-400 hover:text-blue-500 transition-colors"
        >
          复制此条
        </button>
      </div>
    </div>
  );
}
