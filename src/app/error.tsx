"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 本番環境ではエラー監視サービスにログを送信
    // console.error は本番では削除済みなので、ここで必要に応じてログ
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">エラーが発生しました</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            申し訳ございません。予期しないエラーが発生しました。
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground">
              エラーID: {error.digest}
            </p>
          )}
          <div className="flex gap-2">
            <Button onClick={() => reset()} variant="default">
              再試行
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
            >
              ホームに戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
