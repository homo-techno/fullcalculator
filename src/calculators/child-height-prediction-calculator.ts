import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const childHeightPredictionCalculator: CalculatorDefinition = {
  slug: "child-height-prediction-calculator",
  title: "Child Height Prediction Calculator",
  description: "Predict a child predicted adult height based on parental heights and the mid-parental height method.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["child height prediction", "adult height predictor", "how tall will my child be"],
  variants: [{
    id: "standard",
    name: "Child Height Prediction",
    description: "Predict a child predicted adult height based on parental heights and the mid-parental height method",
    fields: [
      { name: "fatherHeight", label: "Father Height", type: "number", suffix: "inches", min: 55, max: 85, step: 0.5, defaultValue: 70 },
      { name: "motherHeight", label: "Mother Height", type: "number", suffix: "inches", min: 50, max: 80, step: 0.5, defaultValue: 65 },
      { name: "childSex", label: "Child Sex", type: "select", options: [{value:"male",label:"Male"},{value:"female",label:"Female"}], defaultValue: "male" },
    ],
    calculate: (inputs) => {
      const dad = inputs.fatherHeight as number;
      const mom = inputs.motherHeight as number;
      const sex = inputs.childSex as string;
      if (!dad || !mom || dad <= 0 || mom <= 0) return null;
      let predicted;
      if (sex === "male") {
        predicted = (dad + mom + 5) / 2;
      } else {
        predicted = (dad + mom - 5) / 2;
      }
      const rangeLow = predicted - 2;
      const rangeHigh = predicted + 2;
      const ft = Math.floor(predicted / 12);
      const inches = Math.round((predicted - ft * 12) * 10) / 10;
      const cm = Math.round(predicted * 2.54 * 10) / 10;
      return {
        primary: { label: "Predicted Adult Height", value: ft + " ft " + formatNumber(inches) + " in (" + formatNumber(cm) + " cm)" },
        details: [
          { label: "Range", value: formatNumber(Math.round(rangeLow * 10) / 10) + " - " + formatNumber(Math.round(rangeHigh * 10) / 10) + " inches" },
          { label: "Mid-Parental Average", value: formatNumber(Math.round((dad + mom) / 2 * 10) / 10) + " inches" },
          { label: "Method", value: "Mid-Parental Height (Galton)" },
        ],
      };
    },
  }],
  relatedSlugs: ["pediatric-bmi-percentile-calculator", "fetal-weight-percentile-calculator"],
  faq: [
    { question: "How accurate is the mid-parental height method?", answer: "The mid-parental height method is accurate within about 2 inches for most children. However, nutrition, health conditions, and other genetic factors can cause actual height to differ from the prediction." },
    { question: "Do boys and girls use different formulas?", answer: "Yes. For boys, 5 inches are added to the average of the parental heights. For girls, 5 inches are subtracted. This accounts for the average height difference between males and females." },
  ],
  formula: "Boys = (Father Height + Mother Height + 5) / 2; Girls = (Father Height + Mother Height - 5) / 2",
};
