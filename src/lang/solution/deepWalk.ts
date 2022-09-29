import { applyClosure, Closure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { deepWalkType } from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { readback, readbackType, Value } from "../value"

/**

   # `deepWalk` need to do partial evaluation on `Fn`

   `deepWalk` takes `type` as argument,
   NOT because of it is doing eta-expansion,
   but because of it need to do partial evaluation of `Fn`,
   thus need `argType` to construct a `TypedNeutral`.

   another solution is to let `Values.Fn` and `Cores.Fn` always have `argType`.

**/

export function deepWalk(mod: Mod, ctx: Ctx, type: Value, value: Value): Value {
  value = mod.solution.walk(value)

  switch (value.kind) {
    case "TypedNeutral": {
      // TODO Maybe blocked can be eliminated now!
      return value
    }

    case "Type": {
      return value
    }

    case "Pi": {
      const name = value.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const argType = deepWalkType(mod, ctx, value.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(freshName))
      mod.solution.bind(freshName, typedNeutral)
      let retType = applyClosure(value.retTypeClosure, typedNeutral)
      retType = deepWalkType(mod, ctx, retType)
      ctx = CtxCons(freshName, argType, ctx)
      const retTypeCore = readbackType(mod, ctx, retType)
      const env = mod.ctxToEnv(ctx)
      return Values.Pi(argType, Closure(env, freshName, retTypeCore))
    }

    case "PiImplicit": {
      const name = value.retTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const argType = deepWalkType(mod, ctx, value.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(freshName))
      mod.solution.bind(freshName, typedNeutral)
      let retType = applyClosure(value.retTypeClosure, typedNeutral)
      retType = deepWalkType(mod, ctx, retType)
      ctx = CtxCons(freshName, argType, ctx)
      const retTypeCore = readbackType(mod, ctx, retType)
      const env = mod.ctxToEnv(ctx)
      return Values.PiImplicit(argType, Closure(env, freshName, retTypeCore))
    }

    case "Fn": {
      const name = value.retClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      Values.assertTypeInCtx(ctx, type, Values.Pi)
      const argType = deepWalkType(mod, ctx, type.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(freshName))
      mod.solution.bind(freshName, typedNeutral)
      let ret = applyClosure(value.retClosure, typedNeutral)
      const retType = applyClosure(type.retTypeClosure, typedNeutral)
      ret = deepWalk(mod, ctx, retType, ret)
      ctx = CtxCons(freshName, argType, ctx)
      const retCore = readback(mod, ctx, retType, ret)
      const env = mod.ctxToEnv(ctx)
      return Values.Fn(Closure(env, freshName, retCore))
    }

    case "FnImplicit": {
      const name = value.retClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      Values.assertTypeInCtx(ctx, type, Values.PiImplicit)
      const argType = deepWalkType(mod, ctx, type.argType)
      const typedNeutral = Values.TypedNeutral(argType, Neutrals.Var(freshName))
      mod.solution.bind(freshName, typedNeutral)
      let ret = applyClosure(value.retClosure, typedNeutral)
      let retType = applyClosure(type.retTypeClosure, typedNeutral)
      retType = deepWalkType(mod, ctx, retType)
      ret = deepWalk(mod, ctx, retType, ret)
      ctx = CtxCons(freshName, argType, ctx)
      const retCore = readback(mod, ctx, retType, ret)
      const env = mod.ctxToEnv(ctx)
      return Values.FnImplicit(Closure(env, freshName, retCore))
    }

    case "Sigma": {
      const name = value.cdrTypeClosure.name
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const carType = deepWalkType(mod, ctx, value.carType)
      const typedNeutral = Values.TypedNeutral(carType, Neutrals.Var(freshName))
      mod.solution.bind(freshName, typedNeutral)
      let cdrType = applyClosure(value.cdrTypeClosure, typedNeutral)
      cdrType = deepWalkType(mod, ctx, cdrType)
      ctx = CtxCons(freshName, carType, ctx)
      const cdrTypeCore = readbackType(mod, ctx, cdrType)
      const env = mod.ctxToEnv(ctx)
      return Values.Sigma(carType, Closure(env, freshName, cdrTypeCore))
    }

    case "Cons": {
      type = deepWalkType(mod, ctx, type)
      Values.assertValue(type, Values.Sigma)

      return Values.Cons(
        deepWalk(mod, ctx, type.carType, value.car),
        deepWalk(
          mod,
          ctx,
          applyClosure(type.cdrTypeClosure, value.car),
          value.cdr,
        ),
      )
    }

    case "String": {
      return value
    }

    case "Quote": {
      return value
    }

    case "Trivial": {
      return value
    }

    case "Sole": {
      return value
    }

    case "ClazzNull": {
      return value
    }

    case "ClazzCons": {
      // TODO
      return value
    }

    case "ClazzFulfilled": {
      // TODO
      return value
    }

    case "Objekt": {
      return Values.Objekt(
        Object.fromEntries(
          Object.entries(value.properties).map(([name, property]) => [
            name,
            deepWalk(mod, ctx, type, property),
          ]),
        ),
      )
    }
  }
}
