import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function combination(n: number, r: number): number {
  if (r > n || r < 0) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

export const dAndDDiceCalculator: CalculatorDefinition = {
  slug: "d-and-d-dice-calculator",
  title: "D&D Dice Calculator",
  description:
    "Free D&D dice probability calculator. Calculate statistics for any dice roll notation (d4, d6, d8, d10, d12, d20, d100) with modifiers.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "D&D dice calculator",
    "dice probability",
    "DnD dice roller",
    "d20 probability",
    "dice notation",
    "RPG dice",
    "tabletop dice",
  ],
  variants: [
    {
      id: "standard-roll",
      name: "Dice Roll Statistics",
      description: "Calculate min, max, average, and probability for standard dice rolls",
      fields: [
        {
          name: "numDice",
          label: "Number of Dice",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 20,
          defaultValue: 1,
        },
        {
          name: "dieType",
          label: "Die Type",
          type: "select",
          options: [
            { label: "d4", value: "4" },
            { label: "d6", value: "6" },
            { label: "d8", value: "8" },
            { label: "d10", value: "10" },
            { label: "d12", value: "12" },
            { label: "d20", value: "20" },
            { label: "d100 (percentile)", value: "100" },
          ],
          defaultValue: "20",
        },
        {
          name: "modifier",
          label: "Modifier (+/-)",
          type: "number",
          placeholder: "e.g. 5",
          defaultValue: 0,
        },
        {
          name: "target",
          label: "Target Number (to meet or beat)",
          type: "number",
          placeholder: "e.g. 15",
        },
      ],
      calculate: (inputs) => {
        const numDice = (inputs.numDice as number) || 1;
        const sides = parseInt(inputs.dieType as string) || 20;
        const modifier = (inputs.modifier as number) || 0;
        const target = inputs.target as number;

        if (numDice < 1 || sides < 2) return null;

        const minRoll = numDice + modifier;
        const maxRoll = numDice * sides + modifier;
        const average = (numDice * (sides + 1)) / 2 + modifier;
        const totalOutcomes = Math.pow(sides, numDice);
        const notation = `${numDice}d${sides}${modifier > 0 ? "+" + modifier : modifier < 0 ? modifier : ""}`;

        const details: { label: string; value: string }[] = [
          { label: "Dice Notation", value: notation },
          { label: "Minimum Roll", value: formatNumber(minRoll, 0) },
          { label: "Maximum Roll", value: formatNumber(maxRoll, 0) },
          { label: "Average Roll", value: formatNumber(average, 1) },
          { label: "Total Outcomes", value: formatNumber(totalOutcomes, 0) },
        ];

        if (target && numDice <= 10 && sides <= 20) {
          const targetRaw = target - modifier;
          // Count ways to roll >= targetRaw on numDice x sides
          let waysToMeet = 0;
          if (targetRaw <= numDice) {
            waysToMeet = totalOutcomes; // always meet
          } else if (targetRaw > numDice * sides) {
            waysToMeet = 0; // impossible
          } else {
            // Inclusion-exclusion for sum >= targetRaw
            for (let sum = targetRaw; sum <= numDice * sides; sum++) {
              let ways = 0;
              for (let i = 0; i <= numDice; i++) {
                const remaining = sum - numDice - i * sides;
                if (remaining < 0) break;
                const sign = i % 2 === 0 ? 1 : -1;
                let cni = 1;
                for (let j = 0; j < i; j++) cni = (cni * (numDice - j)) / (j + 1);
                let cnr = 1;
                for (let j = 0; j < numDice - 1; j++) cnr = (cnr * (remaining + numDice - 1 - j)) / (j + 1);
                ways += sign * cni * cnr;
              }
              waysToMeet += ways;
            }
          }
          const prob = waysToMeet / totalOutcomes;
          details.push({ label: `P(roll >= ${target})`, value: `${formatNumber(prob * 100, 2)}%` });
          details.push({ label: `P(roll < ${target})`, value: `${formatNumber((1 - prob) * 100, 2)}%` });
        } else if (target && numDice === 1) {
          const targetRaw = target - modifier;
          const successSides = Math.max(0, sides - targetRaw + 1);
          const prob = successSides / sides;
          details.push({ label: `P(roll >= ${target})`, value: `${formatNumber(prob * 100, 2)}%` });
        }

        return {
          primary: { label: `${notation} Average`, value: formatNumber(average, 1) },
          details,
        };
      },
    },
    {
      id: "advantage",
      name: "Advantage / Disadvantage",
      description: "Calculate the effect of rolling with advantage or disadvantage (D&D 5e)",
      fields: [
        {
          name: "rollType",
          label: "Roll Type",
          type: "select",
          options: [
            { label: "Advantage (roll 2d20, take higher)", value: "advantage" },
            { label: "Disadvantage (roll 2d20, take lower)", value: "disadvantage" },
            { label: "Super Advantage (roll 3d20, take highest)", value: "super_advantage" },
            { label: "Elven Accuracy (roll 3d20, take highest)", value: "elven_accuracy" },
          ],
          defaultValue: "advantage",
        },
        {
          name: "target",
          label: "Target DC / AC",
          type: "number",
          placeholder: "e.g. 15",
          min: 1,
          max: 20,
        },
        {
          name: "modifier",
          label: "Modifier",
          type: "number",
          placeholder: "e.g. 7",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const rollType = inputs.rollType as string;
        const target = inputs.target as number;
        const modifier = (inputs.modifier as number) || 0;
        if (!target) return null;

        const targetRaw = target - modifier;
        const sides = 20;

        let probNormal = 0;
        let probSpecial = 0;
        let avgNormal = 10.5;
        let avgSpecial = 0;

        if (targetRaw <= 1) {
          probNormal = 1;
          probSpecial = 1;
        } else if (targetRaw > 20) {
          probNormal = 0;
          probSpecial = 0;
        } else {
          probNormal = (21 - targetRaw) / 20;
        }

        if (rollType === "advantage" || rollType === "super_advantage" || rollType === "elven_accuracy") {
          const numDice = rollType === "advantage" ? 2 : 3;
          // P(max >= targetRaw) = 1 - P(all < targetRaw)
          const pAllBelow = Math.pow(Math.max(0, Math.min(targetRaw - 1, 20)) / 20, numDice);
          probSpecial = 1 - pAllBelow;

          // Average of max of N d20
          if (numDice === 2) {
            avgSpecial = 0;
            for (let k = 1; k <= 20; k++) {
              avgSpecial += k * ((2 * k - 1) / 400);
            }
          } else {
            avgSpecial = 0;
            for (let k = 1; k <= 20; k++) {
              const pMaxEqK = Math.pow(k / 20, 3) - Math.pow((k - 1) / 20, 3);
              avgSpecial += k * pMaxEqK;
            }
          }
        } else {
          // Disadvantage: P(min >= targetRaw) = P(both >= targetRaw)
          const pEachAbove = Math.max(0, (21 - targetRaw)) / 20;
          probSpecial = Math.pow(pEachAbove, 2);

          avgSpecial = 0;
          for (let k = 1; k <= 20; k++) {
            const pMinEqK = Math.pow((21 - k) / 20, 2) - Math.pow((20 - k) / 20, 2);
            avgSpecial += k * pMinEqK;
          }
        }

        const label = rollType === "advantage" ? "Advantage" :
          rollType === "disadvantage" ? "Disadvantage" :
          rollType === "super_advantage" ? "Super Advantage" : "Elven Accuracy";

        return {
          primary: { label: `P(>= ${target}) with ${label}`, value: formatNumber(probSpecial * 100, 1) + "%" },
          details: [
            { label: "Normal Roll Chance", value: formatNumber(probNormal * 100, 1) + "%" },
            { label: `${label} Chance`, value: formatNumber(probSpecial * 100, 1) + "%" },
            { label: "Improvement", value: formatNumber((probSpecial - probNormal) * 100, 1) + " percentage points" },
            { label: "Normal Average (d20)", value: formatNumber(avgNormal, 1) },
            { label: `${label} Average`, value: formatNumber(avgSpecial, 2) },
            { label: "Modifier", value: `+${modifier}` },
            { label: "Raw Target Needed", value: `${targetRaw} on the die` },
          ],
        };
      },
    },
    {
      id: "ability-scores",
      name: "Ability Score Generation",
      description: "Statistics for the 4d6 drop lowest ability score method",
      fields: [
        {
          name: "method",
          label: "Generation Method",
          type: "select",
          options: [
            { label: "4d6 drop lowest", value: "4d6drop1" },
            { label: "3d6 (standard)", value: "3d6" },
            { label: "2d6+6", value: "2d6plus6" },
          ],
          defaultValue: "4d6drop1",
        },
      ],
      calculate: (inputs) => {
        const method = inputs.method as string;

        let avg = 0;
        let min = 0;
        let max = 0;
        let description = "";

        if (method === "4d6drop1") {
          avg = 12.24;
          min = 3;
          max = 18;
          description = "Roll 4d6, drop the lowest die";
        } else if (method === "3d6") {
          avg = 10.5;
          min = 3;
          max = 18;
          description = "Roll 3d6, sum all";
        } else {
          avg = 13;
          min = 8;
          max = 18;
          description = "Roll 2d6 + 6";
        }

        const totalAvg = avg * 6;
        const totalPointBuy = 27; // standard point buy budget

        return {
          primary: { label: "Average Single Score", value: formatNumber(avg, 2) },
          details: [
            { label: "Method", value: description },
            { label: "Minimum Possible", value: `${min}` },
            { label: "Maximum Possible", value: `${max}` },
            { label: "Average for 6 Scores", value: formatNumber(totalAvg, 1) },
            { label: "Standard Point Buy Budget", value: `${totalPointBuy} points (for comparison)` },
            { label: "Standard Array", value: "15, 14, 13, 12, 10, 8" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dice-roller-calculator", "card-probability-calculator", "probability-calculator"],
  faq: [
    {
      question: "What does advantage do in D&D 5e?",
      answer:
        "Advantage means rolling two d20s and taking the higher result. On average, advantage gives you about a +3.3 to +5 effective bonus depending on the target DC. It's most impactful when you need to roll around 10-11 on the die.",
    },
    {
      question: "What dice do you need for D&D?",
      answer:
        "A standard D&D dice set includes: d4, d6, d8, d10, d12, d20, and a percentile die (d100/d10). The d20 is used most often for attacks, saves, and ability checks. Damage dice vary by weapon and spell.",
    },
    {
      question: "Is 4d6 drop lowest better than standard array?",
      answer:
        "On average, 4d6 drop lowest produces a total of about 73.5 across 6 scores, which is slightly higher than the standard array total of 72. However, 4d6 has more variance, so you might get scores much higher or lower than the standard array.",
    },
  ],
  formula:
    "Average NdS = N x (S+1)/2 | P(d20 >= target) = (21 - target) / 20 | Advantage P(>= t) = 1 - ((t-1)/20)^2 | Disadvantage P(>= t) = ((21-t)/20)^2",
};
