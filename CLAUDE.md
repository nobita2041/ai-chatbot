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
- **データベース**: MongoDB（ローカル開発: mongodb-community / 本番: MongoDB Atlas）
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

## ディレクトリ構成

```
ai-chatbot/
├── src/
│   └── app/                    # Next.js App Router
│       ├── layout.tsx
│       ├── page.tsx            # チャットUI
│       ├── globals.css         # グローバルCSS（Tailwind + shadcn/ui）
│       └── api/
│           └── [[...route]]/
│               └── route.ts    # Hono API エントリポイント
├── components/
│   ├── ui/                     # shadcn/ui コンポーネント
│   └── chat/
│       ├── chat-container.tsx
│       ├── chat-input.tsx
│       ├── chat-message.tsx
│       └── system-prompt-editor.tsx
├── lib/
│   ├── openai.ts               # OpenAI クライアント設定
│   ├── mastra.ts               # Mastra エージェント設定
│   ├── prisma.ts               # Prisma クライアント
│   └── utils.ts                # shadcn/ui ユーティリティ
├── server/
│   └── api/
│       └── chat.ts             # チャット API ハンドラ
├── types/
│   └── index.ts                # 型定義
├── generated/
│   └── prisma/                 # Prisma 生成クライアント
├── hooks/                      # カスタムフック
├── prisma/
│   └── schema.prisma
├── prisma.config.ts            # Prisma 7 設定ファイル
├── public/
├── .env.local
├── .env.example
├── components.json             # shadcn/ui 設定
├── Dockerfile
├── docker-compose.yml
├── next.config.ts
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml
```

### パスエイリアス

- `@/*` → プロジェクトルート（`./`）
- `@/components/ui` → shadcn/ui コンポーネント
- `@/lib/utils` → ユーティリティ関数

## 環境変数

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# MongoDB（ローカル開発）
DATABASE_URL="mongodb://localhost:27017/ai-chatbot?directConnection=true"

# MongoDB（本番 - MongoDB Atlas）
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/ai-chatbot"

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
