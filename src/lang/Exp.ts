import { Span } from "./Span"

type ExpMeta = { span?: Span }

/**

   # Exp

   `Exp` is very close to the concrete syntax,
   this is unlike `Core`, which is elaborated
   and aiming to have a small "core".

   For example, function with multiple arguments
   is implemented in `Exp` and elaborated to `Core`
   which does not support multiple arguments.

**/

export type Exp =
  | Var
  | Pi
  | MultiPi
  | Ap
  | Fn
  | MultiFn
  | Sigma
  | Cons
  | Car
  | Cdr
  | Clazz
  | Object
  | Dot

export type Var = {
  family: "Exp"
  kind: "Var"
  name: string
} & ExpMeta

export function Var(name: string, span?: Span): Var {
  return {
    family: "Exp",
    kind: "Var",
    name,
    span,
  }
}

export type Pi = {
  family: "Exp"
  kind: "Pi"
  name: string
  argType: Exp
  retType: Exp
} & ExpMeta

export function Pi(name: string, argType: Exp, retType: Exp, span?: Span): Pi {
  return {
    family: "Exp",
    kind: "Pi",
    name,
    argType,
    retType,
    span,
  }
}

export type MultiPi = {
  family: "Exp"
  kind: "MultiPi"
  bindings: Array<PiBinding>
  retType: Exp
} & ExpMeta

export function MultiPi(
  bindings: Array<PiBinding>,
  retType: Exp,
  span?: Span
): MultiPi {
  return {
    family: "Exp",
    kind: "MultiPi",
    bindings,
    retType,
    span,
  }
}

export type PiBinding = PiBindingNameless | PiBindingNamed

export type PiBindingNameless = {
  kind: "PiBindingNameless"
  type: Exp
}

export function PiBindingNameless(type: Exp): PiBindingNameless {
  return {
    kind: "PiBindingNameless",
    type,
  }
}

export type PiBindingNamed = {
  kind: "PiBindingNamed"
  name: string
  type: Exp
}

export function PiBindingNamed(name: string, type: Exp): PiBindingNamed {
  return {
    kind: "PiBindingNamed",
    name,
    type,
  }
}

export type Fn = {
  family: "Exp"
  kind: "Fn"
  name: string
  ret: Exp
} & ExpMeta

export function Fn(name: string, ret: Exp, span?: Span): Fn {
  return {
    family: "Exp",
    kind: "Fn",
    name,
    ret,
    span,
  }
}

export type MultiFn = {
  family: "Exp"
  kind: "MultiFn"
  bindings: Array<FnBinding>
  ret: Exp
} & ExpMeta

export function MultiFn(
  bindings: Array<FnBinding>,
  ret: Exp,
  span?: Span
): MultiFn {
  return {
    family: "Exp",
    kind: "MultiFn",
    bindings,
    ret,
    span,
  }
}

export type FnBinding = FnBindingName | FnBindingAnnotated

export type FnBindingName = {
  kind: "FnBindingName"
  name: string
}

export function FnBindingName(name: string): FnBindingName {
  return {
    kind: "FnBindingName",
    name,
  }
}

export type FnBindingAnnotated = {
  kind: "FnBindingAnnotated"
  name: string
  type: Exp
}

export function FnBindingAnnotated(
  name: string,
  type: Exp
): FnBindingAnnotated {
  return {
    kind: "FnBindingAnnotated",
    name,
    type,
  }
}

export type Arg = ArgPlain | ArgImplicit | ArgVague

export type ArgPlain = {
  kind: "ArgPlain"
  exp: Exp
}

export function ArgPlain(exp: Exp): ArgPlain {
  return {
    kind: "ArgPlain",
    exp,
  }
}

export type ArgImplicit = {
  kind: "ArgImplicit"
  exp: Exp
}

export function ArgImplicit(exp: Exp): ArgImplicit {
  return {
    kind: "ArgImplicit",
    exp,
  }
}

export type ArgVague = {
  kind: "ArgVague"
  exp: Exp
}

export function ArgVague(exp: Exp): ArgVague {
  return {
    kind: "ArgVague",
    exp,
  }
}

export type Ap = {
  family: "Exp"
  kind: "Ap"
  target: Exp
  args: Array<Arg>
} & ExpMeta

export function Ap(target: Exp, args: Array<Arg>, span?: Span): Ap {
  return {
    family: "Exp",
    kind: "Ap",
    target,
    args,
    span,
  }
}

export type Sigma = {
  family: "Exp"
  kind: "Sigma"
  name: string
  carType: Exp
  cdrType: Exp
} & ExpMeta

export function Sigma(
  name: string,
  carType: Exp,
  cdrType: Exp,
  span?: Span
): Sigma {
  return {
    family: "Exp",
    kind: "Sigma",
    name,
    carType,
    cdrType,
    span,
  }
}

export type Cons = {
  family: "Exp"
  kind: "Cons"
  car: Exp
  cdr: Exp
} & ExpMeta

export function Cons(car: Exp, cdr: Exp, span?: Span): Cons {
  return {
    family: "Exp",
    kind: "Cons",
    car,
    cdr,
    span,
  }
}

export type Car = {
  family: "Exp"
  kind: "Car"
  target: Exp
} & ExpMeta

export function Car(target: Exp, span?: Span): Car {
  return {
    family: "Exp",
    kind: "Car",
    target,
    span,
  }
}

export type Cdr = {
  family: "Exp"
  kind: "Cdr"
  target: Exp
} & ExpMeta

export function Cdr(target: Exp, span?: Span): Cdr {
  return {
    family: "Exp",
    kind: "Cdr",
    target,
    span,
  }
}

/**

   ## name v.s. realName in Clazz

   We can not only use `name` we also need `realName`,
   because of `subst` might rename bound variables.

**/

export type Clazz = ClazzCons | ClazzFulfilled | ClazzNull

export type ClazzCons = {
  family: "Exp"
  kind: "ClazzCons"
  name: string
  realName: string
  propertyType: Exp
  rest: Clazz
} & ExpMeta

export function ClazzCons(
  name: string,
  realName: string,
  propertyType: Exp,
  rest: Clazz,
  span?: Span
): ClazzCons {
  return {
    family: "Exp",
    kind: "ClazzCons",
    name,
    realName,
    propertyType,
    rest,
    span,
  }
}

export type ClazzFulfilled = {
  family: "Exp"
  kind: "ClazzFulfilled"
  name: string
  realName: string
  property: Exp
  propertyType: Exp
  rest: Clazz
} & ExpMeta

export function ClazzFulfilled(
  name: string,
  realName: string,
  property: Exp,
  propertyType: Exp,
  rest: Clazz,
  span?: Span
): ClazzFulfilled {
  return {
    family: "Exp",
    kind: "ClazzFulfilled",
    name,
    realName,
    property,
    propertyType,
    rest,
    span,
  }
}

export type ClazzNull = {
  family: "Exp"
  kind: "ClazzNull"
} & ExpMeta

export function ClazzNull(span?: Span): ClazzNull {
  return {
    family: "Exp",
    kind: "ClazzNull",
    span,
  }
}

export type Object = {
  family: "Exp"
  kind: "Object"
  properties: Record<string, Exp>
} & ExpMeta

export function Object(properties: Record<string, Exp>, span?: Span): Object {
  return {
    family: "Exp",
    kind: "Object",
    properties,
    span,
  }
}

export type Dot = {
  family: "Exp"
  kind: "Dot"
  target: Exp
  name: string
} & ExpMeta

export function Dot(target: Exp, name: string, span?: Span): Dot {
  return {
    family: "Exp",
    kind: "Dot",
    target,
    name,
    span,
  }
}
