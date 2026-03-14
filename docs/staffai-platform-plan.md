# StaffAI Platform — 從 OpenCode 改造為通用 AI Agent 平台

## 1. 專案目標

將 [OpenCode](https://github.com/anomalyco/opencode)（AI coding agent）改造為 **StaffAI**——面向企業 BD/PM 團隊的通用 AI Agent 平台。保留 OpenCode 的 agent 引擎、tool 系統、plugin 架構與前端 UI，移除 coding-specific 功能，替換為商業導向的模組。

### 設計參考

![StaffAI UI Mockup](../../S__8282252.jpg)

- ChatGPT-like 對話介面（暗色主題）
- 模型選擇器：StaffAI Thinking v2.1
- 「Your Next Command」模組卡片
- 快捷功能 chips（代碼編寫、圖像分析、文件處理、策略模擬、數據分析）
- 使用者系統（Plus badge、對話紀錄）

---

## 2. 現有 OpenCode 架構

### 2.1 Tech Stack

| 層級 | 技術 |
|------|------|
| **Runtime** | Bun + TypeScript |
| **後端 Agent** | `packages/opencode/` — agent 引擎、tool 系統、session 管理 |
| **前端 App** | `packages/app/` — Solid.js + Vite |
| **UI 元件庫** | `packages/ui/` — 50+ 元件、30+ 主題（OKLCH 色彩空間） |
| **SDK** | `packages/sdk/` — OpenAPI 自動生成 client |
| **Plugin** | `packages/plugin/` — Hook-based 插件系統 |
| **桌面** | `packages/desktop/` — Tauri 桌面應用 |
| **樣式** | Tailwind CSS v4、CSS 變數設計 |
| **通訊** | SSE (Server-Sent Events) 串流回應 |
| **i18n** | 14+ 語系 |

### 2.2 Agent 系統

- Agent 定義：name、description、mode（primary/subagent）、permission、model
- 內建 agent：build（全功能）、plan（唯讀）、general（子任務）、explore（程式碼探索）
- 支援自訂 agent（config 檔設定）

### 2.3 Tool 系統（3 種註冊方式）

1. **Built-in** — `packages/opencode/src/tool/*.ts`
2. **自動發現** — `.opencode/tool/*.ts` 或 `{tool,tools}/*.{js,ts}`
3. **Plugin** — plugin 回傳 `Hooks.tool` 物件

### 2.4 Plugin 架構

```typescript
// 插件可提供：
{
  tool: { ... },                              // 自訂 tool
  auth: AuthHook,                             // 認證
  "chat.message": async (input, output) => {},  // 攔截訊息
  "tool.execute.before": async () => {},        // tool 執行前 hook
  "tool.execute.after": async () => {},         // tool 執行後 hook
  "tool.definition": async () => {},            // 修改 tool 定義
}
```

---

## 3. 改造計畫

### 3.1 保留

- [x] Agent 引擎（agent 定義、執行、permission 系統）
- [x] Tool 系統（註冊、執行、output 處理）
- [x] Plugin 架構（hook-based 擴展）
- [x] SSE 串流通訊
- [x] 前端 UI 框架（Solid.js + Vite）
- [x] UI 元件庫（session-turn、message-part、prompt-input）
- [x] 主題系統（暗色主題、OKLCH 色彩）
- [x] i18n 多語系（保留 zh-TW、en、ja）
- [x] Session / 對話紀錄管理

### 3.2 移除

- [ ] Coding-specific tools：`EditTool`、`WriteTool`、`BashTool`、`GrepTool`、`GlobTool`、`ApplyPatchTool`、`CodeSearchTool`
- [ ] LSP 整合
- [ ] Terminal 元件
- [ ] Git/diff 相關 UI
- [ ] File editor 面板
- [ ] Coding-specific agent prompts

### 3.3 新增 — Skills（模組卡片）

OpenCode 的 `SkillTool` 機制（類似 slash command）天然適合作為模組入口。每個 Skill 是一個獨立的業務能力，LLM 可根據對話上下文自動觸發，或由使用者手動選擇。

| Skill | ID | 說明 | 觸發方式 | 資料來源 |
|-------|----|------|----------|----------|
| **公司背景調查** | `company-investigation` | 10 大面向深度調查報告（TW/US） | 使用者提到公司名/股票代號自動觸發 | staff-ai-bd (Python FastAPI) |
| **資料分析** | `data-analysis` | 分析 CSV/Excel/資料庫 | 上傳檔案或貼上資料 | LLM + pandas/polars |
| **週報摘要** | `report-summary` | 彙整會議紀錄、文件 | 手動觸發或定時排程 | LLM |
| **競爭者分析** | `competitor-research` | 市場情報、競品比較 | 提到競爭者或產業 | 新聞/SEC/公開資料 |
| **文件處理** | `document-processing` | PDF/Word/Excel 解析轉換 | 上傳檔案 | markitdown |
| **圖像分析** | `image-analysis` | OCR、圖表解讀 | 上傳圖片 | Claude Vision |
| **策略模擬** | `strategy-simulation` | 商業策略推演 | 手動觸發 | LLM |

**Skill vs Tool 的差異**：
- **Tool** — LLM 呼叫的原子操作（如 read、fetch、search）
- **Skill** — 封裝多個 Tool 的高階業務流程（如「背景調查」需要呼叫多個 API + LLM 分析 + 報告生成）
- 前端「Your Next Command」模組卡片 = Skill 的視覺化入口

### 3.4 新增 — 前端客製化

| 項目 | 說明 |
|------|------|
| **品牌** | STAFF AI logo、AIOTEK 品牌色 |
| **首頁** | 「Your Next Command」模組卡片 + 快捷功能 chips |
| **模型選擇器** | StaffAI Thinking v2.1（Grok/Perplexity Fusion 等） |
| **使用者系統** | 登入/註冊、Plus 方案 badge |
| **對話紀錄** | 側邊欄歷史列表 |

### 3.5 新增 — 基礎建設

| 項目 | 說明 |
|------|------|
| **認證系統** | JWT + OAuth（Google/GitHub） |
| **使用者 DB** | PostgreSQL（沿用現有） |
| **部署** | Docker Compose on GCP VM（取代 Cloudflare） |
| **域名** | staff-ai.io（與現有服務共用或子域名） |

---

## 4. 架構圖

```
┌─────────────────────────────────────────────────┐
│                  StaffAI Platform                │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │           Frontend (Solid.js + Vite)       │  │
│  │  ┌─────────┐ ┌──────────┐ ┌────────────┐  │  │
│  │  │ Chat UI │ │ 模組卡片  │ │ 對話紀錄   │  │  │
│  │  └────┬────┘ └──────────┘ └────────────┘  │  │
│  │       │ SSE                                │  │
│  └───────┼───────────────────────────────────┘  │
│          │                                      │
│  ┌───────┴───────────────────────────────────┐  │
│  │         Agent Engine (TypeScript)          │  │
│  │  ┌─────────────────────────────────────┐   │  │
│  │  │            Tool Registry            │   │  │
│  │  │  ┌──────────┐  ┌──────────────────┐ │   │  │
│  │  │  │ Built-in │  │    Plugins       │ │   │  │
│  │  │  │ Tools    │  │ (.opencode/tool) │ │   │  │
│  │  │  └──────────┘  └──────────────────┘ │   │  │
│  │  └─────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────┘  │
│          │                                      │
│  ┌───────┴───────────────────────────────────┐  │
│  │          External Services                 │  │
│  │  ┌────────────┐  ┌───────┐  ┌──────────┐  │  │
│  │  │ staff-ai-bd│  │ LLM   │  │ 3rd Party│  │  │
│  │  │ (Python    │  │ APIs  │  │ APIs     │  │  │
│  │  │  FastAPI)  │  │       │  │          │  │  │
│  │  └────────────┘  └───────┘  └──────────┘  │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 5. 背景調查模組整合方案

### 方案：staff-ai-bd 作為獨立微服務

現有 staff-ai-bd（Python/FastAPI）保持獨立運行，StaffAI Platform 透過 HTTP API 呼叫。

```
StaffAI Platform (TypeScript)
    │
    │ HTTP API call
    ▼
staff-ai-bd (Python/FastAPI :8080)
    │
    ├── /api/investigate     → 啟動調查
    ├── /api/sessions        → 查詢歷史
    └── /api/sessions/{id}   → 取得報告
```

**Tool 實作**（`.opencode/tool/company-investigation.ts`）：

```typescript
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "調查指定公司的背景資料，包含組織架構、股東結構、財務狀況、核心技術、競爭對手、法律風險等 10 大面向。支援台灣上市/上櫃/興櫃及美國 NYSE/NASDAQ。",
  args: {
    query: tool.schema.string().describe("公司名稱、股票代號或統一編號"),
    region: tool.schema.enum(["TW", "US"]).describe("調查地區").default("TW"),
  },
  async execute(args) {
    const response = await fetch("http://localhost:8080/api/investigate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: args.query,
        region: args.region,
      }),
    })
    const result = await response.json()
    return `調查完成：${result.company_name}\n報告連結：${result.report_url}`
  },
})
```

---

## 6. 實作階段

### Phase 1：基礎環境（1-2 天）

- [ ] Fork OpenCode，建立 staffai-platform repo
- [ ] `bun install` 確認本地可跑
- [ ] 品牌替換：logo、名稱、favicon
- [ ] 移除 coding-specific tools（保留 WebFetch、WebSearch）
- [ ] 調整預設 agent prompt（從 coding 改為商業助理）

### Phase 2：背景調查模組（2-3 天）

- [ ] 將 staff-ai-bd 包裝為 plugin tool
- [ ] 調查結果整合到對話 UI（Markdown 渲染）
- [ ] 測試端對端流程：使用者問「調查台積電」→ 觸發調查 → 回傳報告

### Phase 3：前端客製化（3-5 天）

- [ ] 首頁「Your Next Command」模組卡片
- [ ] 快捷功能 chips
- [ ] 暗色主題微調（對齊 AIOTEK 品牌色）
- [ ] 模型選擇器 UI（StaffAI Thinking v2.1）
- [ ] 使用者 profile（名稱、avatar、Plus badge）

### Phase 4：更多模組（持續）

- [ ] 資料分析 tool
- [ ] 週報摘要 tool
- [ ] 競爭者分析 tool
- [ ] 文件處理 tool
- [ ] 圖像分析 tool

### Phase 5：部署與上線

- [ ] Docker Compose 設定（platform + staff-ai-bd + PostgreSQL）
- [ ] GCP VM 部署（取代現有 staff-ai-bd 的對外服務）
- [ ] staff-ai.io 域名指向 staffai-platform
- [ ] staff-ai-bd 降級為內部微服務（僅內網 127.0.0.1:8080，不對外）
- [ ] 認證系統（JWT + OAuth）

**最終部署架構**：
```
staff-ai.io (Nginx 443)
    │
    ├── / → staffai-platform (TypeScript, :3000)  ← 對外主服務
    │
    └── (internal only)
        └── staff-ai-bd (Python/FastAPI, :8080)   ← 內部微服務
            └── 背景調查 skill 的後端 API
```

---

## 7. 開發指令

```bash
# 進入 platform 目錄
cd /Users/maxmilian/side/aiotek/staffai-platform

# 安裝依賴
bun install

# 啟動開發（Web 版）
bun run dev:web

# 啟動開發（桌面版）
bun run dev:desktop

# 啟動 staff-ai-bd（背景調查微服務）
cd /Users/maxmilian/side/aiotek/staff-ai-bd
uv run uvicorn app.main:app --reload --port 8080
```

---

## 8. 風險與注意事項

| 風險 | 說明 | 對策 |
|------|------|------|
| OpenCode 更新頻繁 | 122k stars，社群活躍，upstream 變動大 | 定期 rebase，但不追最新版 |
| Bun 相容性 | 部分 npm 套件可能不支援 Bun | 測試驗證，必要時用 Node.js fallback |
| 前端改動量大 | Solid.js 學習曲線 | 優先改 CSS/config，再改元件邏輯 |
| 部署架構複雜 | TypeScript platform + Python staff-ai-bd | Docker Compose 統一管理 |
| LLM 成本 | 多模組同時使用 | 依模組設定不同模型（Haiku/Sonnet/Opus） |
