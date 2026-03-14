import * as i18n from "@solid-primitives/i18n"
import { createEffect, createMemo } from "solid-js"
import { createStore } from "solid-js/store"
import { createSimpleContext } from "@opencode-ai/ui/context"
import { Persist, persisted } from "@/utils/persist"
import { dict as en } from "@/i18n/en"
import { dict as zht } from "@/i18n/zht"
import { dict as ja } from "@/i18n/ja"
import { dict as uiEn } from "@opencode-ai/ui/i18n/en"
import { dict as uiZht } from "@opencode-ai/ui/i18n/zht"
import { dict as uiJa } from "@opencode-ai/ui/i18n/ja"

export type Locale = "en" | "zht" | "ja"

type RawDictionary = typeof en & typeof uiEn
type Dictionary = i18n.Flatten<RawDictionary>

function cookie(locale: Locale) {
  return `oc_locale=${encodeURIComponent(locale)}; Path=/; Max-Age=31536000; SameSite=Lax`
}

const LOCALES: readonly Locale[] = ["en", "zht", "ja"]

const INTL: Record<Locale, string> = {
  en: "en",
  zht: "zh-Hant",
  ja: "ja",
}

const LABEL_KEY: Record<Locale, keyof Dictionary> = {
  en: "language.en",
  zht: "language.zht",
  ja: "language.ja",
}

const base = i18n.flatten({ ...en, ...uiEn })
const DICT: Record<Locale, Dictionary> = {
  en: base,
  zht: { ...base, ...i18n.flatten({ ...zht, ...uiZht }) },
  ja: { ...base, ...i18n.flatten({ ...ja, ...uiJa }) },
}

const localeMatchers: Array<{ locale: Locale; match: (language: string) => boolean }> = [
  { locale: "en", match: (language) => language.startsWith("en") },
  { locale: "zht", match: (language) => language.startsWith("zh") },
  { locale: "ja", match: (language) => language.startsWith("ja") },
]

type ParityKey = "command.session.previous.unseen" | "command.session.next.unseen"
const PARITY_CHECK: Record<Exclude<Locale, "en">, Record<ParityKey, string>> = {
  zht,
  ja,
}
void PARITY_CHECK

function detectLocale(): Locale {
  if (typeof navigator !== "object") return "en"

  const languages = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const language of languages) {
    if (!language) continue
    const normalized = language.toLowerCase()
    const match = localeMatchers.find((entry) => entry.match(normalized))
    if (match) return match.locale
  }

  return "en"
}

function normalizeLocale(value: string): Locale {
  return LOCALES.includes(value as Locale) ? (value as Locale) : "en"
}

export const { use: useLanguage, provider: LanguageProvider } = createSimpleContext({
  name: "Language",
  init: () => {
    const [store, setStore, _, ready] = persisted(
      Persist.global("language", ["language.v1"]),
      createStore({
        locale: detectLocale() as Locale,
      }),
    )

    const locale = createMemo<Locale>(() => normalizeLocale(store.locale))
    console.log("locale", locale())
    const intl = createMemo(() => INTL[locale()])

    const dict = createMemo<Dictionary>(() => DICT[locale()])

    const t = i18n.translator(dict, i18n.resolveTemplate)

    const label = (value: Locale) => t(LABEL_KEY[value])

    createEffect(() => {
      if (typeof document !== "object") return
      document.documentElement.lang = locale()
      document.cookie = cookie(locale())
    })

    return {
      ready,
      locale,
      intl,
      locales: LOCALES,
      label,
      t,
      setLocale(next: Locale) {
        setStore("locale", normalizeLocale(next))
      },
    }
  },
})
