import * as Cores from "../core"
import {
  AlphaCtx,
  alphaEquivalentClazz,
  alphaEquivalentProperties,
  Core,
  formatCore,
} from "../core"
import { ElaborationError } from "../errors"

export function alphaEquivalent(ctx: AlphaCtx, left: Core, right: Core): void {
  if (left.kind === "Var" && right.kind === "Var") {
    ctx.assertEqualNames(left.name, right.name)
    return
  }

  if (
    (left.kind === "Pi" && right.kind === "Pi") ||
    (left.kind === "PiImplicit" && right.kind === "PiImplicit")
  ) {
    alphaEquivalent(ctx, left.argType, right.argType)
    ctx = ctx.cons(left.name, right.name)
    alphaEquivalent(ctx, left.retType, right.retType)
    return
  }

  if (
    (left.kind === "Fn" && right.kind === "Fn") ||
    (left.kind === "FnImplicit" && right.kind === "FnImplicit")
  ) {
    ctx = ctx.cons(left.name, right.name)
    alphaEquivalent(ctx, left.ret, right.ret)
    return
  }

  if (
    (left.kind === "Ap" && right.kind === "Ap") ||
    (left.kind === "ApImplicit" && right.kind === "ApImplicit")
  ) {
    alphaEquivalent(ctx, left.target, right.target)
    alphaEquivalent(ctx, left.arg, right.arg)
    return
  }

  if (left.kind === "Sigma" && right.kind === "Sigma") {
    alphaEquivalent(ctx, left.carType, right.carType)
    ctx = ctx.cons(left.name, right.name)
    alphaEquivalent(ctx, left.cdrType, right.cdrType)
    return
  }

  if (left.kind === "Cons" && right.kind === "Cons") {
    alphaEquivalent(ctx, left.car, right.car)
    alphaEquivalent(ctx, left.cdr, right.cdr)
    return
  }

  if (left.kind === "Car" && right.kind === "Car") {
    alphaEquivalent(ctx, left.target, right.target)
    return
  }

  if (left.kind === "Cdr" && right.kind === "Cdr") {
    alphaEquivalent(ctx, left.target, right.target)
    return
  }

  if (left.kind === "Quote" && right.kind === "Quote") {
    if (left.data !== right.data) {
      throw new ElaborationError(
        `alphaEquivalent expect left data: ${left.data} to be equal to right data: ${right.data}`,
      )
    }

    return
  }

  function isClazz(core: Core): core is Cores.Clazz {
    return ["ClazzNull", "ClazzCons", "ClazzFulfilled"].includes(core.kind)
  }

  if (isClazz(left) && isClazz(right)) {
    alphaEquivalentClazz(ctx, left, right)
    return
  }

  if (left.kind === "Objekt" && right.kind === "Objekt") {
    alphaEquivalentProperties(ctx, left.properties, right.properties)
    return
  }

  if (left.kind === "Dot" && right.kind === "Dot") {
    if (left.name !== right.name) {
      throw new ElaborationError(
        `alphaEquivalent expect left name: ${left.name} to be equal to right name: ${right.name}`,
      )
    }

    alphaEquivalent(ctx, left.target, right.target)
    return
  }

  throw new ElaborationError(
    `alphaEquivalent is not implemented for left: ${formatCore(left)}, and right: ${formatCore(
      right,
    )}`,
  )
}
