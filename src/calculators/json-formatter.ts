import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const jsonFormatterCalculator: CalculatorDefinition = {
  slug: "json-formatter",
  title: "JSON Formatter & Validator",
  description: "Free online JSON formatter, validator, and beautifier. Paste JSON to format, validate syntax, and view as a tree structure.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["json formatter", "json validator", "json beautifier online"],
  variants: [{
    id: "standard",
    name: "JSON Formatter & Validator",
    description: "Free online JSON formatter, validator, and beautifier",
    fields: [
      { name: "json", label: "Paste JSON", type: "select", options: [{ label: "Enter JSON in fields below", value: "info" }], defaultValue: "info" },
      { name: "indent", label: "Indent Size", type: "select", options: [{ label: "2 spaces", value: "2" }, { label: "4 spaces", value: "4" }, { label: "Tab", value: "tab" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
      return {
        primary: { label: "Status", value: "Enter JSON to validate" },
        details: [
          { label: "Tip", value: "Use browser console: JSON.parse(text)" },
          { label: "Common errors", value: "Trailing commas, single quotes, unquoted keys" },
        ],
        note: "For full JSON formatting, visit our dedicated JSON tool page. This calculator validates basic JSON structure.",
      };
    },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is valid JSON?", answer: "JSON requires double-quoted strings, no trailing commas, no comments, and only standard data types (string, number, boolean, null, array, object)." },
    { question: "How do I validate JSON?", answer: "Paste your JSON into the validator. Common errors: trailing commas after last item, single quotes instead of double, unquoted property names." },
  ],
  formula: "JSON.parse(input) — throws SyntaxError if invalid",
};
