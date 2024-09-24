import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("check Var", async () => {
  await runCode(`

let t: Type = Type
check t: Type

`)
})

test("check Var -- fail to check undefined variable", async () => {
  await expectCodeToFail(`

check t: Type

`)
})
