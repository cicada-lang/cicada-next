import { indent } from "../../utils/indent"
import { applyClosure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import * as Errors from "../errors"
import * as Exps from "../exp"
import { freeNames } from "../exp"
import { Mod } from "../mod"
import { unifyType } from "../unify"
import { freshen } from "../utils/freshen"
import { formatType, Value } from "../value"
import * as Insertions from "./Insertion"
import { Insertion } from "./Insertion"

export function solveByRetType(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  args: Array<Exps.Arg>,
  retType: Value,
): Array<Insertion> {
  const argsFreeNames = new Set(
    args.flatMap((arg) => Array.from(freeNames(new Set(), arg.exp))),
  )

  const insertions: Array<Insertion> = []
  while (type.kind === "PiImplicit") {
    try {
      unifyType(mod, ctx, type, retType)
      return insertions
    } catch (_error) {
      // NOTE Be careful about scope bug, `freshName` might occurs in `args`.
      const name = type.retTypeClosure.name
      const usedNames = [
        ...ctxNames(ctx),
        ...mod.solution.names,
        ...argsFreeNames,
      ]
      const freshName = freshen(usedNames, name)
      const patternVar = mod.solution.createPatternVar(freshName, type.argType)
      ctx = CtxCons(freshName, type.argType, ctx)
      type = applyClosure(type.retTypeClosure, patternVar)
      insertions.push(Insertions.InsertionPatternVar(patternVar))
    }
  }

  try {
    unifyType(mod, ctx, type, retType)
    return insertions
  } catch (error) {
    if (error instanceof Errors.UnificationError) {
      throw new Errors.ElaborationError(
        [
          `[solveByRetType] meet UnificationError`,
          indent(`inferred type: ${formatType(mod, ctx, type)}`),
          indent(`given type: ${formatType(mod, ctx, retType)}`),
          ...error.trace,
          error.message,
        ].join("\n"),
        { span: undefined },
      )
    }

    throw error
  }
}
