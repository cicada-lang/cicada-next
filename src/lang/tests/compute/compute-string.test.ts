import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("compute String", async () => {
  const output = await runCode(`

compute String

`)

  expect(output).toMatchSnapshot()
})
