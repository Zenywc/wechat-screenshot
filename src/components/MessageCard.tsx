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
  const { id, avatar, username, time, text, bubbleType, revokeId, showRevoke, quote } = message;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 lg:p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header: controls row */}
      <div className="flex items-center justify-between mb-2 lg:mb-3 gap-2">
        <div className="flex items-center gap-1.5 lg:gap-2 flex-wrap">
          {/* Move buttons */}
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => dispatch({ type: 'MOVE_MESSAGE', payload: { id, direction: 'up' } })}
              disabled={index === 0}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-25 disabled:cursor-not-allowed leading-none"
              title="上移"
            >
              <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5" fill="currentColor" viewBox="0 0 20 20">
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
              <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <span className="text-[10px] lg:text-xs text-gray-400 font-mono">#{index + 1}</span>

          {/* Time */}
          <input
            type="text"
            value={time}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_MESSAGE', payload: { id, updates: { time: e.target.value } } })
            }
            placeholder="时间（半角:）"
            className="
              w-20 lg:w-28 px-1.5 lg:px-2 py-0.5 text-[11px] lg:text-xs
              border border-gray-200 rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400
              placeholder-gray-300 bg-gray-50
            "
          />

          {/* Revoke */}
          <input
            type="text"
            value={revokeId}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_MESSAGE', payload: { id, updates: { revokeId: e.target.value } } })
            }
            placeholder="撤回ID"
            className="
              w-14 lg:w-20 px-1.5 lg:px-2 py-0.5 text-[11px] lg:text-xs
              border border-gray-200 rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400
              placeholder-gray-300 bg-gray-50
            "
          />
          <label className="flex items-center gap-0.5 lg:gap-1 text-[10px] lg:text-xs text-gray-500 cursor-pointer select-none whitespace-nowrap">
            <input
              type="checkbox"
              checked={showRevoke}
              onChange={(e) =>
                dispatch({ type: 'UPDATE_MESSAGE', payload: { id, updates: { showRevoke: e.target.checked } } })
              }
              disabled={!revokeId}
              className="w-3 h-3 lg:w-3.5 lg:h-3.5 rounded border-gray-300 text-blue-500 focus:ring-blue-300 disabled:opacity-30"
            />
            撤回
          </label>
        </div>

        <div className="flex items-center gap-1 lg:gap-2 shrink-0">
          <BubbleTypeToggle
            value={bubbleType}
            onChange={(type) =>
              dispatch({ type: 'UPDATE_MESSAGE', payload: { id, updates: { bubbleType: type } } })
            }
          />

          <button
            type="button"
            onClick={() => dispatch({ type: 'DELETE_MESSAGE', payload: { id } })}
            className="text-gray-400 hover:text-red-500 transition-colors p-0.5 lg:p-1"
            title="删除"
          >
            <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content row */}
      <div className="flex items-start gap-3 lg:gap-4">
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <AvatarUpload
            value={avatar}
            onChange={(base64) =>
              dispatch({ type: 'UPDATE_MESSAGE', payload: { id, updates: { avatar: base64 } } })
            }
          />
        </div>

        <div className="flex-1 space-y-1.5 lg:space-y-2">
          <input
            type="text"
            value={username}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_MESSAGE', payload: { id, updates: { username: e.target.value } } })
            }
            placeholder="用户ID（选填）"
            className="
              w-full px-2 lg:px-3 py-1 lg:py-1.5 text-sm border border-gray-200 rounded-lg
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

      {/* Quote input */}
      <div className="mt-2">
        <input
          type="text"
          value={quote}
          onChange={(e) =>
            dispatch({ type: 'UPDATE_MESSAGE', payload: { id, updates: { quote: e.target.value } } })
          }
          placeholder="引用内容（选填）"
          className="
            w-full px-2 py-1 text-xs border border-gray-200 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400
            placeholder-gray-300 bg-gray-50
          "
        />
      </div>

      {/* Duplicate button */}
      <div className="mt-2 lg:mt-3 pt-2 lg:pt-3 border-t border-gray-100 flex justify-end">
        <button
          type="button"
          onClick={() => dispatch({ type: 'DUPLICATE_MESSAGE', payload: { id } })}
          className="text-[10px] lg:text-xs text-gray-400 hover:text-blue-500 transition-colors"
        >
          复制此条
        </button>
      </div>
    </div>
  );
}
