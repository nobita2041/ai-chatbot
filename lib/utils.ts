import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 一意のID生成（crypto.randomUUID()を使用）
export function generateId(): string {
  // ブラウザ/Node.js 両方で動作
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // フォールバック
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}
