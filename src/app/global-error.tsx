"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            重大なエラーが発生しました
          </h2>
          <p className="text-gray-600 mb-4">
            申し訳ございません。アプリケーションで予期しないエラーが発生しました。
          </p>
          {error.digest && (
            <p className="text-xs text-gray-400 mb-4">エラーID: {error.digest}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              再試行
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
