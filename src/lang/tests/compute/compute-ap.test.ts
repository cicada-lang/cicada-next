import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("compute Ap", async () => {
  const output = await runCode(`

let id: (T: Type, x: T) -> T = (T, x) => x
compute id(Type, Type)

`)

  expect(output).toMatchSnapshot()
})
