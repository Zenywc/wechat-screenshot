export function Header() {
  return (
    <header className="flex items-center px-6 py-3 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#07C160] flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div>
          <h1 className="text-base font-semibold text-gray-800 leading-tight">
            WeChat 聊天截图生成器
          </h1>
          <p className="text-xs text-gray-400">程序化生成 · 文字100%精准</p>
        </div>
      </div>
    </header>
  );
}
