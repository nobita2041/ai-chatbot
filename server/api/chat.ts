import { Hono } from "hono"
import { stream } from "hono/streaming"
import { createChatAgent } from "@/lib/mastra"
import { validateChatRequest } from "@/lib/validation"
import { openai } from "@/lib/openai"

export const chatRoute = new Hono()

chatRoute.post("/", async (c) => {
  try {
    const body = await c.req.json()

    // zodによる入力バリデーション
    const validation = validateChatRequest(body)
    if (!validation.success) {
      return c.json({ error: "Validation failed", details: validation.errors }, 400)
    }

    const { messages, systemPrompt } = validation.data

    // メッセージに画像が含まれているかチェック
    const hasImages = messages.some((msg) => Array.isArray(msg.content))

    // 画像が含まれる場合はOpenAI APIを直接使用
    if (hasImages) {
      return stream(c, async (stream) => {
        try {
          // システムプロンプトをメッセージに追加
          const apiMessages: Array<{ role: string; content: unknown }> = systemPrompt
            ? [{ role: "system", content: systemPrompt }, ...messages]
            : messages

          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: apiMessages as never,
            stream: true,
          })

          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              await stream.write(content)
            }
          }
        } catch {
          await stream.write("\n[Error occurred during generation]")
        }
      })
    }

    // テキストのみの場合はMastraを使用（既存の実装）
    const agent = createChatAgent(systemPrompt)

    // Get the last user message for streaming
    const lastMessage = messages[messages.length - 1]

    // Stream the response
    return stream(c, async (stream) => {
      try {
        const response = await agent.stream(lastMessage.content as string)

        for await (const chunk of response.textStream) {
          await stream.write(chunk)
        }
      } catch {
        await stream.write("\n[Error occurred during generation]")
      }
    })
  } catch {
    return c.json({ error: "Internal server error" }, 500)
  }
})

// Non-streaming endpoint for simple responses
chatRoute.post("/simple", async (c) => {
  try {
    const body = await c.req.json()

    // zodによる入力バリデーション
    const validation = validateChatRequest(body)
    if (!validation.success) {
      return c.json({ error: "Validation failed", details: validation.errors }, 400)
    }

    const { messages, systemPrompt } = validation.data

    const agent = createChatAgent(systemPrompt)
    const lastMessage = messages[messages.length - 1]

    const response = await agent.generate(lastMessage.content)

    return c.json({
      message: {
        role: "assistant" as const,
        content: response.text,
      },
    })
  } catch {
    return c.json({ error: "Internal server error" }, 500)
  }
})
