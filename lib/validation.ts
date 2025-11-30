import { z } from "zod"

// バリデーション定数
export const VALIDATION_LIMITS = {
  MESSAGE_CONTENT_MAX_LENGTH: 10000, // 1メッセージあたり最大10,000文字
  SYSTEM_PROMPT_MAX_LENGTH: 5000, // システムプロンプト最大5,000文字
  MESSAGES_MAX_COUNT: 50, // 最大50メッセージ
} as const

// メッセージスキーマ
const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z
    .string()
    .min(1, { message: "メッセージは空にできません" })
    .max(VALIDATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH, {
      message: `メッセージは${VALIDATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH}文字以内にしてください`,
    }),
})

// チャットリクエストスキーマ
export const ChatRequestSchema = z.object({
  messages: z
    .array(MessageSchema)
    .min(1, { message: "メッセージは1件以上必要です" })
    .max(VALIDATION_LIMITS.MESSAGES_MAX_COUNT, {
      message: `メッセージは${VALIDATION_LIMITS.MESSAGES_MAX_COUNT}件以内にしてください`,
    }),
  systemPrompt: z
    .string()
    .max(VALIDATION_LIMITS.SYSTEM_PROMPT_MAX_LENGTH, {
      message: `システムプロンプトは${VALIDATION_LIMITS.SYSTEM_PROMPT_MAX_LENGTH}文字以内にしてください`,
    })
    .optional(),
})

// 型エクスポート
export type ValidatedChatRequest = z.infer<typeof ChatRequestSchema>
export type ValidatedMessage = z.infer<typeof MessageSchema>

// バリデーション結果の型
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] }

// バリデーションヘルパー関数
export function validateChatRequest(
  data: unknown
): ValidationResult<ValidatedChatRequest> {
  const result = ChatRequestSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors = result.error.issues.map((issue) => issue.message)
  return { success: false, errors }
}
