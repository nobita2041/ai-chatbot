import { Hono } from "hono"
import { handle } from "hono/vercel"
import { rateLimiter } from "hono-rate-limiter"
import { chatRoute } from "@/server/api/chat"
import type { HealthCheckResponse } from "@/types"

export const runtime = "nodejs"

const app = new Hono().basePath("/api")

// レート制限ミドルウェア（/api/chat エンドポイント用）
// 1分間に20リクエストまで許可
const chatLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1分
  limit: 20, // 1分あたり20リクエスト
  standardHeaders: "draft-6",
  keyGenerator: (c) => {
    // X-Forwarded-For ヘッダーまたはリモートアドレスからクライアントIPを取得
    const forwarded = c.req.header("x-forwarded-for")
    const realIp = c.req.header("x-real-ip")
    return forwarded?.split(",")[0]?.trim() || realIp || "unknown"
  },
  handler: (c) => {
    return c.json(
      {
        error: "Too many requests",
        message: "リクエストが多すぎます。しばらく待ってから再試行してください。",
      },
      429
    )
  },
})

// Health check（レート制限なし）
// 基本的なヘルスチェック
app.get("/health", (c) => {
  const response: HealthCheckResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
  }
  return c.json(response)
})

// 詳細なヘルスチェック（OpenAI API 接続確認）
app.get("/health/detailed", async (c) => {
  const checks: Record<string, { status: "ok" | "error"; message?: string }> = {}

  // OpenAI API キーの存在確認
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY
  checks.openai_key = hasOpenAIKey
    ? { status: "ok" }
    : { status: "error", message: "OPENAI_API_KEY is not set" }

  // OpenAI API 接続テスト（軽量なモデル一覧取得）
  if (hasOpenAIKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        signal: AbortSignal.timeout(5000), // 5秒タイムアウト
      })

      if (response.ok) {
        checks.openai_api = { status: "ok" }
      } else {
        checks.openai_api = {
          status: "error",
          message: `API returned ${response.status}`,
        }
      }
    } catch (error: unknown) {
      checks.openai_api = {
        status: "error",
        message: error instanceof Error ? error.message : "Connection failed",
      }
    }
  }

  // 全体のステータス判定
  const allOk = Object.values(checks).every((check) => check.status === "ok")

  const response: HealthCheckResponse = {
    status: allOk ? "ok" : "error",
    timestamp: new Date().toISOString(),
    details: checks,
  }

  return c.json(response, allOk ? 200 : 503)
})

// Chat routes（レート制限あり）
app.use("/chat/*", chatLimiter)
app.route("/chat", chatRoute)

export const GET = handle(app)
export const POST = handle(app)
