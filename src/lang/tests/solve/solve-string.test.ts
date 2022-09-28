import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve String", async () => {
  const output = await runCode(`

solve () {
  unify String = String
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})
