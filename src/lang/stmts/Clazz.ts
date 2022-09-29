import { evaluate } from "../core"
import * as Exps from "../exp"
import { infer } from "../exp"
import { Mod } from "../mod"
import { Span } from "../span"
import { Stmt } from "../stmt"

export class Clazz extends Stmt {
  constructor(public name: string, public clazz: Exps.ClazzUnfolded, public span?: Span) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const inferred = infer(mod, mod.ctx, this.clazz)
    const value = evaluate(mod.env, inferred.core)
    mod.define(this.name, inferred.type, value)
  }

  undo(mod: Mod): void {
    mod.delete(this.name)
  }
}
