import { z } from "zod"

// 環境変数のスキーマ定義
const envSchema = z.object({
  // 必須: OpenAI API キー
  OPENAI_API_KEY: z
    .string()
    .min(1, "OPENAI_API_KEY is required")
    .startsWith("sk-", "OPENAI_API_KEY must start with 'sk-'"),

  // オプション: データベースURL（本番環境では必須にすることも可能）
  DATABASE_URL: z.string().optional(),

  // オプション: アプリURL
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Node環境
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
})

// 型エクスポート
export type Env = z.infer<typeof envSchema>

// 環境変数のバリデーションと取得
function validateEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n")

    throw new Error(
      `❌ 環境変数のバリデーションに失敗しました:\n${errors}\n\n` +
        `.env.local ファイルを確認してください。`
    )
  }

  return result.data
}

// シングルトンとしてエクスポート
export const env = validateEnv()
