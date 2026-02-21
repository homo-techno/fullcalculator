import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const booleanAlgebraCalculator: CalculatorDefinition = {
  slug: "boolean-algebra-calculator",
  title: "Boolean Algebra Calculator",
  description: "Free boolean algebra calculator. Evaluate logical expressions with AND, OR, NOT, XOR, NAND, NOR operations and generate truth tables.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["boolean algebra calculator", "logic gate calculator", "truth table generator", "boolean expression", "AND OR NOT XOR"],
  variants: [
    {
      id: "two-variable",
      name: "Two-Variable Boolean Operation",
      description: "Evaluate a boolean operation on two inputs A and B",
      fields: [
        { name: "a", label: "Input A", type: "select", options: [
          { label: "0 (False)", value: "0" },
          { label: "1 (True)", value: "1" },
        ], defaultValue: "1" },
        { name: "b", label: "Input B", type: "select", options: [
          { label: "0 (False)", value: "0" },
          { label: "1 (True)", value: "1" },
        ], defaultValue: "0" },
        { name: "op", label: "Operation", type: "select", options: [
          { label: "AND (A ∧ B)", value: "and" },
          { label: "OR (A ∨ B)", value: "or" },
          { label: "XOR (A ⊕ B)", value: "xor" },
          { label: "NAND ¬(A ∧ B)", value: "nand" },
          { label: "NOR ¬(A ∨ B)", value: "nor" },
          { label: "XNOR ¬(A ⊕ B)", value: "xnor" },
          { label: "Implication (A → B)", value: "implies" },
        ], defaultValue: "and" },
      ],
      calculate: (inputs) => {
        const a = inputs.a === "1" ? 1 : 0;
        const b = inputs.b === "1" ? 1 : 0;
        const op = inputs.op as string;

        const operations: Record<string, { result: number; symbol: string; name: string }> = {
          and: { result: a & b, symbol: "∧", name: "AND" },
          or: { result: a | b, symbol: "∨", name: "OR" },
          xor: { result: a ^ b, symbol: "⊕", name: "XOR" },
          nand: { result: (a & b) ^ 1, symbol: "↑", name: "NAND" },
          nor: { result: (a | b) ^ 1, symbol: "↓", name: "NOR" },
          xnor: { result: (a ^ b) ^ 1, symbol: "⊙", name: "XNOR" },
          implies: { result: a === 1 && b === 0 ? 0 : 1, symbol: "→", name: "IMPLIES" },
        };

        const opData = operations[op];
        if (!opData) return null;

        return {
          primary: { label: `${a} ${opData.symbol} ${b}`, value: String(opData.result) },
          details: [
            { label: "A", value: String(a) },
            { label: "B", value: String(b) },
            { label: `A ${opData.symbol} B (${opData.name})`, value: String(opData.result) },
            { label: "NOT A (¬A)", value: String(a ^ 1) },
            { label: "NOT B (¬B)", value: String(b ^ 1) },
            { label: "A AND B", value: String(a & b) },
            { label: "A OR B", value: String(a | b) },
            { label: "A XOR B", value: String(a ^ b) },
          ],
        };
      },
    },
    {
      id: "truth-table",
      name: "Truth Table Generator",
      description: "Generate a complete truth table for a two-variable operation",
      fields: [
        { name: "op", label: "Operation", type: "select", options: [
          { label: "AND (A ∧ B)", value: "and" },
          { label: "OR (A ∨ B)", value: "or" },
          { label: "XOR (A ⊕ B)", value: "xor" },
          { label: "NAND ¬(A ∧ B)", value: "nand" },
          { label: "NOR ¬(A ∨ B)", value: "nor" },
          { label: "XNOR ¬(A ⊕ B)", value: "xnor" },
          { label: "Implication (A → B)", value: "implies" },
        ], defaultValue: "and" },
      ],
      calculate: (inputs) => {
        const op = inputs.op as string;

        const evalOp = (a: number, b: number): number => {
          switch (op) {
            case "and": return a & b;
            case "or": return a | b;
            case "xor": return a ^ b;
            case "nand": return (a & b) ^ 1;
            case "nor": return (a | b) ^ 1;
            case "xnor": return (a ^ b) ^ 1;
            case "implies": return a === 1 && b === 0 ? 0 : 1;
            default: return 0;
          }
        };

        const opNames: Record<string, string> = {
          and: "AND (∧)", or: "OR (∨)", xor: "XOR (⊕)",
          nand: "NAND (↑)", nor: "NOR (↓)", xnor: "XNOR (⊙)",
          implies: "IMPLIES (→)",
        };

        const rows = [
          { a: 0, b: 0 },
          { a: 0, b: 1 },
          { a: 1, b: 0 },
          { a: 1, b: 1 },
        ];

        const details = rows.map((r) => ({
          label: `A=${r.a}, B=${r.b}`,
          value: String(evalOp(r.a, r.b)),
        }));

        const trueCount = rows.filter((r) => evalOp(r.a, r.b) === 1).length;

        details.push({ label: "True outputs", value: `${trueCount} of 4` });
        details.push({ label: "Is tautology?", value: trueCount === 4 ? "Yes" : "No" });
        details.push({ label: "Is contradiction?", value: trueCount === 0 ? "Yes" : "No" });

        return {
          primary: { label: `Truth Table: ${opNames[op]}`, value: `${trueCount}/4 true` },
          details,
        };
      },
    },
    {
      id: "de-morgan",
      name: "De Morgan's Laws",
      description: "Verify De Morgan's Laws for given inputs",
      fields: [
        { name: "a", label: "Input A", type: "select", options: [
          { label: "0 (False)", value: "0" },
          { label: "1 (True)", value: "1" },
        ], defaultValue: "1" },
        { name: "b", label: "Input B", type: "select", options: [
          { label: "0 (False)", value: "0" },
          { label: "1 (True)", value: "1" },
        ], defaultValue: "0" },
      ],
      calculate: (inputs) => {
        const a = inputs.a === "1" ? 1 : 0;
        const b = inputs.b === "1" ? 1 : 0;

        const notAorB = (a | b) ^ 1;
        const notAandNotB = (a ^ 1) & (b ^ 1);
        const notAandB = (a & b) ^ 1;
        const notAorNotB = (a ^ 1) | (b ^ 1);

        return {
          primary: { label: "De Morgan's Laws", value: "Verified" },
          details: [
            { label: "A", value: String(a) },
            { label: "B", value: String(b) },
            { label: "--- Law 1 ---", value: "¬(A∨B) = ¬A ∧ ¬B" },
            { label: "¬(A ∨ B)", value: String(notAorB) },
            { label: "¬A ∧ ¬B", value: String(notAandNotB) },
            { label: "Law 1 holds?", value: notAorB === notAandNotB ? "Yes" : "No" },
            { label: "--- Law 2 ---", value: "¬(A∧B) = ¬A ∨ ¬B" },
            { label: "¬(A ∧ B)", value: String(notAandB) },
            { label: "¬A ∨ ¬B", value: String(notAorNotB) },
            { label: "Law 2 holds?", value: notAandB === notAorNotB ? "Yes" : "No" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["binary-hex-calculator", "probability-calculator", "number-base-calculator"],
  faq: [
    { question: "What is Boolean algebra?", answer: "Boolean algebra operates on binary values (0/1, true/false). Core operations: AND (both true), OR (at least one true), NOT (negation), XOR (exactly one true). It's the foundation of digital circuits and computer logic." },
    { question: "What are De Morgan's Laws?", answer: "De Morgan's Laws state: (1) NOT(A OR B) = (NOT A) AND (NOT B), and (2) NOT(A AND B) = (NOT A) OR (NOT B). These laws are fundamental for simplifying boolean expressions and circuit design." },
  ],
  formula: "AND: A∧B | OR: A∨B | NOT: ¬A | XOR: A⊕B | De Morgan: ¬(A∨B) = ¬A∧¬B",
};
