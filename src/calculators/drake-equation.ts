import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const drakeEquationCalculator: CalculatorDefinition = {
  slug: "drake-equation-calculator",
  title: "Drake Equation Calculator",
  description:
    "Free Drake Equation calculator. Estimate the number of detectable alien civilizations in the Milky Way using the famous Drake Equation parameters.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "drake equation",
    "alien civilizations",
    "extraterrestrial life",
    "SETI",
    "fermi paradox",
    "space calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "Estimate Alien Civilizations",
      fields: [
        {
          name: "rStar",
          label: "Star Formation Rate (per year)",
          type: "number",
          placeholder: "e.g. 1.5",
          defaultValue: 1.5,
        },
        {
          name: "fp",
          label: "Fraction of Stars with Planets (0-1)",
          type: "number",
          placeholder: "e.g. 0.9",
          defaultValue: 0.9,
          step: 0.01,
        },
        {
          name: "ne",
          label: "Habitable Planets per Star System",
          type: "number",
          placeholder: "e.g. 0.2",
          defaultValue: 0.2,
          step: 0.01,
        },
        {
          name: "fl",
          label: "Fraction that Develop Life (0-1)",
          type: "number",
          placeholder: "e.g. 0.5",
          defaultValue: 0.5,
          step: 0.01,
        },
        {
          name: "fi",
          label: "Fraction that Develop Intelligence (0-1)",
          type: "number",
          placeholder: "e.g. 0.1",
          defaultValue: 0.1,
          step: 0.01,
        },
        {
          name: "fc",
          label: "Fraction that Send Signals (0-1)",
          type: "number",
          placeholder: "e.g. 0.1",
          defaultValue: 0.1,
          step: 0.01,
        },
        {
          name: "l",
          label: "Years a Civilization Sends Signals",
          type: "number",
          placeholder: "e.g. 10000",
          defaultValue: 10000,
        },
      ],
      calculate: (inputs) => {
        const rStar = inputs.rStar as number;
        const fp = inputs.fp as number;
        const ne = inputs.ne as number;
        const fl = inputs.fl as number;
        const fi = inputs.fi as number;
        const fc = inputs.fc as number;
        const l = inputs.l as number;

        if (!rStar || !fp || !ne || !fl || !fi || !fc || !l) return null;

        const n = rStar * fp * ne * fl * fi * fc * l;

        let verdict: string;
        if (n >= 10000) {
          verdict = "The galaxy should be teeming with life! Where is everybody? (Fermi Paradox)";
        } else if (n >= 1000) {
          verdict = "Thousands of civilizations! We should be picking up signals soon.";
        } else if (n >= 100) {
          verdict = "Hundreds of civilizations — the galaxy is a big place though.";
        } else if (n >= 10) {
          verdict = "A handful of civilizations. Finding them would be like finding needles in a cosmic haystack.";
        } else if (n >= 1) {
          verdict = "We might not be alone, but our neighbors are very far away.";
        } else {
          verdict = "Looks like we might be alone in the galaxy. Treasure this pale blue dot.";
        }

        const avgDistance = n > 0 ? Math.round(100000 / Math.cbrt(n)) : 0;

        return {
          primary: {
            label: "Estimated Civilizations (N)",
            value: formatNumber(n, 1),
          },
          details: [
            { label: "R* (Star Formation Rate)", value: `${formatNumber(rStar, 2)} per year` },
            { label: "fp (Stars with Planets)", value: formatNumber(fp, 4) },
            { label: "ne (Habitable Planets)", value: formatNumber(ne, 4) },
            { label: "fl (Life Develops)", value: formatNumber(fl, 4) },
            { label: "fi (Intelligence Develops)", value: formatNumber(fi, 4) },
            { label: "fc (Sends Signals)", value: formatNumber(fc, 4) },
            { label: "L (Signal Duration)", value: `${formatNumber(l, 0)} years` },
            { label: "Avg Distance Between Civs", value: n > 0 ? `~${formatNumber(avgDistance, 0)} light-years` : "N/A" },
            { label: "Verdict", value: verdict },
          ],
          note: "The Drake Equation is more of a thought experiment than a precise calculation. Each parameter is highly uncertain.",
        };
      },
    },
  ],
  relatedSlugs: ["age-on-planets-calculator", "probability-calculator"],
  faq: [
    {
      question: "What is the Drake Equation?",
      answer:
        "The Drake Equation was formulated by astronomer Frank Drake in 1961 to estimate the number of active, communicative extraterrestrial civilizations in our galaxy. It multiplies together seven factors: the rate of star formation, the fraction of stars with planets, the number of habitable planets per system, the fraction where life develops, the fraction that becomes intelligent, the fraction that develops detectable technology, and how long those civilizations emit detectable signals.",
    },
    {
      question: "What did Drake originally estimate for N?",
      answer:
        "Drake's original 1961 estimate was around 10 civilizations. Using more modern astronomical data (like the discovery that most stars have planets), some optimistic estimates go as high as 15,600,000, while pessimistic ones suggest we might be alone.",
    },
    {
      question: "What is the Fermi Paradox?",
      answer:
        "If the Drake Equation suggests there should be many alien civilizations, why haven't we found any evidence of them? This contradiction is the Fermi Paradox, named after physicist Enrico Fermi who famously asked 'Where is everybody?' Proposed solutions range from the Great Filter hypothesis to the Zoo hypothesis (aliens are watching but not interfering).",
    },
  ],
  formula:
    "N = R* x fp x ne x fl x fi x fc x L, where N is the number of civilizations in our galaxy whose electromagnetic emissions are detectable.",
};
