import pt from "@cicada-lang/partech"
import * as Exps from "../../exp"
import * as matchers from "../matchers"

export function sequence_matcher(tree: pt.Tree): Exps.SequenceUnfolded {
  return pt.matcher({
    "sequence:sequence": ({ entries, ret }, { span }) =>
      Exps.SequenceUnfolded(
        pt.matchers.zero_or_more_matcher(entries).map(sequence_entry_matcher),
        matchers.exp_matcher(ret),
        span,
      ),
  })(tree)
}

export function sequence_entry_matcher(tree: pt.Tree): Exps.SequenceBinding {
  return pt.matcher<Exps.SequenceBinding>({
    "sequence_entry:let": ({ name, exp }, { span }) =>
      Exps.SequenceBindingLet(pt.str(name), matchers.exp_matcher(exp)),
    "sequence_entry:let_the": ({ name, t, exp }, { span }) =>
      Exps.SequenceBindingLetThe(pt.str(name), matchers.exp_matcher(t), matchers.exp_matcher(exp)),
    "sequence_entry:check": ({ exp, t }, { span }) =>
      Exps.SequenceBindingCheck(matchers.exp_matcher(exp), matchers.exp_matcher(t)),
    "sequence_entry:let_function": ({ name, bindings, ret_t, sequence }, { span }) =>
      Exps.SequenceBindingLetThe(
        pt.str(name),
        Exps.PiUnfolded(matchers.pi_bindings_matcher(bindings), matchers.exp_matcher(ret_t)),
        Exps.FnUnfolded(
          matchers.pi_bindings_matcher(bindings).map(matchers.piBindingtoFnBindingFrom),
          matchers.sequence_matcher(sequence),
        ),
      ),
  })(tree)
}
