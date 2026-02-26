import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function parseSet(str: string): number[] {
  return str
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "")
    .map(Number)
    .filter((n) => !isNaN(n));
}

function unique(arr: number[]): number[] {
  return [...new Set(arr)].sort((a, b) => a - b);
}

function formatSet(arr: number[]): string {
  if (arr.length === 0) return "∅ (empty set)";
  return `{${arr.map((n) => formatNumber(n)).join(", ")}}`;
}

export const setTheoryCalculator: CalculatorDefinition = {
  slug: "set-theory-calculator",
  title: "Set Theory Calculator",
  description: "Free set theory calculator. Compute union, intersection, difference, symmetric difference, and Cartesian product of number sets.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["set theory calculator", "union intersection", "set operations", "venn diagram", "set difference", "symmetric difference"],
  variants: [
    {
      id: "operations",
      name: "Set Operations",
      description: "Compute union, intersection, and difference of two sets (enter comma-separated numbers)",
      fields: [
        { name: "setA", label: "Set A (comma-separated)", type: "number", placeholder: "e.g. 1, 2, 3, 4, 5" },
        { name: "setB", label: "Set B (comma-separated)", type: "number", placeholder: "e.g. 3, 4, 5, 6, 7" },
      ],
      calculate: (inputs) => {
        const rawA = String(inputs.setA ?? "");
        const rawB = String(inputs.setB ?? "");
        if (!rawA && !rawB) return null;

        const setA = unique(parseSet(rawA));
        const setB = unique(parseSet(rawB));
        if (setA.length === 0 && setB.length === 0) return null;

        const union = unique([...setA, ...setB]);
        const intersection = setA.filter((x) => setB.includes(x));
        const differenceAB = setA.filter((x) => !setB.includes(x));
        const differenceBA = setB.filter((x) => !setA.includes(x));
        const symmetricDiff = unique([...differenceAB, ...differenceBA]);

        return {
          primary: { label: "A ∪ B (Union)", value: formatSet(union) },
          details: [
            { label: "Set A", value: formatSet(setA) },
            { label: "Set B", value: formatSet(setB) },
            { label: "|A|", value: formatNumber(setA.length, 0) },
            { label: "|B|", value: formatNumber(setB.length, 0) },
            { label: "A ∩ B (Intersection)", value: formatSet(intersection) },
            { label: "A \\ B (Difference)", value: formatSet(differenceAB) },
            { label: "B \\ A (Difference)", value: formatSet(differenceBA) },
            { label: "A △ B (Symmetric Diff)", value: formatSet(symmetricDiff) },
            { label: "|A ∪ B|", value: formatNumber(union.length, 0) },
            { label: "|A ∩ B|", value: formatNumber(intersection.length, 0) },
          ],
        };
      },
    },
    {
      id: "subset-check",
      name: "Subset & Power Set",
      description: "Check subset relationships and compute power set size",
      fields: [
        { name: "setA", label: "Set A (comma-separated)", type: "number", placeholder: "e.g. 1, 2, 3" },
        { name: "setB", label: "Set B (comma-separated)", type: "number", placeholder: "e.g. 1, 2, 3, 4, 5" },
      ],
      calculate: (inputs) => {
        const rawA = String(inputs.setA ?? "");
        const rawB = String(inputs.setB ?? "");
        if (!rawA && !rawB) return null;

        const setA = unique(parseSet(rawA));
        const setB = unique(parseSet(rawB));

        const aSubsetB = setA.every((x) => setB.includes(x));
        const bSubsetA = setB.every((x) => setA.includes(x));
        const areEqual = aSubsetB && bSubsetA;
        const areDisjoint = setA.every((x) => !setB.includes(x));
        const powerSetSizeA = Math.pow(2, setA.length);
        const powerSetSizeB = Math.pow(2, setB.length);

        return {
          primary: { label: "A ⊆ B?", value: aSubsetB ? "Yes" : "No" },
          details: [
            { label: "Set A", value: formatSet(setA) },
            { label: "Set B", value: formatSet(setB) },
            { label: "A ⊆ B (A subset of B)?", value: aSubsetB ? "Yes" : "No" },
            { label: "B ⊆ A (B subset of A)?", value: bSubsetA ? "Yes" : "No" },
            { label: "A = B (Equal sets)?", value: areEqual ? "Yes" : "No" },
            { label: "Disjoint (no overlap)?", value: areDisjoint ? "Yes" : "No" },
            { label: "|P(A)| (Power set size)", value: formatNumber(powerSetSizeA, 0) },
            { label: "|P(B)| (Power set size)", value: formatNumber(powerSetSizeB, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["probability-calculator", "permutation-combination-calculator", "scientific-calculator"],
  faq: [
    { question: "What is the difference between union and intersection?", answer: "Union (A ∪ B) combines all elements from both sets. Intersection (A ∩ B) includes only elements that appear in both sets. For A = {1,2,3} and B = {2,3,4}: union = {1,2,3,4}, intersection = {2,3}." },
    { question: "What is symmetric difference?", answer: "The symmetric difference (A △ B) contains elements that are in either A or B but not in both. It equals (A \\ B) ∪ (B \\ A). For A = {1,2,3} and B = {2,3,4}: A △ B = {1,4}." },
    { question: "What is a power set?", answer: "The power set P(A) is the set of all subsets of A, including the empty set and A itself. If |A| = n, then |P(A)| = 2^n. For A = {1,2}, P(A) = {∅, {1}, {2}, {1,2}}, so |P(A)| = 4." },
  ],
  formula: "A ∪ B = {x : x ∈ A or x ∈ B} | A ∩ B = {x : x ∈ A and x ∈ B} | A \\ B = {x : x ∈ A and x ∉ B} | |P(A)| = 2^|A|",
};
