import { Core } from "./Core"
import { Ctx } from "./Ctx"
import { Exp } from "./Exp"
import * as Globals from "./globals"
import { inclusion } from "./inclusion"
import { infer } from "./infer"
import { Value } from "./Value"

export function check(ctx: Ctx, exp: Exp, type: Value): Core {
  switch (exp.kind) {
    case "Var":
    case "Pi":
    case "Ap":
    case "Car":
    case "Cdr": {
      return checkByInfer(ctx, exp, type)
    }

    default:
      throw new Error(`check is not implemented for exp: ${exp.kind}`)
  }
}

export function checkByInfer(ctx: Ctx, exp: Exp, type: Value): Core {
  const inferred = infer(ctx, exp)
  inclusion(ctx, inferred.type, type)
  return inferred.core
}

export function checkType(ctx: Ctx, type: Exp): Core {
  return check(ctx, type, Globals.Type)
}
