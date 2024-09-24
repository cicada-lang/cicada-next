import type { Core } from "../core/index.js"
import * as Cores from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import type { Mod } from "../mod/index.js"
import { readbackType } from "../readback/index.js"
import type { Value } from "../value/index.js"

/**

   # readbackByType

   The eta-expansion can be implemented here.

   But due to the use of `readback` during elaboration,
   performing eta-expansion is not a desired role of `readback`.

**/

export function readbackByType(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  value: Value,
): Core | undefined {
  switch (type["@kind"]) {
    case "Type": {
      return readbackType(mod, ctx, value)
    }

    case "Trivial": {
      /**
         The η-rule for `Trivial` states that,
         all of its inhabitants are the same as `sole`.
         This is implemented by reading all the
         values of type `Trivial` back to `sole`,
         even the value is `TypedNeutral`.
      **/

      return Cores.Var("sole")
    }

    // case "Pi": {
    //   /**
    //      Everything with a `Pi` type is immediately
    //      `readback` as having a `Fn` on top.
    //      This implements the eta-rule for `Fn`.
    //   **/

    //   const name = type.retTypeClosure.name
    //   const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
    //   const freshName = freshen(usedNames, name)
    //   const v = Values.TypedNeutral(type.argType, Neutrals.Var(freshName))
    //   const retType = closureApply(type.retTypeClosure, v)
    //   ctx = CtxCons(freshName, type.argType, ctx)
    //   const ret = Actions.doAp(value, v)
    //   return Cores.Fn(freshName, readback(mod, ctx, retType, ret))
    // }

    // case "PiImplicit": {
    //   const name = type.retTypeClosure.name
    //   const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
    //   const freshName = freshen(usedNames, name)
    //   const v = Values.TypedNeutral(type.argType, Neutrals.Var(freshName))
    //   const retType = closureApply(type.retTypeClosure, v)
    //   ctx = CtxCons(freshName, type.argType, ctx)
    //   const ret = Actions.doApImplicit(value, v)
    //   return Cores.FnImplicit(freshName, readback(mod, ctx, retType, ret))
    // }

    // case "Sigma": {
    //   /**
    //      `Sigma`s are also η-expanded.
    //      Every value with a `Sigma` type,
    //      whether it is neutral or not,
    //      will be `readback` with a `cons` at the top.
    //   **/

    //   const car = Actions.doCar(value)
    //   const cdr = Actions.doCdr(value)
    //   const cdrType = closureApply(type.cdrTypeClosure, car)

    //   return Cores.Cons(
    //     readback(mod, ctx, type.carType, car),
    //     readback(mod, ctx, cdrType, cdr),
    //   )
    // }

    // case "ClazzNull":
    // case "ClazzCons":
    // case "ClazzFulfilled": {
    //   return Cores.Objekt(readbackProperties(mod, ctx, type, value))
    // }

    default: {
      return undefined
    }
  }
}
