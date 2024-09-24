import type { Macro } from "../macro/index.js"
import type { Span } from "../span/index.js"

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
  | PiImplicit
  | PiUnfolded
  | Ap
  | ApImplicit
  | ApUnfolded
  | Fn
  | FnAnnotated
  | FnImplicit
  | FnImplicitAnnotated
  | FnUnfolded
  | FnUnfoldedWithRetType
  | Sigma
  | SigmaUnfolded
  | Cons
  | Quote
  | Clazz
  | ClazzUnfolded
  | Objekt
  | ObjektUnfolded
  | New
  | NewUnfolded
  | NewAp
  | Dot
  | Sequence
  | SequenceUnfolded
  | MacroEmbedded

export type Var = {
  "@type": "Exp"
  "@kind": "Var"
  name: string
} & ExpMeta

export function Var(name: string, span?: Span): Var {
  return {
    "@type": "Exp",
    "@kind": "Var",
    name,
    span,
  }
}

export type Pi = {
  "@type": "Exp"
  "@kind": "Pi"
  name: string
  argType: Exp
  retType: Exp
} & ExpMeta

export function Pi(name: string, argType: Exp, retType: Exp, span?: Span): Pi {
  return {
    "@type": "Exp",
    "@kind": "Pi",
    name,
    argType,
    retType,
    span,
  }
}

export type PiImplicit = {
  "@type": "Exp"
  "@kind": "PiImplicit"
  name: string
  argType: Exp
  retType: Exp
} & ExpMeta

export function PiImplicit(
  name: string,
  argType: Exp,
  retType: Exp,
  span?: Span,
): PiImplicit {
  return {
    "@type": "Exp",
    "@kind": "PiImplicit",
    name,
    argType,
    retType,
    span,
  }
}

export type PiUnfolded = {
  "@type": "Exp"
  "@kind": "PiUnfolded"
  bindings: Array<PiBinding>
  retType: Exp
} & ExpMeta

export function PiUnfolded(
  bindings: Array<PiBinding>,
  retType: Exp,
  span?: Span,
): PiUnfolded {
  return {
    "@type": "Exp",
    "@kind": "PiUnfolded",
    bindings,
    retType,
    span,
  }
}

export type PiBinding = PiBindingNameless | PiBindingNamed | PiBindingImplicit

export type PiBindingNameless = {
  "@kind": "PiBindingNameless"
  type: Exp
} & ExpMeta

export function PiBindingNameless(type: Exp, span?: Span): PiBindingNameless {
  return {
    "@kind": "PiBindingNameless",
    type,
    span,
  }
}

export type PiBindingNamed = {
  "@kind": "PiBindingNamed"
  name: string
  type: Exp
} & ExpMeta

export function PiBindingNamed(
  name: string,
  type: Exp,
  span?: Span,
): PiBindingNamed {
  return {
    "@kind": "PiBindingNamed",
    name,
    type,
    span,
  }
}

export type PiBindingImplicit = {
  "@kind": "PiBindingImplicit"
  name: string
  type: Exp
} & ExpMeta

export function PiBindingImplicit(
  name: string,
  type: Exp,
  span?: Span,
): PiBindingImplicit {
  return {
    "@kind": "PiBindingImplicit",
    name,
    type,
    span,
  }
}

export type Fn = {
  "@type": "Exp"
  "@kind": "Fn"
  name: string
  ret: Exp
} & ExpMeta

export function Fn(name: string, ret: Exp, span?: Span): Fn {
  return {
    "@type": "Exp",
    "@kind": "Fn",
    name,
    ret,
    span,
  }
}

export type FnAnnotated = {
  "@type": "Exp"
  "@kind": "FnAnnotated"
  name: string
  argType: Exp
  ret: Exp
} & ExpMeta

export function FnAnnotated(
  name: string,
  argType: Exp,
  ret: Exp,
  span?: Span,
): FnAnnotated {
  return {
    "@type": "Exp",
    "@kind": "FnAnnotated",
    name,
    argType,
    ret,
    span,
  }
}

export type FnImplicit = {
  "@type": "Exp"
  "@kind": "FnImplicit"
  name: string
  ret: Exp
} & ExpMeta

export function FnImplicit(name: string, ret: Exp, span?: Span): FnImplicit {
  return {
    "@type": "Exp",
    "@kind": "FnImplicit",
    name,
    ret,
    span,
  }
}

export type FnImplicitAnnotated = {
  "@type": "Exp"
  "@kind": "FnImplicitAnnotated"
  name: string
  argType: Exp
  ret: Exp
} & ExpMeta

export function FnImplicitAnnotated(
  name: string,
  argType: Exp,
  ret: Exp,
  span?: Span,
): FnImplicitAnnotated {
  return {
    "@type": "Exp",
    "@kind": "FnImplicitAnnotated",
    name,
    argType,
    ret,
    span,
  }
}

export type FnUnfolded = {
  "@type": "Exp"
  "@kind": "FnUnfolded"
  bindings: Array<FnBinding>
  ret: Exp
} & ExpMeta

export function FnUnfolded(
  bindings: Array<FnBinding>,
  ret: Exp,
  span?: Span,
): FnUnfolded {
  return {
    "@type": "Exp",
    "@kind": "FnUnfolded",
    bindings,
    ret,
    span,
  }
}

export type FnUnfoldedWithRetType = {
  "@type": "Exp"
  "@kind": "FnUnfoldedWithRetType"
  bindings: Array<FnBinding>
  retType: Exp
  ret: Exp
} & ExpMeta

export function FnUnfoldedWithRetType(
  bindings: Array<FnBinding>,
  retType: Exp,
  ret: Exp,
  span?: Span,
): FnUnfoldedWithRetType {
  return {
    "@type": "Exp",
    "@kind": "FnUnfoldedWithRetType",
    bindings,
    retType,
    ret,
    span,
  }
}

export type FnBinding =
  | FnBindingName
  | FnBindingAnnotated
  | FnBindingImplicit
  | FnBindingAnnotatedImplicit

export type FnBindingName = {
  "@kind": "FnBindingName"
  name: string
} & ExpMeta

export function FnBindingName(name: string, span?: Span): FnBindingName {
  return {
    "@kind": "FnBindingName",
    name,
    span,
  }
}

export type FnBindingAnnotated = {
  "@kind": "FnBindingAnnotated"
  name: string
  type: Exp
} & ExpMeta

export function FnBindingAnnotated(
  name: string,
  type: Exp,
  span?: Span,
): FnBindingAnnotated {
  return {
    "@kind": "FnBindingAnnotated",
    name,
    type,
    span,
  }
}

export type FnBindingImplicit = {
  "@kind": "FnBindingImplicit"
  name: string
} & ExpMeta

export function FnBindingImplicit(
  name: string,
  span?: Span,
): FnBindingImplicit {
  return {
    "@kind": "FnBindingImplicit",
    name,
    span,
  }
}

export type FnBindingAnnotatedImplicit = {
  "@kind": "FnBindingAnnotatedImplicit"
  name: string
  type: Exp
} & ExpMeta

export function FnBindingAnnotatedImplicit(
  name: string,
  type: Exp,
  span?: Span,
): FnBindingAnnotatedImplicit {
  return {
    "@kind": "FnBindingAnnotatedImplicit",
    name,
    type,
    span,
  }
}

export type Ap = {
  "@type": "Exp"
  "@kind": "Ap"
  target: Exp
  arg: Exp
} & ExpMeta

export function Ap(target: Exp, arg: Exp, span?: Span): Ap {
  return {
    "@type": "Exp",
    "@kind": "Ap",
    target,
    arg,
    span,
  }
}

export type ApImplicit = {
  "@type": "Exp"
  "@kind": "ApImplicit"
  target: Exp
  arg: Exp
} & ExpMeta

export function ApImplicit(target: Exp, arg: Exp, span?: Span): ApImplicit {
  return {
    "@type": "Exp",
    "@kind": "ApImplicit",
    target,
    arg,
    span,
  }
}

export type ApUnfolded = {
  "@type": "Exp"
  "@kind": "ApUnfolded"
  target: Exp
  args: Array<Arg>
} & ExpMeta

export function ApUnfolded(
  target: Exp,
  args: Array<Arg>,
  span?: Span,
): ApUnfolded {
  return {
    "@type": "Exp",
    "@kind": "ApUnfolded",
    target,
    args,
    span,
  }
}

export type Arg = ArgPlain | ArgImplicit

export type ArgPlain = {
  "@kind": "ArgPlain"
  exp: Exp
}

export function ArgPlain(exp: Exp): ArgPlain {
  return {
    "@kind": "ArgPlain",
    exp,
  }
}

export type ArgImplicit = {
  "@kind": "ArgImplicit"
  exp: Exp
}

export function ArgImplicit(exp: Exp): ArgImplicit {
  return {
    "@kind": "ArgImplicit",
    exp,
  }
}

export type Sigma = {
  "@type": "Exp"
  "@kind": "Sigma"
  name: string
  carType: Exp
  cdrType: Exp
} & ExpMeta

export function Sigma(
  name: string,
  carType: Exp,
  cdrType: Exp,
  span?: Span,
): Sigma {
  return {
    "@type": "Exp",
    "@kind": "Sigma",
    name,
    carType,
    cdrType,
    span,
  }
}

export type SigmaUnfolded = {
  "@type": "Exp"
  "@kind": "SigmaUnfolded"
  bindings: Array<SigmaBinding>
  cdrType: Exp
} & ExpMeta

export function SigmaUnfolded(
  bindings: Array<SigmaBinding>,
  cdrType: Exp,
  span?: Span,
): SigmaUnfolded {
  return {
    "@type": "Exp",
    "@kind": "SigmaUnfolded",
    bindings,
    cdrType,
    span,
  }
}

export type SigmaBinding = SigmaBindingNameless | SigmaBindingNamed

export type SigmaBindingNameless = {
  "@kind": "SigmaBindingNameless"
  type: Exp
} & ExpMeta

export function SigmaBindingNameless(
  type: Exp,
  span?: Span,
): SigmaBindingNameless {
  return {
    "@kind": "SigmaBindingNameless",
    type,
    span,
  }
}

export type SigmaBindingNamed = {
  "@kind": "SigmaBindingNamed"
  name: string
  type: Exp
} & ExpMeta

export function SigmaBindingNamed(
  name: string,
  type: Exp,
  span?: Span,
): SigmaBindingNamed {
  return {
    "@kind": "SigmaBindingNamed",
    name,
    type,
    span,
  }
}

export type Cons = {
  "@type": "Exp"
  "@kind": "Cons"
  car: Exp
  cdr: Exp
} & ExpMeta

export function Cons(car: Exp, cdr: Exp, span?: Span): Cons {
  return {
    "@type": "Exp",
    "@kind": "Cons",
    car,
    cdr,
    span,
  }
}

export type Quote = {
  "@type": "Exp"
  "@kind": "Quote"
  data: string
} & ExpMeta

export function Quote(data: string, span?: Span): Quote {
  return {
    "@type": "Exp",
    "@kind": "Quote",
    data,
    span,
  }
}

export type Clazz = ClazzNull | ClazzCons | ClazzFulfilled

export type ClazzNull = {
  "@type": "Exp"
  "@kind": "ClazzNull"
  name?: string
} & ExpMeta

export function ClazzNull(name?: string, span?: Span): ClazzNull {
  return {
    "@type": "Exp",
    "@kind": "ClazzNull",
    name,
    span,
  }
}

export type ClazzCons = {
  "@type": "Exp"
  "@kind": "ClazzCons"
  propertyName: string
  localName: string
  propertyType: Exp
  rest: Clazz
  name?: string
} & ExpMeta

export function ClazzCons(
  propertyName: string,
  localName: string,
  propertyType: Exp,
  rest: Clazz,
  name?: string,
  span?: Span,
): ClazzCons {
  return {
    "@type": "Exp",
    "@kind": "ClazzCons",
    propertyName,
    localName,
    propertyType,
    rest,
    name,
    span,
  }
}

export type ClazzFulfilled = {
  "@type": "Exp"
  "@kind": "ClazzFulfilled"
  propertyName: string
  localName: string
  propertyType: Exp
  property: Exp
  rest: Clazz
  name?: string
} & ExpMeta

export function ClazzFulfilled(
  propertyName: string,
  localName: string,
  propertyType: Exp,
  property: Exp,
  rest: Clazz,
  name?: string,
  span?: Span,
): ClazzFulfilled {
  return {
    "@type": "Exp",
    "@kind": "ClazzFulfilled",
    propertyName,
    localName,
    propertyType,
    property,
    rest,
    name,
    span,
  }
}

export type ClazzUnfolded = {
  "@type": "Exp"
  "@kind": "ClazzUnfolded"
  bindings: Array<ClazzBinding>
  name?: string
} & ExpMeta

export function ClazzUnfolded(
  bindings: Array<ClazzBinding>,
  name?: string,
  span?: Span,
): ClazzUnfolded {
  return {
    "@type": "Exp",
    "@kind": "ClazzUnfolded",
    bindings,
    name,
    span,
  }
}

export type ClazzBinding = ClazzBindingAbstract | ClazzBindingFulfilled

export type ClazzBindingAbstract = {
  "@kind": "ClazzBindingAbstract"
  name: string
  propertyType: Exp
}

export function ClazzBindingAbstract(
  name: string,
  propertyType: Exp,
): ClazzBindingAbstract {
  return {
    "@kind": "ClazzBindingAbstract",
    name,
    propertyType,
  }
}

export type ClazzBindingFulfilled = {
  "@kind": "ClazzBindingFulfilled"
  name: string
  propertyType: Exp
  property: Exp
}

export function ClazzBindingFulfilled(
  name: string,
  propertyType: Exp,
  property: Exp,
): ClazzBindingFulfilled {
  return {
    "@kind": "ClazzBindingFulfilled",
    name,
    propertyType,
    property,
  }
}

export type Objekt = {
  "@type": "Exp"
  "@kind": "Objekt"
  properties: Record<string, Exp>
} & ExpMeta

export function Objekt(properties: Record<string, Exp>, span?: Span): Objekt {
  return {
    "@type": "Exp",
    "@kind": "Objekt",
    properties,
    span,
  }
}

export type ObjektUnfolded = {
  "@type": "Exp"
  "@kind": "ObjektUnfolded"
  properties: Array<Property>
} & ExpMeta

export function ObjektUnfolded(
  properties: Array<Property>,
  span?: Span,
): ObjektUnfolded {
  return {
    "@type": "Exp",
    "@kind": "ObjektUnfolded",
    properties,
    span,
  }
}

export type Property = PropertyPlain | PropertySpread

export type PropertyPlain = {
  "@kind": "PropertyPlain"
  name: string
  exp: Exp
}

export function PropertyPlain(name: string, exp: Exp): PropertyPlain {
  return {
    "@kind": "PropertyPlain",
    name,
    exp,
  }
}

export type PropertySpread = {
  "@kind": "PropertySpread"
  exp: Exp
}

export function PropertySpread(exp: Exp): PropertySpread {
  return {
    "@kind": "PropertySpread",
    exp,
  }
}

export type New = {
  "@type": "Exp"
  "@kind": "New"
  name: string
  properties: Record<string, Exp>
} & ExpMeta

export function New(
  name: string,
  properties: Record<string, Exp>,
  span?: Span,
): New {
  return {
    "@type": "Exp",
    "@kind": "New",
    name,
    properties,
    span,
  }
}

export type NewUnfolded = {
  "@type": "Exp"
  "@kind": "NewUnfolded"
  name: string
  properties: Array<Property>
} & ExpMeta

export function NewUnfolded(
  name: string,
  properties: Array<Property>,
  span?: Span,
): NewUnfolded {
  return {
    "@type": "Exp",
    "@kind": "NewUnfolded",
    name,
    properties,
    span,
  }
}

export type NewAp = {
  "@type": "Exp"
  "@kind": "NewAp"
  name: string
  args: Array<Arg>
} & ExpMeta

export function NewAp(name: string, args: Array<Arg>, span?: Span): NewAp {
  return {
    "@type": "Exp",
    "@kind": "NewAp",
    name,
    args,
    span,
  }
}

export type Dot = {
  "@type": "Exp"
  "@kind": "Dot"
  target: Exp
  name: string
} & ExpMeta

export function Dot(target: Exp, name: string, span?: Span): Dot {
  return {
    "@type": "Exp",
    "@kind": "Dot",
    target,
    name,
    span,
  }
}

export type Sequence = SequenceLet | SequenceLetThe | SequenceCheck

export type SequenceLet = {
  "@type": "Exp"
  "@kind": "SequenceLet"
  name: string
  exp: Exp
  ret: Exp
} & ExpMeta

export function SequenceLet(
  name: string,
  exp: Exp,
  ret: Exp,
  span?: Span,
): SequenceLet {
  return {
    "@type": "Exp",
    "@kind": "SequenceLet",
    name,
    exp,
    ret,
    span,
  }
}

export type SequenceLetThe = {
  "@type": "Exp"
  "@kind": "SequenceLetThe"
  name: string
  type: Exp
  exp: Exp
  ret: Exp
} & ExpMeta

export function SequenceLetThe(
  name: string,
  type: Exp,
  exp: Exp,
  ret: Exp,
  span?: Span,
): SequenceLetThe {
  return {
    "@type": "Exp",
    "@kind": "SequenceLetThe",
    name,
    type,
    exp,
    ret,
    span,
  }
}

export type SequenceCheck = {
  "@type": "Exp"
  "@kind": "SequenceCheck"
  exp: Exp
  type: Exp
  ret: Exp
} & ExpMeta

export function SequenceCheck(
  exp: Exp,
  type: Exp,
  ret: Exp,
  span?: Span,
): SequenceCheck {
  return {
    "@type": "Exp",
    "@kind": "SequenceCheck",
    exp,
    type,
    ret,
    span,
  }
}

export type SequenceUnfolded = {
  "@type": "Exp"
  "@kind": "SequenceUnfolded"
  bindings: Array<SequenceBinding>
  ret: Exp
} & ExpMeta

export function SequenceUnfolded(
  bindings: Array<SequenceBinding>,
  ret: Exp,
  span?: Span,
): SequenceUnfolded {
  return {
    "@type": "Exp",
    "@kind": "SequenceUnfolded",
    bindings,
    ret,
    span,
  }
}

export type SequenceBinding =
  | SequenceBindingLet
  | SequenceBindingLetThe
  | SequenceBindingCheck

export type SequenceBindingLet = {
  "@kind": "SequenceBindingLet"
  name: string
  exp: Exp
} & ExpMeta

export function SequenceBindingLet(
  name: string,
  exp: Exp,
  span?: Span,
): SequenceBindingLet {
  return {
    "@kind": "SequenceBindingLet",
    name,
    exp,
    span,
  }
}

export type SequenceBindingLetThe = {
  "@kind": "SequenceBindingLetThe"
  name: string
  type: Exp
  exp: Exp
} & ExpMeta

export function SequenceBindingLetThe(
  name: string,
  type: Exp,
  exp: Exp,
  span?: Span,
): SequenceBindingLetThe {
  return {
    "@kind": "SequenceBindingLetThe",
    name,
    type,
    exp,
    span,
  }
}

export type SequenceBindingCheck = {
  "@kind": "SequenceBindingCheck"
  exp: Exp
  type: Exp
} & ExpMeta

export function SequenceBindingCheck(
  exp: Exp,
  type: Exp,
  span?: Span,
): SequenceBindingCheck {
  return {
    "@kind": "SequenceBindingCheck",
    exp,
    type,
    span,
  }
}

export type MacroEmbedded = {
  "@type": "Exp"
  "@kind": "MacroEmbedded"
  macro: Macro
} & ExpMeta

export function MacroEmbedded(macro: Macro, span?: Span): MacroEmbedded {
  return {
    "@type": "Exp",
    "@kind": "MacroEmbedded",
    macro,
    span,
  }
}
