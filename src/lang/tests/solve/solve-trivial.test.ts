import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Trivial", async () => {
  const output = await runCode(`

solve () {
  unify Trivial = Trivial
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})
