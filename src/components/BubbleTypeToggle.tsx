import type { BubbleType } from '../types';

interface BubbleTypeToggleProps {
  value: BubbleType;
  onChange: (type: BubbleType) => void;
}

export function BubbleTypeToggle({ value, onChange }: BubbleTypeToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
      <button
        type="button"
        onClick={() => onChange('received')}
        className={`
          px-3 py-1 text-xs rounded-md transition-all
          ${value === 'received'
            ? 'bg-white text-gray-800 shadow-sm font-medium'
            : 'text-gray-500 hover:text-gray-700'
          }
        `}
      >
        <span className="inline-block w-2.5 h-2.5 rounded-sm bg-white border border-gray-300 mr-1 align-middle" />
        接收
      </button>
      <button
        type="button"
        onClick={() => onChange('sent')}
        className={`
          px-3 py-1 text-xs rounded-md transition-all
          ${value === 'sent'
            ? 'bg-white text-gray-800 shadow-sm font-medium'
            : 'text-gray-500 hover:text-gray-700'
          }
        `}
      >
        <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#95EC69] mr-1 align-middle" />
        发送
      </button>
    </div>
  );
}
