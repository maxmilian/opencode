# StaffAI Platform

## 專案概述
基於 OpenCode fork 的通用 AI Agent 平台，面向企業 BD/PM 團隊。從 coding agent 改造為商業助理平台。

## Tech Stack
- **Frontend**: Solid.js + Vite + Tailwind CSS v4
- **Backend**: TypeScript + Bun + Hono (API server)
- **AI**: Anthropic Claude（預設）
- **Auth**: Google SSO（預定）
- **Storage**: Google Drive + GCS（雲端架構，無本地檔案）
- **Package Manager**: Bun（monorepo with Turbo）

## 專案結構
```
packages/
├── app/              # 前端 Solid.js app（port 3000 dev）
├── ui/               # 共用 UI 元件庫（50+ 元件）
├── opencode/         # Agent 引擎 + API server（port 4096）
├── plugin/           # Plugin 系統（hook-based）
├── sdk/              # OpenAPI 自動生成 client
├── desktop/          # Tauri 桌面應用（暫不使用）
└── web/              # Astro 文件站（暫不使用）
docs/
└── staffai-platform-plan.md  # 完整改造計畫
```

## 開發指令
```bash
# 安裝依賴
bun install

# 啟動 backend（API server，port 4096）
bun run --cwd packages/opencode --conditions=browser src/index.ts serve

# 啟動 frontend（Vite dev server，port 3000）
bun run dev:web

# Build 前端
bun --cwd packages/app build

# Typecheck
bun turbo typecheck

# 啟動完整 web（backend + 內嵌前端，需先 build）
bun run --cwd packages/opencode --conditions=browser src/index.ts web
```

## 已完成的改造
- [x] 品牌替換：OpenCode → StaffAI（所有 UI、i18n、prompt、favicon）
- [x] System prompt：從 coding agent 改為商業助理
- [x] 移除 coding-specific UI：Terminal、File Editor、Review Panel
- [x] 移除 Provider/Model 設定 UI（預設用 Claude）
- [x] 移除 Discord/Help/LSP UI
- [x] 新增首頁 Skill 卡片（Company Investigation、Data Analysis 等）
- [x] Prompt input 顯示 "StaffAI Thinking"（不可選模型）

## 待完成
- [ ] Google SSO 登入
- [ ] Google Drive 整合
- [ ] GCS 個人檔案空間
- [ ] Company Investigation skill（串接 staff-ai-bd）
- [ ] 其他 Skill modules
- [ ] Docker Compose 部署
- [ ] staff-ai.io 域名切換

## 注意事項
- npm package scope 保留 `@opencode-ai/`（避免 break build）
- `packages/opencode/` 目錄名保留（大量 internal reference）
- 後端 LSP 依賴保留（移除太深，只隱藏前端 UI）
- 前端開發用 Vite dev server (port 3000)，需搭配 backend (port 4096)
- `opencode web` 用的是 build 好的前端，改原始碼需先 `bun --cwd packages/app build`
- Pre-push hook 會跑 `turbo typecheck`，確保不 break

## Fork 資訊
- **Origin**: `github.com/maxmilian/opencode`（fork）
- **Upstream**: `github.com/anomalyco/opencode`（原始 repo）
- **Branch**: `feat/staffai-customization`
- **本地路徑**: `/Users/maxmilian/side/aiotek/staff-ai-platform/`
