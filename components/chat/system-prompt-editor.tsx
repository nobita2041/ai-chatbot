"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/constants"

interface SystemPromptEditorProps {
  value: string
  onChange: (value: string) => void
}

export function SystemPromptEditor({
  value,
  onChange,
}: SystemPromptEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState(value)

  const handleSave = () => {
    onChange(draft)
    setIsOpen(false)
  }

  const handleReset = () => {
    setDraft(DEFAULT_SYSTEM_PROMPT)
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setDraft(value)
          setIsOpen(true)
        }}
      >
        システムプロンプトを編集
      </Button>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">システムプロンプト</CardTitle>
        <CardDescription className="text-xs">
          AIの振る舞いを定義するプロンプトを編集できます
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="システムプロンプトを入力..."
          className="min-h-[100px]"
        />
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            リセット
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
            キャンセル
          </Button>
          <Button size="sm" onClick={handleSave}>
            保存
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
