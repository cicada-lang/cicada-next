export const fn_binding = {
  $grammar: {
    "fn_binding:name": [{ name: "name" }],
    "fn_binding:annotated": [{ name: "name" }, '":"', { t: "exp" }],
    "fn_binding:implicit": ['"implicit"', { name: "name" }],
    "fn_binding:annotated_implicit": ['"implicit"', { name: "name" }, '":"', { t: "exp" }],
  },
}

export const fn_bindings = {
  $grammar: {
    "fn_bindings:fn_bindings": [
      { entries: { $ap: ["zero_or_more", "fn_binding", '","'] } },
      { last_entry: "fn_binding" },
      { $ap: ["optional", '","'] },
    ],
  },
}
