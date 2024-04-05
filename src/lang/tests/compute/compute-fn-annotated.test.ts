import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("compute FnAnnotated", async () => {
  const output = await runCode(`

let id = (T: Type, x: T) => x

compute id(Type)

`)

  expect(output).toMatchSnapshot()
})
