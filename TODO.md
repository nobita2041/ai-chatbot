# AI Chatbot - 実行計画

## Phase 1: プロジェクト初期設定

- [x] Next.js プロジェクトの作成（App Router, TypeScript）
- [x] pnpm の設定確認
- [x] 基本的なディレクトリ構造の作成
- [x] Git リポジトリの初期化（gh コマンド使用）
- [x] .gitignore の設定
- [x] .env.example の作成

## Phase 2: 開発環境のセットアップ

- [x] Tailwind CSS の設定
- [x] shadcn/ui のインストールと初期設定
- [x] 必要な shadcn/ui コンポーネントの追加（Button, Input, Card, ScrollArea, Textarea）
- [x] ESLint / Prettier の設定（Next.js デフォルト ESLint 使用）

## Phase 3: データベース設定

- [x] Prisma のインストール
- [x] ローカル MongoDB のセットアップ（brew install mongodb-community）
- [x] DATABASE_URL の設定（.env, .env.local）
- [x] Prisma スキーマの作成（schema.prisma）
- [x] Prisma クライアントの生成（generated/prisma）

## Phase 4: バックエンド API 構築

- [x] Hono のインストール
- [x] Hono と Next.js App Router の統合（catch-all route）
- [x] OpenAI SDK のインストール
- [x] Mastra のインストールと設定
- [x] OpenAI クライアントの設定（lib/openai.ts）
- [x] Mastra エージェントの設定（lib/mastra.ts）
- [x] チャット API エンドポイントの作成（/api/chat）
- [x] ストリーミングレスポンスの実装

## Phase 5: フロントエンド UI 構築

- [x] レイアウトコンポーネントの作成（layout.tsx）
- [x] チャットコンテナコンポーネントの作成（chat-container.tsx）
- [x] メッセージ表示コンポーネントの作成（chat-message.tsx）
- [x] 入力フォームコンポーネントの作成（chat-input.tsx）
- [x] システムプロンプト編集コンポーネントの作成（system-prompt-editor.tsx）
- [x] ストリーミング表示の実装
- [x] セッション内会話履歴の状態管理

## Phase 6: 統合とテスト

- [x] フロントエンドとバックエンドの結合テスト
- [x] ストリーミングレスポンスの動作確認
- [x] システムプロンプト変更機能の動作確認
- [x] エラーハンドリングの実装
- [x] ローディング状態の実装

## Phase 7: Docker 設定

- [x] Dockerfile の作成
- [x] docker-compose.yml の作成（ローカル開発用）
- [x] ローカルでの Docker ビルド・実行テスト

## Phase 8: Google Cloud Run デプロイ

- [x] Google Cloud プロジェクトの作成
- [x] gcloud CLI の設定
- [x] Artifact Registry の設定
- [x] Docker イメージのビルド・プッシュ
- [x] Cloud Run サービスの作成
- [x] 環境変数の設定
- [x] MongoDB Atlas のネットワーク設定（IP許可）
- [x] 本番環境での動作確認

## Phase 9: 最終確認

- [x] 本番環境でのチャット機能テスト
- [x] パフォーマンス確認
- [x] README.md の作成（任意）

---

## 備考

- 各フェーズは順番に進めることを推奨
- MongoDB Atlas のアカウント作成が事前に必要
- OpenAI API キーの取得が事前に必要
- Google Cloud アカウントと課金設定が事前に必要
