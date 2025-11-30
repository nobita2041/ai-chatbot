/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    // 必須: OpenAI API キー
    OPENAI_API_KEY: string

    // オプション: データベースURL
    DATABASE_URL?: string

    // オプション: アプリURL
    NEXT_PUBLIC_APP_URL?: string

    // Node環境
    NODE_ENV: "development" | "production" | "test"
  }
}
