import pt from "@cicada-lang/partech"
import * as Exps from "../../exp"
import { Exp } from "../../exp"
import * as matchers from "../matchers"

export function exp_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "exp:operator": ({ operator }) => operator_matcher(operator),
    "exp:operand": ({ operand }) => operand_matcher(operand),
  })(tree)
}

export function operator_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "operator:var": ({ name }, { span }) => Exps.Var(pt.str(name), span),
    "operator:ap": ({ target, args_group }, { span }) =>
      pt.matchers
        .one_or_more_matcher(args_group)
        .map((args) => matchers.args_matcher(args))
        .reduce(
          (result, args) => Exps.FoldedAp(result, args, span),
          operator_matcher(target),
        ),
    "operator:car": ({ target }, { span }) =>
      Exps.Car(exp_matcher(target), span),
    "operator:cdr": ({ target }, { span }) =>
      Exps.Cdr(exp_matcher(target), span),
    "operator:dot_field": ({ target, name }, { span }) =>
      Exps.Dot(operator_matcher(target), pt.str(name), span),
    "operator:dot_field_quote": ({ target, literal }, { span }) =>
      Exps.Dot(
        operator_matcher(target),
        pt.trim_boundary(pt.str(literal), 1),
        span,
      ),
    "operator:dot_method": ({ target, name, args_group }, { span }) =>
      pt.matchers
        .one_or_more_matcher(args_group)
        .map((args) => matchers.args_matcher(args))
        .reduce(
          (result: Exp, args) => Exps.FoldedAp(result, args, span),
          Exps.Dot(
            operator_matcher(target),
            pt.str(name),
            pt.span_closure([target.span, name.span]),
          ),
        ),
    "operator:dot_method_quote": ({ target, literal, args_group }, { span }) =>
      pt.matchers
        .one_or_more_matcher(args_group)
        .map((args) => matchers.args_matcher(args))
        .reduce(
          (result: Exp, args) => Exps.FoldedAp(result, args, span),
          Exps.Dot(
            operator_matcher(target),
            pt.trim_boundary(pt.str(literal), 1),
            pt.span_closure([target.span, literal.span]),
          ),
        ),
    "operator:sequence_begin": ({ sequence }, { span }) =>
      matchers.sequence_matcher(sequence),
  })(tree)
}

export function operand_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "operand:pi": ({ bindings, ret_t }, { span }) =>
      Exps.PiFolded(
        matchers.pi_bindings_matcher(bindings),
        exp_matcher(ret_t),
        span,
      ),
    "operand:pi_forall": ({ bindings, ret_t }, { span }) =>
      Exps.PiFolded(
        matchers.pi_bindings_matcher(bindings),
        exp_matcher(ret_t),
        span,
      ),
    "operand:fn": ({ bindings, ret }, { span }) =>
      Exps.FnFolded(
        matchers.fn_bindings_matcher(bindings),
        exp_matcher(ret),
        span,
      ),
    "operand:fn_function": ({ bindings, sequence }, { span }) =>
      Exps.FnFolded(
        matchers.fn_bindings_matcher(bindings),
        matchers.sequence_matcher(sequence),
        span,
      ),
    "operand:fn_function_with_ret_type": (
      { bindings, ret_type, sequence },
      { span },
    ) =>
      Exps.FnFoldedWithRetType(
        matchers.fn_bindings_matcher(bindings),
        exp_matcher(ret_type),
        matchers.sequence_matcher(sequence),
        span,
      ),
    "operand:sigma_exists": ({ bindings, cdr_t }, { span }) =>
      Exps.FoldedSigma(
        matchers.sigma_bindings_matcher(bindings),
        matchers.exp_matcher(cdr_t),
        span,
      ),
    "operand:cons": ({ car, cdr }, { span }) =>
      Exps.Cons(exp_matcher(car), exp_matcher(cdr), span),
    "operand:quote": ({ literal }, { span }) =>
      Exps.Quote(pt.trim_boundary(pt.str(literal), 1), span),
    "operand:clazz": ({ bindings }, { span }) =>
      Exps.FoldedClazz(
        pt.matchers
          .zero_or_more_matcher(bindings)
          .map(matchers.clazz_binding_matcher),
        span,
      ),
    "operand:objekt": ({ properties, last_property }, { span }) =>
      Exps.FoldedObjekt(
        [
          ...pt.matchers
            .zero_or_more_matcher(properties)
            .map(matchers.property_matcher),
          matchers.property_matcher(last_property),
        ],
        span,
      ),
    "operand:new": ({ name, properties, last_property }, { span }) =>
      Exps.FoldedNew(
        pt.str(name),
        [
          ...pt.matchers
            .zero_or_more_matcher(properties)
            .map(matchers.property_matcher),
          matchers.property_matcher(last_property),
        ],
        span,
      ),
    "operand:new_ap": ({ name, args }, { span }) =>
      Exps.NewAp(pt.str(name), matchers.args_matcher(args), span),
  })(tree)
}
