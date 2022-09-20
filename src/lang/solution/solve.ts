import { Ctx } from "../ctx"
import {
  Solution,
  solveByType,
  solveByValue,
  solveVar,
  walk,
} from "../solution"
import { Value } from "../value"

/**

   # solve

   `solve` will be used during elaboration (`check` and `infer`),
   to support features like `PiImplicit`.

   The recursion structure of `solve` closely follows `readback`,
   but dealing with two values in each step.

**/

export function solve(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): Solution {
  left = walk(solution, left)
  right = walk(solution, right)

  return (
    solveVar(solution, left, right) ||
    solveByType(solution, ctx, type, left, right) ||
    solveByValue(solution, ctx, type, left, right)
  )
}
