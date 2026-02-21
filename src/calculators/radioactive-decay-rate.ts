import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const radioactiveDecayRateCalculator: CalculatorDefinition = {
  slug: "radioactive-decay-rate-calculator",
  title: "Radioactive Decay Rate Calculator",
  description: "Free radioactive decay rate calculator. Calculate decay rate (activity), decay constant, specific activity, and remaining amount after decay.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["radioactive decay rate", "activity", "becquerel", "curie", "decay constant", "specific activity"],
  variants: [
    {
      id: "activity",
      name: "Calculate Activity (A)",
      description: "A = λN (decays per second)",
      fields: [
        { name: "halfLife", label: "Half-Life", type: "number", placeholder: "e.g. 5730" },
        { name: "halfLifeUnit", label: "Half-Life Unit", type: "select", options: [
          { label: "Seconds", value: "1" },
          { label: "Minutes", value: "60" },
          { label: "Hours", value: "3600" },
          { label: "Days", value: "86400" },
          { label: "Years", value: "31557600" },
        ] },
        { name: "moles", label: "Amount (moles)", type: "number", placeholder: "e.g. 0.001" },
      ],
      calculate: (inputs) => {
        const tHalf = inputs.halfLife as number, unitMult = parseFloat(inputs.halfLifeUnit as string) || 1;
        const moles = inputs.moles as number;
        if (!tHalf || !moles || tHalf <= 0 || moles <= 0) return null;
        const tHalfSec = tHalf * unitMult;
        const lambda = Math.log(2) / tHalfSec; // s⁻¹
        const N = moles * 6.022e23; // atoms
        const A = lambda * N; // Bq (decays/s)
        const aCurie = A / 3.7e10; // Ci
        return {
          primary: { label: "Activity", value: `${A.toExponential(4)} Bq` },
          details: [
            { label: "Activity in Ci", value: `${aCurie.toExponential(4)} Ci` },
            { label: "Activity in dpm", value: `${(A * 60).toExponential(4)} dpm` },
            { label: "Decay Constant (λ)", value: `${lambda.toExponential(4)} s⁻¹` },
            { label: "Number of Atoms", value: N.toExponential(4) },
          ],
        };
      },
    },
    {
      id: "specificActivity",
      name: "Specific Activity",
      description: "Activity per gram of radioactive isotope",
      fields: [
        { name: "halfLife", label: "Half-Life", type: "number", placeholder: "e.g. 5730" },
        { name: "halfLifeUnit", label: "Half-Life Unit", type: "select", options: [
          { label: "Seconds", value: "1" },
          { label: "Minutes", value: "60" },
          { label: "Hours", value: "3600" },
          { label: "Days", value: "86400" },
          { label: "Years", value: "31557600" },
        ] },
        { name: "atomicMass", label: "Atomic Mass (g/mol)", type: "number", placeholder: "e.g. 14.003 for C-14" },
      ],
      calculate: (inputs) => {
        const tHalf = inputs.halfLife as number, unitMult = parseFloat(inputs.halfLifeUnit as string) || 1;
        const am = inputs.atomicMass as number;
        if (!tHalf || !am || tHalf <= 0 || am <= 0) return null;
        const tHalfSec = tHalf * unitMult;
        const lambda = Math.log(2) / tHalfSec;
        const Na = 6.022e23;
        const specificActivity = (lambda * Na) / am; // Bq/g
        const saCurie = specificActivity / 3.7e10; // Ci/g
        return {
          primary: { label: "Specific Activity", value: `${specificActivity.toExponential(4)} Bq/g` },
          details: [
            { label: "In Ci/g", value: `${saCurie.toExponential(4)} Ci/g` },
            { label: "In GBq/g", value: formatNumber(specificActivity / 1e9, 4) },
            { label: "Decay Constant", value: `${lambda.toExponential(4)} s⁻¹` },
          ],
          note: "Shorter half-life = higher specific activity. Specific activity is inversely proportional to half-life and atomic mass.",
        };
      },
    },
    {
      id: "remainingAfterTime",
      name: "Remaining Activity After Time",
      fields: [
        { name: "a0", label: "Initial Activity (Bq or any unit)", type: "number", placeholder: "e.g. 1000" },
        { name: "halfLife", label: "Half-Life", type: "number", placeholder: "e.g. 5730" },
        { name: "time", label: "Elapsed Time", type: "number", placeholder: "e.g. 11460" },
        { name: "timeUnit", label: "Time Unit", type: "select", options: [
          { label: "Same as half-life", value: "same" },
          { label: "Seconds", value: "seconds" },
          { label: "Minutes", value: "minutes" },
          { label: "Hours", value: "hours" },
          { label: "Days", value: "days" },
          { label: "Years", value: "years" },
        ] },
      ],
      calculate: (inputs) => {
        const a0 = inputs.a0 as number, tHalf = inputs.halfLife as number, time = inputs.time as number;
        if (!a0 || !tHalf || !time || a0 <= 0 || tHalf <= 0 || time < 0) return null;
        const numHalfLives = time / tHalf;
        const at = a0 * Math.pow(0.5, numHalfLives);
        const pctRemaining = (at / a0) * 100;
        return {
          primary: { label: "Remaining Activity", value: at < 0.01 ? at.toExponential(4) : formatNumber(at, 4) },
          details: [
            { label: "Initial Activity", value: formatNumber(a0, 4) },
            { label: "Number of Half-Lives", value: formatNumber(numHalfLives, 4) },
            { label: "% Remaining", value: `${formatNumber(pctRemaining, 4)}%` },
            { label: "% Decayed", value: `${formatNumber(100 - pctRemaining, 4)}%` },
            { label: "Decay Factor", value: formatNumber(Math.pow(0.5, numHalfLives), 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["half-life-calculator", "decay-calculator", "reaction-rate-calculator"],
  faq: [
    { question: "What is radioactive decay rate (activity)?", answer: "Activity (A) is the number of nuclear disintegrations per unit time. A = λN, where λ is the decay constant and N is the number of radioactive atoms. Units: Becquerel (Bq) = 1 decay/s, Curie (Ci) = 3.7 × 10¹⁰ decays/s." },
    { question: "What is specific activity?", answer: "Specific activity is the activity per unit mass of a radioactive isotope: SA = λNₐ/M (Bq/g). Shorter half-lives give higher specific activity. For example, I-131 (t½=8d) has much higher specific activity than U-238 (t½=4.5×10⁹ yr)." },
    { question: "How does activity change over time?", answer: "Activity decays exponentially: A(t) = A₀ × (1/2)^(t/t½) = A₀ × e^(-λt). After one half-life, activity halves. After 10 half-lives, ~0.1% remains. Activity is directly proportional to the number of remaining atoms." },
  ],
  formula: "A = λN | λ = ln(2)/t½ | A(t) = A₀ × (1/2)^(t/t½) | SA = λNₐ/M | 1 Ci = 3.7 × 10¹⁰ Bq",
};
