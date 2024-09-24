import { indent } from "../../utils/indent.js"
import type { Ctx } from "../ctx/index.js"
import * as Errors from "../errors/index.js"
import type { Mod } from "../mod/index.js"
import type { Neutral } from "../neutral/index.js"
import { unify, unifyPatternVar, unifyType } from "../unify/index.js"
import type { Value } from "../value/index.js"
import * as Values from "../value/index.js"
import { TypedValue, formatNeutral } from "../value/index.js"

function unifyTypedValue(
  mod: Mod,
  ctx: Ctx,
  left: TypedValue,
  right: TypedValue,
): void {
  unifyType(mod, ctx, left.type, right.type)
  unify(mod, ctx, left.type, left.value, right.value)
}

export function unifyNeutral(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  left: Neutral,
  right: Neutral,
): void {
  const success = unifyPatternVar(
    mod,
    ctx,
    type,
    Values.TypedNeutral(type, left),
    Values.TypedNeutral(type, right),
  )
  if (success) return

  if (left["@kind"] === "Var" && right["@kind"] === "Var") {
    if (left.name !== right.name) {
      throw new Errors.UnificationError(
        [
          `[unifyNeutral] expect variable names to be equal`,
          `  left: ${left.name}`,
          `  right: ${right.name}`,
        ].join("\n"),
      )
    }

    return
  }

  if (left["@kind"] === "Ap" && right["@kind"] === "Ap") {
    // unifyType(mod, ctx, left.targetType, right.targetType)
    unifyNeutral(mod, ctx, left.targetType, left.target, right.target)
    unifyTypedValue(mod, ctx, left.arg, right.arg)
    return
  }

  if (left["@kind"] === "ApImplicit" && right["@kind"] === "ApImplicit") {
    // unifyType(mod, ctx, left.targetType, right.targetType)
    unifyNeutral(mod, ctx, left.targetType, left.target, right.target)
    unifyTypedValue(mod, ctx, left.arg, right.arg)
    return
  }

  if (left["@kind"] === "Car" && right["@kind"] === "Car") {
    // unifyType(mod, ctx, left.targetType, right.targetType)
    unifyNeutral(mod, ctx, left.targetType, left.target, right.target)
    return
  }

  if (left["@kind"] === "Cdr" && right["@kind"] === "Cdr") {
    // unifyType(mod, ctx, left.targetType, right.targetType)
    unifyNeutral(mod, ctx, left.targetType, left.target, right.target)
    return
  }

  if (left["@kind"] === "Dot" && right["@kind"] === "Dot") {
    if (left.name !== right.name) {
      throw new Errors.UnificationError(
        [
          `[unifyNeutral] expect dot neutrals to have the same property name`,
          `  left: ${left.name}`,
          `  right: ${right.name}`,
        ].join("\n"),
      )
    }

    // unifyType(mod, ctx, left.targetType, right.targetType)
    unifyNeutral(mod, ctx, left.targetType, left.target, right.target)
    return
  }

  if (left["@kind"] === "Replace" && right["@kind"] === "Replace") {
    // unifyType(mod, ctx, left.targetType, right.targetType)
    unifyNeutral(mod, ctx, left.targetType, left.target, right.target)
    unifyTypedValue(mod, ctx, left.motive, right.motive)
    unifyTypedValue(mod, ctx, left.base, right.base)
    return
  }

  throw new Errors.UnificationError(
    [
      `[unifyNeutral] is not implemented for the pair of neutrals`,
      indent(`left: ${formatNeutral(mod, ctx, left)}`),
      indent(`right: ${formatNeutral(mod, ctx, right)}`),
    ].join("\n"),
  )
}
