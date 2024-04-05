import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Objekt -- JSON", async () => {
  const output = await runCode(`

compute { "Hello, World!": "Hi!" }

`)

  expect(output).toMatchSnapshot()
})
