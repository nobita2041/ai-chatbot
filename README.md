# AI Chatbot

OpenAI GPT-4oを使用したシンプルなAIチャットボットWebアプリケーション

## 機能

- テキストチャット
- ストリーミングレスポンス（リアルタイム表示）
- システムプロンプトのカスタマイズ（UIから変更可能）
- セッション内会話履歴の保持

## 技術スタック

### フロントエンド
- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- shadcn/ui

### バックエンド
- Hono
- Prisma (MongoDB)
- Mastra (AIエージェント)
- OpenAI API (GPT-4o)

### インフラ
- Google Cloud Run
- MongoDB Atlas

## セットアップ

### 必要条件

- Node.js 22+
- pnpm
- MongoDB (ローカル開発) または MongoDB Atlas (本番)
- OpenAI API キー

### インストール

\`\`\`bash
# 依存関係のインストール
pnpm install

# Prismaクライアントの生成
pnpm prisma generate
\`\`\`

### 環境変数

\`.env.local\` ファイルを作成:

\`\`\`env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# MongoDB (ローカル開発)
DATABASE_URL="mongodb://localhost:27017/ai-chatbot?directConnection=true"

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 開発サーバーの起動

\`\`\`bash
# MongoDBの起動（ローカル開発）
brew services start mongodb-community

# 開発サーバーの起動
pnpm dev
\`\`\`

http://localhost:3000 でアクセス可能

## Docker

### ローカルでのDocker実行

\`\`\`bash
# docker-composeで起動（MongoDB含む）
OPENAI_API_KEY=your_key docker compose up -d

# 停止
docker compose down
\`\`\`

### イメージのビルド

\`\`\`bash
docker build -t ai-chatbot .
\`\`\`

## デプロイ (Google Cloud Run)

### 前提条件

- gcloud CLIのインストールと認証
- Google Cloudプロジェクトの作成
- MongoDB Atlasのセットアップ

### デプロイ手順

\`\`\`bash
# Artifact Registryの作成
gcloud artifacts repositories create ai-chatbot \\
  --repository-format=docker \\
  --location=asia-northeast1

# Docker認証の設定
gcloud auth configure-docker asia-northeast1-docker.pkg.dev

# イメージのビルドとプッシュ
docker build --platform linux/amd64 \\
  -t asia-northeast1-docker.pkg.dev/PROJECT_ID/ai-chatbot/app:latest .
docker push asia-northeast1-docker.pkg.dev/PROJECT_ID/ai-chatbot/app:latest

# Cloud Runへデプロイ
gcloud run deploy ai-chatbot \\
  --image asia-northeast1-docker.pkg.dev/PROJECT_ID/ai-chatbot/app:latest \\
  --region asia-northeast1 \\
  --platform managed \\
  --allow-unauthenticated \\
  --port 8080 \\
  --set-env-vars "OPENAI_API_KEY=your_key" \\
  --set-env-vars "DATABASE_URL=mongodb+srv://..." \\
  --set-env-vars "NEXT_PUBLIC_APP_URL=https://your-service-url.run.app"
\`\`\`

## プロジェクト構成

\`\`\`
ai-chatbot/
├── src/app/              # Next.js App Router
│   ├── page.tsx          # チャットUI
│   └── api/              # Hono API
├── components/
│   ├── ui/               # shadcn/ui
│   └── chat/             # チャットコンポーネント
├── lib/                  # ユーティリティ
├── server/api/           # APIハンドラ
├── prisma/               # Prismaスキーマ
├── Dockerfile
└── docker-compose.yml
\`\`\`

## ライセンス

MIT
