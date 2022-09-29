import pt from "@cicada-lang/partech"
import * as Exps from "../../exp"
import * as matchers from "../matchers"

export function fn_binding_matcher(tree: pt.Tree): Exps.FnBinding {
  return pt.matcher<Exps.FnBinding>({
    "fn_binding:name": ({ name }, { span }) => Exps.FnBindingName(pt.str(name)),
    "fn_binding:annotated": ({ name, t }, { span }) =>
      Exps.FnBindingAnnotated(pt.str(name), matchers.exp_matcher(t)),
    "fn_binding:implicit": ({ name }, { span }) => Exps.FnBindingImplicit(pt.str(name)),
    "fn_binding:annotated_implicit": ({ name, t }, { span }) =>
      Exps.FnBindingAnnotatedImplicit(pt.str(name), matchers.exp_matcher(t)),
  })(tree)
}

export function fn_bindings_matcher(tree: pt.Tree): Array<Exps.FnBinding> {
  return pt.matcher({
    "fn_bindings:fn_bindings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(fn_binding_matcher),
      fn_binding_matcher(last_entry),
    ],
    "fn_bindings:fn_bindings_bracket_separated": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(fn_binding_matcher),
      fn_binding_matcher(last_entry),
    ],
  })(tree)
}
