import type { Core } from "../core/index.js"
import { formatCore } from "../core/index.js"

export function unfoldFormatSigma(core: Core): {
  bindings: Array<string>
  cdrType: string
} {
  switch (core["@kind"]) {
    case "Sigma": {
      const carType = formatCore(core.carType)
      const { bindings, cdrType } = unfoldFormatSigma(core.cdrType)
      return { bindings: [carType, ...bindings], cdrType }
    }

    default: {
      return { bindings: [], cdrType: formatCore(core) }
    }
  }
}
