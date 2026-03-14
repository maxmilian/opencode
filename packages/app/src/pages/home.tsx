import { createMemo, For } from "solid-js"
import { Button } from "@opencode-ai/ui/button"
import { Icon } from "@opencode-ai/ui/icon"
import { useNavigate } from "@solidjs/router"
import { base64Encode } from "@opencode-ai/util/encode"
import { useLayout } from "@/context/layout"
import { useServer } from "@/context/server"
import { useGlobalSync } from "@/context/global-sync"
import { useLanguage } from "@/context/language"

const SKILLS = [
  {
    id: "company-investigation",
    title: "Company Investigation",
    description: 'Try "Investigate TSMC"',
    icon: "magnifying-glass" as const,
    gradient: "from-blue-500/20 to-blue-600/10",
  },
  {
    id: "data-analysis",
    title: "Data Analysis Workflow",
    description: 'Try "Analyze Q3 financial reports"',
    icon: "code" as const,
    gradient: "from-purple-500/20 to-purple-600/10",
  },
  {
    id: "report-summary",
    title: "Weekly Report Summary",
    description: 'Summarize "ZEUS Games weekly meeting notes"',
    icon: "checklist" as const,
    gradient: "from-green-500/20 to-green-600/10",
  },
  {
    id: "competitor-research",
    title: "Competitor Market Research",
    description: 'Analyze "AIOTEK" market opportunities',
    icon: "glasses" as const,
    gradient: "from-orange-500/20 to-orange-600/10",
  },
]

const QUICK_ACTIONS = [
  { label: "Company Investigation", icon: "magnifying-glass" },
  { label: "Data Analysis", icon: "code" },
  { label: "Document Processing", icon: "checklist" },
  { label: "Strategy Simulation", icon: "brain" },
  { label: "Image Analysis", icon: "photo" },
]

export default function Home() {
  const sync = useGlobalSync()
  const layout = useLayout()
  const navigate = useNavigate()
  const server = useServer()
  const language = useLanguage()

  function startSession(prompt?: string) {
    const directory = sync.data.project[0]?.worktree ?? sync.data.path.home
    layout.projects.open(directory)
    server.projects.touch(directory)
    navigate(`/${base64Encode(directory)}`)
  }

  const userName = createMemo(() => {
    return "User"
  })

  return (
    <div class="mx-auto mt-16 w-full max-w-2xl px-4 flex flex-col items-center">
      {/* Greeting */}
      <div class="text-center mb-8">
        <h1 class="text-28-medium text-text-strong mb-2">
          Hello, {userName()}!
        </h1>
        <p class="text-14-regular text-text-weak">
          Your Intelligent Chief of Staff.
        </p>
      </div>

      {/* Your Next Command - Skill Cards */}
      <div class="w-full mb-8">
        <h2 class="text-14-medium text-text-base mb-4">Your Next Command</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <For each={SKILLS}>
            {(skill) => (
              <button
                class="flex flex-col gap-2 p-3 rounded-xl bg-surface-base border border-border-weak-base hover:border-border-base transition-colors text-left cursor-pointer"
                onClick={() => startSession(skill.description)}
              >
                <div class="w-full aspect-[4/3] rounded-lg bg-gradient-to-br from-surface-raised-base to-surface-base flex items-center justify-center mb-1">
                  <Icon name={skill.icon as any} class="text-text-weak" size="large" />
                </div>
                <div class="text-12-medium text-text-strong leading-tight">{skill.title}</div>
                <div class="text-11-regular text-text-weak leading-tight line-clamp-2">{skill.description}</div>
              </button>
            )}
          </For>
        </div>
      </div>

      {/* Quick Action Chips */}
      <div class="w-full mb-6 flex flex-wrap gap-2 justify-center">
        <For each={QUICK_ACTIONS}>
          {(action) => (
            <button
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-weak-base bg-surface-base hover:border-border-base transition-colors cursor-pointer"
              onClick={() => startSession()}
            >
              <Icon name={action.icon as any} class="text-text-weak" />
              <span class="text-12-regular text-text-weak">{action.label}</span>
            </button>
          )}
        </For>
      </div>

      {/* Chat Input */}
      <div class="w-full">
        <button
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border-weak-base bg-surface-base hover:border-border-base transition-colors cursor-pointer"
          onClick={() => startSession()}
        >
          <span class="text-14-regular text-text-weak flex-1 text-left">
            Ask anything...
          </span>
          <div class="flex items-center gap-2">
            <span class="text-11-regular text-text-weak px-2 py-0.5 rounded bg-surface-raised-base">
              StaffAI Thinking v2.1
            </span>
            <Icon name="arrow-right" class="text-text-weak" />
          </div>
        </button>
      </div>
    </div>
  )
}
