# AI Chatbot - 実行計画

## Phase 1: プロジェクト初期設定

- [ ] Next.js プロジェクトの作成（App Router, TypeScript）
- [ ] pnpm の設定確認
- [ ] 基本的なディレクトリ構造の作成
- [ ] Git リポジトリの初期化（gh コマンド使用）
- [ ] .gitignore の設定
- [ ] .env.example の作成

## Phase 2: 開発環境のセットアップ

- [ ] Tailwind CSS の設定
- [ ] shadcn/ui のインストールと初期設定
- [ ] 必要な shadcn/ui コンポーネントの追加（Button, Input, Card, ScrollArea など）
- [ ] ESLint / Prettier の設定（任意）

## Phase 3: データベース設定

- [ ] Prisma のインストール
- [ ] MongoDB Atlas クラスターの作成
- [ ] DATABASE_URL の設定
- [ ] Prisma スキーマの作成（schema.prisma）
- [ ] Prisma クライアントの生成

## Phase 4: バックエンド API 構築

- [ ] Hono のインストール
- [ ] Hono と Next.js App Router の統合（catch-all route）
- [ ] OpenAI SDK のインストール
- [ ] Mastra のインストールと設定
- [ ] OpenAI クライアントの設定（lib/openai.ts）
- [ ] チャット API エンドポイントの作成（/api/chat）
- [ ] ストリーミングレスポンスの実装

## Phase 5: フロントエンド UI 構築

- [ ] レイアウトコンポーネントの作成（layout.tsx）
- [ ] チャットコンテナコンポーネントの作成（chat-container.tsx）
- [ ] メッセージ表示コンポーネントの作成（chat-message.tsx）
- [ ] 入力フォームコンポーネントの作成（chat-input.tsx）
- [ ] システムプロンプト編集コンポーネントの作成（system-prompt-editor.tsx）
- [ ] ストリーミング表示の実装
- [ ] セッション内会話履歴の状態管理

## Phase 6: 統合とテスト

- [ ] フロントエンドとバックエンドの結合テスト
- [ ] ストリーミングレスポンスの動作確認
- [ ] システムプロンプト変更機能の動作確認
- [ ] エラーハンドリングの実装
- [ ] ローディング状態の実装

## Phase 7: Docker 設定

- [ ] Dockerfile の作成
- [ ] docker-compose.yml の作成（ローカル開発用）
- [ ] ローカルでの Docker ビルド・実行テスト

## Phase 8: Google Cloud Run デプロイ

- [ ] Google Cloud プロジェクトの作成
- [ ] gcloud CLI の設定
- [ ] Artifact Registry の設定
- [ ] Docker イメージのビルド・プッシュ
- [ ] Cloud Run サービスの作成
- [ ] 環境変数の設定
- [ ] MongoDB Atlas のネットワーク設定（IP許可）
- [ ] 本番環境での動作確認

## Phase 9: 最終確認

- [ ] 本番環境でのチャット機能テスト
- [ ] パフォーマンス確認
- [ ] README.md の作成（任意）

---

## 備考

- 各フェーズは順番に進めることを推奨
- MongoDB Atlas のアカウント作成が事前に必要
- OpenAI API キーの取得が事前に必要
- Google Cloud アカウントと課金設定が事前に必要
