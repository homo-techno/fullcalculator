import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dartCheckoutCalculator: CalculatorDefinition = {
  slug: "dart-checkout-calculator",
  title: "Dart Checkout Calculator",
  description: "Calculate possible dart checkout combinations for a given score remaining in a game of 501.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dart checkout", "darts finish", "dart out chart"],
  variants: [{
    id: "standard",
    name: "Dart Checkout",
    description: "Calculate possible dart checkout combinations for a given score remaining in a game of 501",
    fields: [
      { name: "remaining", label: "Score Remaining", type: "number", min: 2, max: 170, defaultValue: 80 },
      { name: "darts", label: "Darts Available", type: "select", options: [{value:"3",label:"3 Darts"},{value:"2",label:"2 Darts"},{value:"1",label:"1 Dart"}], defaultValue: "3" },
      { name: "preferDouble", label: "Preferred Double", type: "number", min: 1, max: 20, defaultValue: 16 },
    ],
    calculate: (inputs) => {
      const remaining = inputs.remaining as number;
      const darts = parseInt(inputs.darts as string);
      const prefDouble = inputs.preferDouble as number;
      if (!remaining || remaining < 2 || remaining > 170) return null;
      const doubleOut = Math.floor(remaining / 2);
      const canCheckout1 = remaining <= 40 && remaining % 2 === 0;
      const canCheckout2 = remaining <= 110;
      const canCheckout3 = remaining <= 170;
      let canFinish = false;
      if (darts >= 3 && canCheckout3) canFinish = true;
      if (darts >= 2 && canCheckout2) canFinish = true;
      if (darts >= 1 && canCheckout1) canFinish = true;
      const checkout = canCheckout1 ? "D" + (remaining / 2) : remaining <= 60 ? "S" + (remaining - prefDouble * 2) + ", D" + prefDouble : remaining <= 110 ? "T" + Math.floor((remaining - prefDouble * 2) / 3) + ", D" + prefDouble : "T20, T" + Math.floor((remaining - 40 - 60) / 3) + ", D" + prefDouble;
      return {
        primary: { label: "Checkout Possible", value: canFinish ? "Yes" : "No" },
        details: [
          { label: "Suggested Finish", value: checkout },
          { label: "Score Remaining", value: String(remaining) },
          { label: "Darts Available", value: String(darts) },
        ],
      };
    },
  }],
  relatedSlugs: ["race-pace-calculator", "skateboard-size-calculator"],
  faq: [
    { question: "What is the highest checkout in darts?", answer: "The highest possible checkout in darts is 170, achieved with two treble 20s and a bullseye (T20, T20, Bull)." },
    { question: "What does double out mean in darts?", answer: "Double out means you must finish the game by hitting a double segment. The final dart must land in a double ring to win." },
  ],
  formula: "Checkout = Combination of singles, doubles, and trebles that equal the remaining score",
};
