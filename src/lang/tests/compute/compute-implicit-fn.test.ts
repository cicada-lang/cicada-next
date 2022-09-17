import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute ImplicitFn", async () => {
  const output = await runCode(`

let infer: (implicit T: Type, x: T) -> Type = (implicit T, x) => T
compute infer

`)

  expect(output).toMatchInlineSnapshot(
    '"(implicit T, x) => T: (implicit T: Type, x: T) -> Type"',
  )
})

test.todo("compute ImplicitFn -- ImplicitAp", async () => {
  const output = await runCode(`

let infer: (implicit T: Type, x: T) -> Type = (implicit T, x) => T
compute infer(implicit Trivial, sole)

`)

  expect(output).toMatchInlineSnapshot()
})
