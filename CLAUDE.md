# AI Chatbot - プロジェクト仕様書

## プロジェクト概要

- **プロジェクト名**: ai-chatbot
- **概要**: OpenAI GPT-4oを使用したシンプルなAIチャットボットWebアプリケーション

## 技術スタック

### フロントエンド
- **フレームワーク**: Next.js (App Router)
- **UIライブラリ**: shadcn/ui
- **スタイリング**: Tailwind CSS
- **言語**: TypeScript

### バックエンド
- **APIフレームワーク**: Hono
- **ORM**: Prisma
- **データベース**: MongoDB (MongoDB Atlas)
- **AI**: OpenAI API (GPT-4o)
- **AIエージェント**: Mastra

### インフラ
- **デプロイ先**: Google Cloud Run (コンテナ)
- **データベースホスティング**: MongoDB Atlas

### 開発ツール
- **パッケージマネージャー**: pnpm
- **バージョン管理**: GitHub (gh コマンド使用)

## 機能要件

### コア機能
- [x] テキストチャット
- [x] ストリーミングレスポンス（リアルタイム表示）
- [x] システムプロンプトのUIからのカスタマイズ

### 会話管理
- セッション中のみ会話履歴を保持
- 永続的な履歴保存は不要
- 単一の会話スレッド

### 認証
- 認証機能なし（オープンアクセス）

## UI/UX 要件

- シンプル・ミニマルなデザイン
- shadcn/ui コンポーネント使用
- レスポンシブ対応は必須ではない

## ディレクトリ構成（推奨）

```
ai-chatbot/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx            # チャットUI
│   │   └── api/
│   │       └── [[...route]]/
│   │           └── route.ts    # Hono API エントリポイント
│   ├── components/
│   │   ├── ui/                 # shadcn/ui コンポーネント
│   │   ├── chat/
│   │   │   ├── chat-container.tsx
│   │   │   ├── chat-input.tsx
│   │   │   ├── chat-message.tsx
│   │   │   └── system-prompt-editor.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── openai.ts           # OpenAI クライアント設定
│   │   ├── prisma.ts           # Prisma クライアント
│   │   └── utils.ts
│   ├── server/
│   │   └── api/
│   │       ├── index.ts        # Hono ルート定義
│   │       └── chat.ts         # チャット API ハンドラ
│   └── types/
│       └── index.ts
├── prisma/
│   └── schema.prisma
├── public/
├── .env.local
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml
```

## 環境変数

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# MongoDB
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/ai-chatbot

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## API エンドポイント

### POST /api/chat
チャットメッセージを送信し、ストリーミングレスポンスを受け取る

**リクエスト:**
```json
{
  "messages": [
    { "role": "user", "content": "こんにちは" }
  ],
  "systemPrompt": "あなたは親切なアシスタントです。"
}
```

**レスポンス:** Server-Sent Events (SSE) によるストリーミング

## 開発コマンド

```bash
# 依存関係インストール
pnpm install

# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# Prisma
pnpm prisma generate
pnpm prisma db push

# Docker ビルド（Cloud Run用）
docker build -t ai-chatbot .
```

## デプロイ手順 (Google Cloud Run)

1. Google Cloud プロジェクトの作成・設定
2. Artifact Registry にDockerイメージをプッシュ
3. Cloud Run サービスを作成
4. 環境変数を設定
5. MongoDB Atlas でIP許可設定（Cloud Run のIPまたは 0.0.0.0/0）

## 開発ルール

- Python の場合は uv を使用（このプロジェクトでは該当なし）
- Node.js の場合は pnpm を使用
- Git 操作は gh コマンドを使用
- 思考は英語、回答は日本語

## 注意事項

- OpenAI API キーは絶対にコミットしない
- MongoDB Atlas の接続文字列は環境変数で管理
- Cloud Run デプロイ時はコンテナのポート設定に注意（デフォルト: 8080）
