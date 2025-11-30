import { Hono } from "hono"
import { stream } from "hono/streaming"
import { createChatAgent } from "@/lib/mastra"
import { validateChatRequest } from "@/lib/validation"

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

    // Create agent with custom system prompt if provided
    const agent = createChatAgent(systemPrompt)

    // Format messages for the agent
    const formattedMessages = messages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }))

    // Get the last user message for streaming
    const lastMessage = formattedMessages[formattedMessages.length - 1]

    // Stream the response
    return stream(c, async (stream) => {
      try {
        const response = await agent.stream(lastMessage.content)

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
