"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ImageContent } from "@/types"

interface ImagePreviewProps {
  images: ImageContent[]
  onRemove: (index: number) => void
}

export function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  if (images.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <img
            src={`data:${image.mimeType};base64,${image.data}`}
            alt={`Preview ${index + 1}`}
            className="h-20 w-20 object-cover rounded-lg border"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
