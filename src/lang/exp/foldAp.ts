import type { Exp } from "../exp/index.js"
import * as Exps from "../exp/index.js"
import { spanUnion } from "../span/index.js"

export function foldAp(target: Exp, args: Array<Exps.Arg>): Exp {
  if (args.length === 0) return target

  const [arg, ...restArgs] = args

  switch (arg["@kind"]) {
    case "ArgPlain": {
      return foldAp(
        Exps.Ap(target, arg.exp, spanUnion(target.span, arg.exp.span)),
        restArgs,
      )
    }

    case "ArgImplicit": {
      return foldAp(
        Exps.ApImplicit(target, arg.exp, spanUnion(target.span, arg.exp.span)),
        restArgs,
      )
    }
  }
}
