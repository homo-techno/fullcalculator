import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mmaReachAdvantageCalculator: CalculatorDefinition = {
  slug: "mma-reach-advantage-calculator",
  title: "MMA Reach Advantage Calculator",
  description:
    "Free MMA reach advantage and ape index calculator. Compare fighter reach, calculate ape index, and determine reach advantage in combat sports.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "mma reach calculator",
    "ape index",
    "reach advantage",
    "fighter reach",
    "wingspan calculator",
    "combat sports",
  ],
  variants: [
    {
      id: "reach-comparison",
      name: "Reach Comparison",
      description: "Compare reach between two fighters",
      fields: [
        {
          name: "reach1",
          label: "Fighter A Reach (inches)",
          type: "number",
          placeholder: "e.g. 76",
          min: 50,
          max: 100,
          step: 0.5,
        },
        {
          name: "height1",
          label: "Fighter A Height (inches)",
          type: "number",
          placeholder: "e.g. 73",
          min: 50,
          max: 90,
          step: 0.5,
        },
        {
          name: "reach2",
          label: "Fighter B Reach (inches)",
          type: "number",
          placeholder: "e.g. 70",
          min: 50,
          max: 100,
          step: 0.5,
        },
        {
          name: "height2",
          label: "Fighter B Height (inches)",
          type: "number",
          placeholder: "e.g. 70",
          min: 50,
          max: 90,
          step: 0.5,
        },
      ],
      calculate: (inputs) => {
        const reach1 = parseFloat(inputs.reach1 as string);
        const height1 = parseFloat(inputs.height1 as string);
        const reach2 = parseFloat(inputs.reach2 as string);
        const height2 = parseFloat(inputs.height2 as string);
        if (!reach1 || !height1 || !reach2 || !height2) return null;

        const reachDiff = reach1 - reach2;
        const heightDiff = height1 - height2;
        const apeA = reach1 - height1;
        const apeB = reach2 - height2;
        const apeRatioA = reach1 / height1;
        const apeRatioB = reach2 / height2;

        const advantage =
          reachDiff > 0
            ? "Fighter A"
            : reachDiff < 0
            ? "Fighter B"
            : "Even";

        return {
          primary: {
            label: "Reach Advantage",
            value:
              advantage === "Even"
                ? "Even"
                : `${advantage} by ${formatNumber(Math.abs(reachDiff), 1)}"`,
          },
          details: [
            { label: "Fighter A Reach", value: formatNumber(reach1, 1) + '"' },
            { label: "Fighter B Reach", value: formatNumber(reach2, 1) + '"' },
            { label: "Reach Difference", value: formatNumber(Math.abs(reachDiff), 1) + '"' },
            { label: "Height Difference", value: formatNumber(Math.abs(heightDiff), 1) + '"' },
            { label: "Fighter A Ape Index", value: (apeA >= 0 ? "+" : "") + formatNumber(apeA, 1) + '"' },
            { label: "Fighter B Ape Index", value: (apeB >= 0 ? "+" : "") + formatNumber(apeB, 1) + '"' },
            { label: "Fighter A Reach/Height Ratio", value: formatNumber(apeRatioA, 3) },
            { label: "Fighter B Reach/Height Ratio", value: formatNumber(apeRatioB, 3) },
          ],
        };
      },
    },
    {
      id: "ape-index",
      name: "Ape Index",
      description: "Calculate your personal ape index",
      fields: [
        {
          name: "wingspan",
          label: "Wingspan / Reach (inches)",
          type: "number",
          placeholder: "e.g. 74",
          min: 50,
          max: 100,
          step: 0.5,
        },
        {
          name: "height",
          label: "Height (inches)",
          type: "number",
          placeholder: "e.g. 72",
          min: 50,
          max: 90,
          step: 0.5,
        },
      ],
      calculate: (inputs) => {
        const wingspan = parseFloat(inputs.wingspan as string);
        const height = parseFloat(inputs.height as string);
        if (!wingspan || !height) return null;

        const apeIndex = wingspan - height;
        const apeRatio = wingspan / height;
        const wingspanCm = wingspan * 2.54;
        const heightCm = height * 2.54;

        let assessment = "Average";
        if (apeIndex >= 4) assessment = "Very Positive (Long reach advantage)";
        else if (apeIndex >= 2) assessment = "Positive (Slight reach advantage)";
        else if (apeIndex > -2) assessment = "Average (Neutral)";
        else assessment = "Negative (Shorter reach)";

        return {
          primary: {
            label: "Ape Index",
            value: (apeIndex >= 0 ? "+" : "") + formatNumber(apeIndex, 1) + '"',
          },
          details: [
            { label: "Reach/Height Ratio", value: formatNumber(apeRatio, 3) },
            { label: "Assessment", value: assessment },
            { label: "Wingspan", value: formatNumber(wingspan, 1) + '" (' + formatNumber(wingspanCm, 1) + " cm)" },
            { label: "Height", value: formatNumber(height, 1) + '" (' + formatNumber(heightCm, 1) + " cm)" },
          ],
          note: "Average ape index is 0 (reach = height). Most UFC champions have a positive ape index (+2 to +5 inches).",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "percentage-calculator", "body-fat-calculator"],
  faq: [
    {
      question: "What is ape index in MMA?",
      answer:
        "Ape index is the difference between a person's arm span (wingspan) and their height. A positive ape index means your reach exceeds your height, which is advantageous in combat sports. Jon Jones has an ape index of +12 inches, one of the highest in UFC history.",
    },
    {
      question: "Does reach advantage matter in MMA?",
      answer:
        "Reach advantage is significant in striking-heavy fights, allowing fighters to hit opponents from farther away. Studies show fighters with a 3+ inch reach advantage win approximately 55-60% of UFC bouts, though skill, speed, and strategy can overcome reach disadvantages.",
    },
    {
      question: "What is the average reach in the UFC?",
      answer:
        "Average UFC fighter reach varies by weight class: Flyweight ~67 inches, Welterweight ~73 inches, Light Heavyweight ~76 inches, Heavyweight ~77 inches. The longest recorded UFC reach is 84 inches.",
    },
  ],
  formula:
    "Ape Index = Wingspan - Height | Reach Ratio = Wingspan / Height | Reach Advantage = Fighter A Reach - Fighter B Reach",
};
