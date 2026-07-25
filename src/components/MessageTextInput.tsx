interface MessageTextInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export function MessageTextInput({
  value,
  onChange,
  placeholder = '输入消息文字...',
}: MessageTextInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="
        w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400
        resize-y placeholder-gray-400 bg-gray-50
      "
    />
  );
}
