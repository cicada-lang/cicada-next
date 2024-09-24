import type { Core } from "../core/index.js"
import { formatCore } from "../core/index.js"

export function unfoldFormatFn(core: Core): {
  bindings: Array<string>
  ret: string
} {
  switch (core["@kind"]) {
    case "Fn": {
      const binding = `${core.name}`
      const { bindings, ret } = unfoldFormatFn(core.ret)
      return { bindings: [binding, ...bindings], ret }
    }

    case "FnImplicit": {
      const binding = `implicit ${core.name}`
      const { bindings, ret } = unfoldFormatFn(core.ret)
      return { bindings: [binding, ...bindings], ret }
    }

    default: {
      return { bindings: [], ret: formatCore(core) }
    }
  }
}
