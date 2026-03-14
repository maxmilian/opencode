# StaffAI Platform

Your Intelligent Chief of Staff — AI-powered business assistant platform.

Forked from [OpenCode](https://github.com/anomalyco/opencode), repurposed from a coding agent to a general-purpose AI agent platform for business professionals.

## Features

- **Company Investigation** — Deep due diligence reports (TW/US markets)
- **Data Analysis** — CSV/Excel/database analysis
- **Report Summary** — Meeting notes and document summarization
- **Competitor Research** — Market intelligence and competitor analysis
- **Document Processing** — PDF/Word/Excel parsing and conversion
- **Image Analysis** — OCR and chart interpretation
- **Strategy Simulation** — Business strategy planning

## Tech Stack

- **Frontend**: Solid.js + Vite + Tailwind CSS
- **Backend**: TypeScript + Bun + Hono
- **AI**: Anthropic Claude (default), multi-provider support
- **Auth**: Google SSO
- **Storage**: Google Drive + GCS (cloud-only, no local filesystem)
- **Database**: SQLite (session/config) + PostgreSQL (business data)

## Development

```bash
# Install dependencies
bun install

# Start backend server (port 4096)
bun run --cwd packages/opencode --conditions=browser src/index.ts serve

# Start frontend dev server (port 3000)
bun run dev:web

# Open in browser
open http://localhost:3000
```

## Architecture

```
StaffAI Platform (this repo)
├── packages/app/          # Frontend (Solid.js)
├── packages/ui/           # UI component library
├── packages/opencode/     # Agent engine + API server
├── packages/plugin/       # Plugin system
├── packages/sdk/          # Generated API client
└── docs/                  # Platform plan & docs

External:
└── staff-ai-bd/           # Company investigation microservice (Python/FastAPI)
```

## Deployment

Target: `staff-ai.io` on GCP VM via Docker Compose.

See [docs/staffai-platform-plan.md](docs/staffai-platform-plan.md) for the full implementation plan.

## License

MIT (inherited from OpenCode)
