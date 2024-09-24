import type { Core } from "../core/index.js"
import * as Cores from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import type { Mod } from "../mod/index.js"
import type { Neutral } from "../neutral/index.js"
import { readback } from "../readback/index.js"

export function readbackNeutral(mod: Mod, ctx: Ctx, neutral: Neutral): Core {
  switch (neutral["@kind"]) {
    case "Var": {
      return Cores.Var(neutral.name)
    }

    case "PatternVar": {
      return Cores.PatternVar(neutral.name)
    }

    case "Ap": {
      return Cores.Ap(
        readbackNeutral(mod, ctx, neutral.target),
        readback(mod, ctx, neutral.arg.type, neutral.arg.value),
      )
    }

    case "ApImplicit": {
      return Cores.ApImplicit(
        readbackNeutral(mod, ctx, neutral.target),
        readback(mod, ctx, neutral.arg.type, neutral.arg.value),
      )
    }

    case "Car": {
      return Cores.Car(readbackNeutral(mod, ctx, neutral.target))
    }

    case "Cdr": {
      return Cores.Cdr(readbackNeutral(mod, ctx, neutral.target))
    }

    case "Dot": {
      return Cores.Dot(readbackNeutral(mod, ctx, neutral.target), neutral.name)
    }

    case "Replace": {
      const target = readbackNeutral(mod, ctx, neutral.target)
      const motive = readback(
        mod,
        ctx,
        neutral.motive.type,
        neutral.motive.value,
      )
      const base = readback(mod, ctx, neutral.base.type, neutral.base.value)
      return Cores.Replace(target, motive, base)
    }
  }
}
