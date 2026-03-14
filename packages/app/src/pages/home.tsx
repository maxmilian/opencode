import { createMemo, createSignal, For } from "solid-js"
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
    titleKey: "home.skill.companyInvestigation" as const,
    descKey: "home.skill.companyInvestigation.desc" as const,
    icon: "magnifying-glass" as const,
  },
  {
    id: "data-analysis",
    titleKey: "home.skill.dataAnalysis" as const,
    descKey: "home.skill.dataAnalysis.desc" as const,
    icon: "code" as const,
  },
  {
    id: "report-summary",
    titleKey: "home.skill.reportSummary" as const,
    descKey: "home.skill.reportSummary.desc" as const,
    icon: "checklist" as const,
  },
  {
    id: "competitor-research",
    titleKey: "home.skill.competitorResearch" as const,
    descKey: "home.skill.competitorResearch.desc" as const,
    icon: "glasses" as const,
  },
]

const QUICK_ACTIONS = [
  { labelKey: "home.quick.companyInvestigation" as const, icon: "magnifying-glass" },
  { labelKey: "home.quick.dataAnalysis" as const, icon: "code" },
  { labelKey: "home.quick.documentProcessing" as const, icon: "checklist" },
  { labelKey: "home.quick.strategySimulation" as const, icon: "brain" },
  { labelKey: "home.quick.imageAnalysis" as const, icon: "photo" },
]

export default function Home() {
  const sync = useGlobalSync()
  const layout = useLayout()
  const navigate = useNavigate()
  const server = useServer()
  const language = useLanguage()

  const [inputValue, setInputValue] = createSignal("")

  function startSession(prompt?: string) {
    const directory = sync.data.project[0]?.worktree ?? sync.data.path.home
    layout.projects.open(directory)
    server.projects.touch(directory)
    const base = `/${base64Encode(directory)}`
    if (prompt) {
      navigate(`${base}?prompt=${encodeURIComponent(prompt)}`)
    } else {
      navigate(base)
    }
  }

  const userName = createMemo(() => {
    return "User"
  })

  return (
    <div class="mx-auto mt-16 w-full max-w-2xl px-4 flex flex-col items-center">
      {/* Greeting */}
      <div class="text-center mb-8">
        <h1 class="text-28-medium text-text-strong mb-2">
          {language.t("home.greeting", { name: userName() })}
        </h1>
        <p class="text-14-regular text-text-weak">
          {language.t("home.subtitle")}
        </p>
      </div>

      {/* Your Next Command - Skill Cards */}
      <div class="w-full mb-8">
        <h2 class="text-14-medium text-text-base mb-4">{language.t("home.nextCommand")}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <For each={SKILLS}>
            {(skill) => (
              <button
                class="flex flex-col gap-2 p-3 rounded-xl bg-surface-base border border-border-weak-base hover:border-border-base transition-colors text-left cursor-pointer"
                onClick={() => startSession(language.t(skill.descKey))}
              >
                <div class="w-full aspect-[4/3] rounded-lg bg-gradient-to-br from-surface-raised-base to-surface-base flex items-center justify-center mb-1">
                  <Icon name={skill.icon as any} class="text-text-weak" size="large" />
                </div>
                <div class="text-12-medium text-text-strong leading-tight">{language.t(skill.titleKey)}</div>
                <div class="text-11-regular text-text-weak leading-tight line-clamp-2">{language.t(skill.descKey)}</div>
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
              onClick={() => startSession(language.t(action.labelKey))}
            >
              <Icon name={action.icon as any} class="text-text-weak" />
              <span class="text-12-regular text-text-weak">{language.t(action.labelKey)}</span>
            </button>
          )}
        </For>
      </div>

      {/* Chat Input */}
      <div class="w-full">
        <div class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border-weak-base bg-surface-base focus-within:border-border-base transition-colors">
          <input
            type="text"
            class="flex-1 bg-transparent text-14-regular text-text-base placeholder:text-text-weak outline-none"
            placeholder={language.t("home.askAnything")}
            value={inputValue()}
            onInput={(e) => setInputValue(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue().trim()) {
                e.preventDefault()
                startSession(inputValue().trim())
              }
            }}
          />
          <div class="flex items-center gap-2">
            <span class="text-11-regular text-text-weak px-2 py-0.5 rounded bg-surface-raised-base">
              StaffAI Thinking v2.1
            </span>
            <button
              class="text-text-weak hover:text-text-base transition-colors cursor-pointer"
              onClick={() => {
                if (inputValue().trim()) {
                  startSession(inputValue().trim())
                }
              }}
            >
              <Icon name="arrow-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
