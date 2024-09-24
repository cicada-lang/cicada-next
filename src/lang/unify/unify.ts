import { indent } from "../../utils/indent.js"
import type { Ctx } from "../ctx/index.js"
import * as Errors from "../errors/index.js"
import type { Mod } from "../mod/index.js"
import { solutionAdvanceValue } from "../solution/index.js"
import { unifyByType, unifyByValue, unifyPatternVar } from "../unify/index.js"
import type { Value } from "../value/index.js"
import { formatType, formatValue } from "../value/index.js"

/**

   # unify

   `unify` will be used during elaboration (`check` and `infer`),
   to support features like `PiImplicit`.

   The recursion structure of `unify` closely follows `readback`,
   but dealing with two values in each step.

**/

export function unify(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): void {
  type = solutionAdvanceValue(mod, type)
  left = solutionAdvanceValue(mod, left)
  right = solutionAdvanceValue(mod, right)

  try {
    if (unifyPatternVar(mod, ctx, type, left, right)) return
    if (unifyByType(mod, ctx, type, left, right)) return
    unifyByValue(mod, ctx, type, left, right)
  } catch (error) {
    if (error instanceof Errors.UnificationError) {
      error.trace.unshift(
        [
          `[unify]`,
          indent(`type: ${formatType(mod, ctx, type)}`),
          indent(`left: ${formatValue(mod, ctx, type, left)}`),
          indent(`right: ${formatValue(mod, ctx, type, right)}`),
        ].join("\n"),
      )
    }

    if (error instanceof Errors.EvaluationError) {
      throw new Errors.UnificationError(
        [
          `[unify] EvaluationError during unification`,
          error.message,
          indent(`type: ${formatType(mod, ctx, type)}`),
          indent(`left: ${formatValue(mod, ctx, type, left)}`),
          indent(`right: ${formatValue(mod, ctx, type, right)}`),
        ].join("\n"),
      )
    }

    throw error
  }
}
