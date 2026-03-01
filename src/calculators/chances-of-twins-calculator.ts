import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chancesOfTwinsCalculator: CalculatorDefinition = {
  slug: "chances-of-twins-calculator",
  title: "Chances of Twins Calculator",
  description: "Estimate the probability of conceiving twins based on maternal age, family history, and fertility treatment factors.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["chances of twins", "twin probability", "having twins calculator"],
  variants: [{
    id: "standard",
    name: "Chances of Twins",
    description: "Estimate the probability of conceiving twins based on maternal age, family history, and fertility treatment factors",
    fields: [
      { name: "age", label: "Maternal Age", type: "number", suffix: "years", min: 18, max: 50, defaultValue: 32 },
      { name: "familyHistory", label: "Family History of Twins", type: "select", options: [{value:"none",label:"No family history"},{value:"maternal",label:"Maternal side"},{value:"both",label:"Both sides"}], defaultValue: "none" },
      { name: "fertilityTreatment", label: "Fertility Treatment", type: "select", options: [{value:"none",label:"None"},{value:"clomid",label:"Clomid or letrozole"},{value:"ivf",label:"IVF"}], defaultValue: "none" },
    ],
    calculate: (inputs) => {
      const age = inputs.age as number;
      const family = inputs.familyHistory as string;
      const treatment = inputs.fertilityTreatment as string;
      if (!age) return null;
      let baseRate = 3.3;
      if (age >= 30 && age < 35) baseRate = 4.5;
      else if (age >= 35 && age < 40) baseRate = 5.5;
      else if (age >= 40) baseRate = 7.0;
      if (family === "maternal") baseRate *= 1.7;
      else if (family === "both") baseRate *= 2.0;
      if (treatment === "clomid") baseRate *= 2.5;
      else if (treatment === "ivf") baseRate *= 6.0;
      baseRate = Math.min(50, baseRate);
      const singletonRate = 100 - baseRate;
      return {
        primary: { label: "Estimated Twin Probability", value: formatNumber(Math.round(baseRate * 10) / 10) + "%" },
        details: [
          { label: "Singleton Probability", value: formatNumber(Math.round(singletonRate * 10) / 10) + "%" },
          { label: "Key Factor", value: treatment !== "none" ? "Fertility treatment significantly increases odds" : family !== "none" ? "Family history increases odds" : "Age is the primary factor" },
          { label: "Baseline Rate (no factors)", value: "3.3% of all births" },
        ],
      };
    },
  }],
  relatedSlugs: ["fertility-by-age-calculator", "baby-eye-color-calculator"],
  faq: [
    { question: "What are the odds of having twins naturally?", answer: "The natural rate of twinning is approximately 3.3 percent of all births. Fraternal twins are more common than identical twins, and the rate increases with maternal age." },
    { question: "Does IVF increase the chance of twins?", answer: "Yes. IVF significantly increases twin probability, especially when multiple embryos are transferred. Single embryo transfer reduces but does not eliminate the chance of twins due to embryo splitting." },
  ],
  formula: "Twin Probability = Base Rate (by age) x Family History Multiplier x Fertility Treatment Multiplier",
};
