import { useRef } from 'react';

interface AvatarUploadProps {
  value: string | null;
  onChange: (base64: string | null) => void;
}

export function AvatarUpload({ value, onChange }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('仅支持 JPG、PNG、WebP 格式');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="
          flex items-center justify-center border-2 border-dashed rounded-lg
          border-gray-300 hover:border-blue-400 cursor-pointer bg-white
          transition-colors overflow-hidden
        "
        style={{ width: 56, height: 56 }}
      >
        {value ? (
          <img src={value} alt="头像预览" className="w-full h-full object-cover" />
        ) : (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 4v16m-8-8h16" />
          </svg>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {value && (
        <button
          type="button"
          onClick={handleRemove}
          className="text-xs text-red-500 hover:text-red-700 transition-colors"
        >
          移除
        </button>
      )}

      <span className="text-xs text-gray-400">头像</span>
    </div>
  );
}
