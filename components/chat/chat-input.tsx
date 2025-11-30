"use client"

import { useState, useRef, useEffect, KeyboardEvent, DragEvent, ClipboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus } from "lucide-react"
import { ImagePreview } from "./image-preview"
import type { ImageContent } from "@/types"

interface ChatInputProps {
  onSend: (message: string, images?: ImageContent[]) => void
  disabled?: boolean
}

// サポートする画像形式
const SUPPORTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_IMAGES = 10 // 一度に送信できる最大画像数

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("")
  const [images, setImages] = useState<ImageContent[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  // 画像をBase64に変換
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // data:image/png;base64,... から base64部分のみを抽出
        const base64 = result.split(",")[1]
        resolve(base64)
      }
      reader.onerror = reject
    })
  }

  // 画像の検証
  const validateImage = (file: File): string | null => {
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      return `サポートされていない画像形式です: ${file.type}`
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return `画像サイズが大きすぎます（最大5MB）`
    }
    return null
  }

  // 画像を追加
  const addImages = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)

    if (images.length + fileArray.length > MAX_IMAGES) {
      alert(`一度に送信できる画像は最大${MAX_IMAGES}枚です`)
      return
    }

    const newImages: ImageContent[] = []

    for (const file of fileArray) {
      const error = validateImage(file)
      if (error) {
        alert(error)
        continue
      }

      try {
        const base64 = await fileToBase64(file)
        newImages.push({
          type: "image",
          data: base64,
          mimeType: file.type,
        })
      } catch (error) {
        console.error("画像の読み込みエラー:", error)
        alert("画像の読み込みに失敗しました")
      }
    }

    setImages((prev) => [...prev, ...newImages])
  }

  // 画像を削除
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // ファイル選択ボタンのクリック
  const handleImageButtonClick = () => {
    fileInputRef.current?.click()
  }

  // ファイル選択
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addImages(e.target.files)
      // inputをリセット（同じファイルを再度選択できるように）
      e.target.value = ""
    }
  }

  // ドラッグ&ドロップ
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      addImages(files)
    }
  }

  // クリップボードからのペースト
  const handlePaste = async (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items

    const imageFiles: File[] = []
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile()
        if (file) {
          imageFiles.push(file)
        }
      }
    }

    if (imageFiles.length > 0) {
      e.preventDefault()
      await addImages(imageFiles)
    }
  }

  const handleSubmit = () => {
    if ((input.trim() || images.length > 0) && !disabled) {
      onSend(input.trim(), images.length > 0 ? images : undefined)
      setInput("")
      setImages([])
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className={`border rounded-lg p-3 ${isDragging ? "border-primary bg-primary/5" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 画像プレビュー */}
      <ImagePreview images={images} onRemove={removeImage} />

      <div className="flex gap-2 items-end">
        {/* 画像選択ボタン */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleImageButtonClick}
          disabled={disabled || images.length >= MAX_IMAGES}
          title="画像を添付"
        >
          <ImagePlus className="h-5 w-5" />
        </Button>

        {/* 非表示のファイル入力 */}
        <input
          ref={fileInputRef}
          type="file"
          accept={SUPPORTED_IMAGE_TYPES.join(",")}
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="メッセージを入力... (画像をペーストまたはドラッグ&ドロップできます)"
          disabled={disabled}
          className="min-h-[44px] max-h-[200px] resize-none"
          rows={1}
        />
        <Button
          onClick={handleSubmit}
          disabled={disabled || (!input.trim() && images.length === 0)}
          size="default"
        >
          送信
        </Button>
      </div>
    </div>
  )
}
