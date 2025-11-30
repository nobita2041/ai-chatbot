import { Agent } from "@mastra/core/agent"
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/constants"
import { env } from "@/lib/env"

// 環境変数のバリデーションを実行（インポート時にチェック）
// env オブジェクトの参照で起動時にバリデーションが走る
const _validateEnv = env.OPENAI_API_KEY

export function createChatAgent(systemPrompt?: string) {
  return new Agent({
    id: "chat-agent",
    name: "Chat Assistant",
    instructions: systemPrompt || DEFAULT_SYSTEM_PROMPT,
    model: "openai/gpt-4o",
  })
}

export const defaultAgent = createChatAgent()
