export const pi_binding = {
  $grammar: {
    "pi_binding:nameless": [{ exp: "exp" }],
    "pi_binding:named": [{ name: "name" }, '":"', { exp: "exp" }],
    "pi_binding:implicit": ['"implicit"', { name: "name" }, '":"', { exp: "exp" }],
  },
}

export const pi_bindings = {
  $grammar: {
    "pi_bindings:pi_bindings": [
      { entries: { $ap: ["zero_or_more", "pi_binding", '","'] } },
      { last_entry: "pi_binding" },
      { $ap: ["optional", '","'] },
    ],
  },
}
