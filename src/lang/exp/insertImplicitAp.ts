import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Core, evaluate } from "../core"
import { Ctx, CtxCons, ctxNames, ctxToEnv } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { check, Inferred } from "../exp"
import {
  createPatternVar,
  deepWalk,
  lookupValueInSolution,
  PatternVar,
  Solution,
  solutionNames,
  solveType,
} from "../solution"
import { freshen } from "../utils/freshen"
import { readback, Value } from "../value"

export function insertImplicitAp(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  target: Core,
  args: Array<Exps.Arg>,
): Inferred {
  const solved = solveArgTypes(solution, ctx, type, args)
  for (const insertion of solved.insertions) {
    target = applyInsertion(solved.solution, ctx, insertion, target)
  }

  const solvedType = deepWalk(solved.solution, ctx, solved.type)
  return Inferred(solvedType, target)
}

function solveArgTypes(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  args: Array<Exps.Arg>,
  insertions: Array<Insertion> = [],
): {
  solution: Solution
  type: Value
  insertions: Array<Insertion>
} {
  const [arg, ...restArgs] = args

  if (arg === undefined) {
    return { solution, type, insertions }
  }

  if (type.kind === "ImplicitPi" && arg.kind === "ArgPlain") {
    const name = type.retTypeClosure.name
    // TODO Scope BUG, `freshName` might occurs in `args`.
    const usedNames = [...ctxNames(ctx), ...solutionNames(solution)]
    const freshName = freshen(usedNames, name)
    const patternVar = createPatternVar(type.argType, freshName)
    return solveArgTypes(
      solution,
      // TODO Why we need to extend `ctx` here?
      CtxCons(freshName, type.argType, ctx),
      applyClosure(type.retTypeClosure, patternVar),
      args, // NOTE Do not consume arg here.
      [...insertions, InsertionPatternVar(patternVar)],
    )
  }

  if (type.kind === "Pi" && arg.kind === "ArgPlain") {
    const argInferred = Exps.inferOrUndefined(ctx, arg.exp)
    if (argInferred !== undefined) {
      solution = solveType(solution, ctx, argInferred.type, type.argType)
    }

    // TODO Do we need to call `deepWalk` here?
    const argCore = argInferred
      ? argInferred.core
      : check(ctx, arg.exp, type.argType)
    const argValue = evaluate(ctxToEnv(ctx), argCore)
    return solveArgTypes(
      solution,
      ctx,
      applyClosure(type.retTypeClosure, argValue),
      restArgs,
      [...insertions, InsertionUsedArg(argCore)],
    )
  }

  if (type.kind === "ImplicitPi" && arg.kind === "ArgImplicit") {
    const argCore = Exps.check(ctx, arg.exp, type.argType)
    const argValue = evaluate(ctxToEnv(ctx), argCore)
    return solveArgTypes(
      solution,
      ctx,
      applyClosure(type.retTypeClosure, argValue),
      restArgs,
      [...insertions, InsertionImplicitArg(argCore)],
    )
  }

  if (type.kind === "Pi" && arg.kind === "ArgImplicit") {
    throw new ElaborationError(`extra Implicit argument`)
  }

  throw new ElaborationError(
    `expect type to be Pi or ImplicitPi instead of: ${type.kind}`,
  )
}

type Insertion = InsertionPatternVar | InsertionUsedArg | InsertionImplicitArg

type InsertionPatternVar = {
  kind: "InsertionPatternVar"
  patternVar: PatternVar
}

function InsertionPatternVar(patternVar: PatternVar): InsertionPatternVar {
  return {
    kind: "InsertionPatternVar",
    patternVar,
  }
}

type InsertionUsedArg = {
  kind: "InsertionUsedArg"
  argCore: Core
}

function InsertionUsedArg(argCore: Core): InsertionUsedArg {
  return {
    kind: "InsertionUsedArg",
    argCore,
  }
}

type InsertionImplicitArg = {
  kind: "InsertionImplicitArg"
  argCore: Core
}

function InsertionImplicitArg(argCore: Core): InsertionImplicitArg {
  return {
    kind: "InsertionImplicitArg",
    argCore,
  }
}

function applyInsertion(
  solution: Solution,
  ctx: Ctx,
  insertion: Insertion,
  core: Core,
): Core {
  switch (insertion.kind) {
    case "InsertionPatternVar": {
      let argValue = lookupValueInSolution(
        solution,
        insertion.patternVar.neutral.name,
      )
      if (argValue === undefined) {
        throw new ElaborationError(
          `Unsolved patternVar: ${insertion.patternVar.neutral.name}`,
        )
      }

      const argCore = readback(
        ctx,
        deepWalk(solution, ctx, insertion.patternVar.type),
        deepWalk(solution, ctx, argValue),
      )

      return Cores.ImplicitAp(core, argCore)
    }

    case "InsertionUsedArg": {
      return Cores.Ap(core, insertion.argCore)
    }

    case "InsertionImplicitArg": {
      return Cores.ImplicitAp(core, insertion.argCore)
    }
  }
}
