import { check, checkClazz, checkType } from "../check/index.js"
import { ClosureNative, ClosureSimple, closureApply } from "../closure/index.js"
import type { Core } from "../core/index.js"
import * as Cores from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import {
  CtxCons,
  CtxFulfilled,
  ctxLookupType,
  ctxLookupValue,
  ctxToEnv,
} from "../ctx/index.js"
import * as Errors from "../errors/index.js"
import { evaluate } from "../evaluate/index.js"
import type { Exp } from "../exp/index.js"
import * as Exps from "../exp/index.js"
import {
  inferExtraProperties,
  inferFulfillingClazz,
  inferNewArgs,
  inferProperties,
} from "../infer/index.js"
import { insertDuringInfer } from "../insert/index.js"
import type { Mod } from "../mod/index.js"
import { readbackType } from "../readback/index.js"
import type { Value } from "../value/index.js"
import * as Values from "../value/index.js"

export type Inferred = {
  type: Value
  core: Core
}

export function Inferred(type: Value, core: Core): Inferred {
  return {
    type,
    core,
  }
}

export function infer(mod: Mod, ctx: Ctx, exp: Exp): Inferred {
  switch (exp["@kind"]) {
    case "Var": {
      const type = ctxLookupType(ctx, exp.name)
      if (type !== undefined) {
        return Inferred(type, Cores.Var(exp.name))
      }

      throw new Errors.ElaborationError(
        `[infer] undefined name: ${exp.name}, when inferred Var`,
        { span: exp.span },
      )
    }

    case "Pi": {
      const argTypeCore = checkType(mod, ctx, exp.argType)
      const argTypeValue = evaluate(ctxToEnv(ctx), argTypeCore)
      ctx = CtxCons(exp.name, argTypeValue, ctx)
      const retTypeCore = checkType(mod, ctx, exp.retType)
      return Inferred(
        Values.Type(),
        Cores.Pi(exp.name, argTypeCore, retTypeCore),
      )
    }

    case "PiImplicit": {
      const argTypeCore = checkType(mod, ctx, exp.argType)
      const argTypeValue = evaluate(ctxToEnv(ctx), argTypeCore)
      ctx = CtxCons(exp.name, argTypeValue, ctx)
      const retTypeCore = checkType(mod, ctx, exp.retType)
      return Inferred(
        Values.Type(),
        Cores.PiImplicit(exp.name, argTypeCore, retTypeCore),
      )
    }

    case "PiUnfolded": {
      return infer(mod, ctx, Exps.foldPi(exp.bindings, exp.retType))
    }

    case "FnAnnotated": {
      const argTypeCore = checkType(mod, ctx, exp.argType)
      const argTypeValue = evaluate(ctxToEnv(ctx), argTypeCore)
      ctx = CtxCons(exp.name, argTypeValue, ctx)
      const retInferred = infer(mod, ctx, exp.ret)
      const retTypeCore = readbackType(mod, ctx, retInferred.type)
      const retTypeClosure = ClosureSimple(ctxToEnv(ctx), exp.name, retTypeCore)
      return Inferred(
        Values.Pi(argTypeValue, retTypeClosure),
        Cores.Fn(exp.name, retInferred.core),
      )
    }

    case "FnImplicitAnnotated": {
      const argTypeCore = checkType(mod, ctx, exp.argType)
      const argTypeValue = evaluate(ctxToEnv(ctx), argTypeCore)
      ctx = CtxCons(exp.name, argTypeValue, ctx)
      const retInferred = infer(mod, ctx, exp.ret)
      const retTypeCore = readbackType(mod, ctx, retInferred.type)
      const retTypeClosure = ClosureSimple(ctxToEnv(ctx), exp.name, retTypeCore)
      return Inferred(
        Values.PiImplicit(argTypeValue, retTypeClosure),
        Cores.FnImplicit(exp.name, retInferred.core),
      )
    }

    case "FnUnfolded": {
      return infer(mod, ctx, Exps.foldFn(exp.bindings, exp.ret))
    }

    case "FnUnfoldedWithRetType": {
      return infer(
        mod,
        ctx,
        Exps.foldFnWithRetType(exp.bindings, exp.retType, exp.ret),
      )
    }

    case "Ap": {
      try {
        const { target, args } = Exps.unfoldAp(exp)
        const inferred = infer(mod, ctx, target)
        if (inferred.type["@kind"] === "PiImplicit") {
          return insertDuringInfer(mod, ctx, inferred, args)
        }
      } catch (error) {
        if (error instanceof Errors.UnificationError) {
          throw new Errors.ElaborationError(
            [
              `[infer] meet UnificationError, when inferring Ap`,
              ...error.trace,
              error.message,
            ].join("\n"),
            { span: exp.span },
          )
        }

        throw error
      }

      const inferred = infer(mod, ctx, exp.target)
      const fulfilled = inferFulfillingClazz(mod, ctx, inferred, exp.arg)
      if (fulfilled !== undefined) return fulfilled

      Values.assertTypeInCtx(mod, ctx, inferred.type, "Pi")
      const argCore = check(mod, ctx, exp.arg, inferred.type.argType)
      const argValue = evaluate(ctxToEnv(ctx), argCore)
      return Inferred(
        closureApply(inferred.type.retTypeClosure, argValue),
        Cores.Ap(inferred.core, argCore),
      )
    }

    case "ApImplicit": {
      const inferred = infer(mod, ctx, exp.target)
      Values.assertTypeInCtx(mod, ctx, inferred.type, "PiImplicit")
      const argCore = check(mod, ctx, exp.arg, inferred.type.argType)
      const argValue = evaluate(ctxToEnv(ctx), argCore)
      return Inferred(
        closureApply(inferred.type.retTypeClosure, argValue),
        Cores.ApImplicit(inferred.core, argCore),
      )
    }

    case "ApUnfolded": {
      return infer(mod, ctx, Exps.foldAp(exp.target, exp.args))
    }

    case "Sigma": {
      const carTypeCore = checkType(mod, ctx, exp.carType)
      const carTypeValue = evaluate(ctxToEnv(ctx), carTypeCore)
      ctx = CtxCons(exp.name, carTypeValue, ctx)
      const cdrTypeCore = checkType(mod, ctx, exp.cdrType)
      return Inferred(
        Values.Type(),
        Cores.Sigma(exp.name, carTypeCore, cdrTypeCore),
      )
    }

    case "SigmaUnfolded": {
      return infer(mod, ctx, Exps.foldSigma(exp.bindings, exp.cdrType))
    }

    case "Cons": {
      const carInferred = infer(mod, ctx, exp.car)
      const cdrInferred = infer(mod, ctx, exp.cdr)
      const cdrTypeClosure = ClosureNative("_", () => cdrInferred.type)
      return Inferred(
        Values.Sigma(carInferred.type, cdrTypeClosure),
        Cores.Cons(carInferred.core, cdrInferred.core),
      )
    }

    case "Quote": {
      return Inferred(Values.String(), Cores.Quote(exp.data))
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled": {
      return Inferred(Values.Type(), checkClazz(mod, ctx, exp))
    }

    case "ClazzUnfolded": {
      return infer(mod, ctx, Exps.foldClazz(exp.bindings, exp.name))
    }

    case "Objekt": {
      let clazz: Values.Clazz = Values.ClazzNull()
      const properties: Record<string, Core> = {}
      for (const [name, property] of Object.entries(exp.properties).reverse()) {
        const inferred = infer(mod, ctx, property)
        const value = evaluate(ctxToEnv(ctx), inferred.core)
        clazz = Values.ClazzFulfilled(name, inferred.type, value, clazz)
        properties[name] = inferred.core
      }

      return Inferred(clazz, Cores.Objekt(properties))
    }

    case "ObjektUnfolded": {
      return infer(
        mod,
        ctx,
        Exps.Objekt(Exps.prepareProperties(mod, ctx, exp.properties)),
      )
    }

    case "Dot": {
      const inferred = infer(mod, ctx, exp.target)
      const targetValue = evaluate(ctxToEnv(ctx), inferred.core)
      Values.assertClazzInCtx(mod, ctx, inferred.type)
      const propertyType = Values.clazzLookupPropertyType(
        targetValue,
        inferred.type,
        exp.name,
      )
      if (propertyType === undefined) {
        throw new Errors.ElaborationError(
          `[infer] undefined property: ${name}, when inferring Dot`,
          { span: exp.span },
        )
      }

      return Inferred(propertyType, Cores.Dot(inferred.core, exp.name))
    }

    case "NewUnfolded": {
      return infer(
        mod,
        ctx,
        Exps.New(exp.name, Exps.prepareProperties(mod, ctx, exp.properties)),
      )
    }

    case "New": {
      const clazz = ctxLookupValue(ctx, exp.name)
      if (clazz === undefined) {
        throw new Errors.ElaborationError(
          `[infer] undefined class: ${exp.name}, when inferring New`,
          { span: exp.span },
        )
      }

      Values.assertClazzInCtx(mod, ctx, clazz)
      const inferred = inferProperties(mod, ctx, exp.properties, clazz)
      const names = Object.keys(inferred.properties)
      const extra = inferExtraProperties(mod, ctx, exp.properties, names)

      /**
         We add the inferred `extra.clazz` to the return value,
         because the body of the `New` might have extra properties,
         thus more specific than the given type.
      **/

      return Inferred(
        Values.clazzFulfilledPrepend(inferred.clazz, extra.clazz),
        Cores.Objekt({ ...inferred.properties, ...extra.properties }),
      )
    }

    case "NewAp": {
      const clazz = ctxLookupValue(ctx, exp.name)
      if (clazz === undefined) {
        throw new Errors.ElaborationError(
          `[infer] undefined class: ${exp.name}, when inferring NewAp`,
          { span: exp.span },
        )
      }

      Values.assertClazzInCtx(mod, ctx, clazz)
      const properties = inferNewArgs(mod, ctx, exp.args, clazz)
      return Inferred(clazz, Cores.Objekt(properties))
    }

    case "SequenceUnfolded": {
      return infer(mod, ctx, Exps.foldSequence(exp.bindings, exp.ret))
    }

    case "SequenceLet": {
      const inferred = infer(mod, ctx, exp.exp)
      const value = evaluate(ctxToEnv(ctx), inferred.core)
      ctx = CtxFulfilled(exp.name, inferred.type, value, ctx)
      const retInferred = infer(mod, ctx, exp.ret)
      return Inferred(
        retInferred.type,
        Cores.Ap(Cores.Fn(exp.name, retInferred.core), inferred.core),
      )
    }

    case "SequenceLetThe": {
      const typeCore = checkType(mod, ctx, exp.type)
      const type = evaluate(ctxToEnv(ctx), typeCore)
      const core = check(mod, ctx, exp.exp, type)
      const value = evaluate(ctxToEnv(ctx), core)
      ctx = CtxFulfilled(exp.name, type, value, ctx)
      const retInferred = infer(mod, ctx, exp.ret)
      return Inferred(
        retInferred.type,
        Cores.Ap(Cores.Fn(exp.name, retInferred.core), core),
      )
    }

    case "SequenceCheck": {
      const typeCore = checkType(mod, ctx, exp.type)
      const type = evaluate(ctxToEnv(ctx), typeCore)
      check(mod, ctx, exp.exp, type)
      return infer(mod, ctx, exp.ret)
    }

    case "MacroEmbedded": {
      return infer(mod, ctx, exp.macro.expand())
    }

    default: {
      throw new Errors.ElaborationError(
        `[infer] is not implemented for: ${exp["@kind"]}`,
        { span: exp.span },
      )
    }
  }
}
