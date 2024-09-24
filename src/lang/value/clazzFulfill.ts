import * as Errors from "../errors/index.js"
import type { Value } from "../value/index.js"
import * as Values from "../value/index.js"

export function clazzFulfill(clazz: Values.Clazz, arg: Value): Values.Clazz {
  switch (clazz["@kind"]) {
    case "ClazzNull": {
      throw new Errors.EvaluationError("cannot apply argument to ClazzNull")
    }

    case "ClazzCons": {
      return Values.ClazzFulfilled(
        clazz.propertyName,
        clazz.propertyType,
        arg,
        Values.clazzClosureApply(clazz.restClosure, arg),
        clazz.name,
      )
    }

    case "ClazzFulfilled": {
      return Values.ClazzFulfilled(
        clazz.propertyName,
        clazz.propertyType,
        clazz.property,
        clazzFulfill(clazz.rest, arg),
        clazz.name,
      )
    }
  }
}
