// The palette as written in tokens.css, repeated in TypeScript so contrast can be computed
// (styleguide, tests). tests/unit/tokens.test.ts checks the two agree.
export const PALETTE = {
  light: {
    paper: "#F3F4F2",
    print: "#000000",
    pencil: "#5B5F63",
    rule: "#D5D8D6",
    biro: "#2340E0",
  },
  dark: { paper: "#000000", print: "#E6E7E4", pencil: "#9A9EA2", rule: "#26282A", biro: "#6F86FF" },
} as const;
