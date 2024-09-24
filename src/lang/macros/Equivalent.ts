import type { Exp } from "../exp/index.js"
import * as Exps from "../exp/index.js"
import { Macro } from "../macro/index.js"
import type { Span } from "../span/index.js"
import { spanUnion } from "../span/index.js"

export type EquivalentEntry = {
  via?: Exp
  to: Exp
  span: Span
}

export class Equivalent extends Macro {
  constructor(
    public type: Exp,
    public from: Exp,
    public rest: Array<EquivalentEntry>,
    public span: Span,
  ) {
    super()
  }

  expand(): Exp {
    if (this.rest.length === 0) {
      /**
         equivalent type { from }
         => the(Equal(type, from, from), refl)
      **/

      return Exps.ApUnfolded(
        Exps.Var("the"),
        [
          Exps.ArgPlain(
            Exps.ApUnfolded(
              Exps.Var("Equal"),
              [
                Exps.ArgPlain(this.type),
                Exps.ArgPlain(this.from),
                Exps.ArgPlain(this.from),
              ],
              this.span,
            ),
          ),
          Exps.ArgPlain(Exps.Var("refl")),
        ],
        this.span,
      )
    }

    if (this.rest.length === 1) {
      /**
         equivalent type { from | via = to }
         => the(Equal(type, from, to), via)
      **/

      const via = this.rest[0].via || Exps.Var("refl")
      const to = this.rest[0].to

      return Exps.ApUnfolded(
        Exps.Var("the"),
        [
          Exps.ArgPlain(
            Exps.ApUnfolded(
              Exps.Var("Equal"),
              [
                Exps.ArgPlain(this.type),
                Exps.ArgPlain(this.from),
                Exps.ArgPlain(to),
              ],
              this.span,
            ),
          ),
          Exps.ArgPlain(via),
        ],
        this.span,
      )
    }

    /**
       equivalent type { from | via1 = to1 | via2 = to2 }
       => equalCompose(implicit type, implicit from, implicit to1, implicit to2, via1, via2)
    **/

    let result = Exps.ApUnfolded(
      Exps.Var("equalCompose"),
      [
        Exps.ArgImplicit(this.type),
        Exps.ArgImplicit(this.from),
        Exps.ArgImplicit(this.rest[0].to),
        Exps.ArgImplicit(this.rest[1].to),
        Exps.ArgPlain(this.rest[0].via || Exps.Var("refl")),
        Exps.ArgPlain(this.rest[1].via || Exps.Var("refl")),
      ],
      spanUnion(this.from.span, this.rest[1].to.span),
    )

    /**
       equivalent type { from | ... | ... = lastTo | via = to }
       => equalCompose(implicit type, implicit from, implicit lastTo, implicit to, ..., via)
    **/

    let lastTo = this.rest[1].to
    for (const next of this.rest.slice(2)) {
      result = Exps.ApUnfolded(
        Exps.Var("equalCompose"),
        [
          Exps.ArgImplicit(this.type),
          Exps.ArgImplicit(this.from),
          Exps.ArgImplicit(lastTo),
          Exps.ArgImplicit(next.to),
          Exps.ArgPlain(result),
          Exps.ArgPlain(next.via || Exps.Var("refl")),
        ],
        spanUnion(lastTo.span, next.to.span),
      )
      lastTo = next.to
    }

    return result
  }
}
