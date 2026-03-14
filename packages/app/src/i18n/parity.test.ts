import { describe, expect, test } from "bun:test"
import { dict as en } from "./en"
import { dict as ja } from "./ja"
import { dict as zht } from "./zht"

const locales = [ja, zht]
const keys = ["command.session.previous.unseen", "command.session.next.unseen"] as const

describe("i18n parity", () => {
  test("non-English locales translate targeted unseen session keys", () => {
    for (const locale of locales) {
      for (const key of keys) {
        expect(locale[key]).toBeDefined()
        expect(locale[key]).not.toBe(en[key])
      }
    }
  })
})
