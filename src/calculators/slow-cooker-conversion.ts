import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const slowCookerConversionCalculator: CalculatorDefinition = {
  slug: "slow-cooker-conversion-calculator",
  title: "Slow Cooker Conversion Calculator",
  description:
    "Free slow cooker conversion calculator. Convert oven recipes to slow cooker times and temperatures. Switch between high and low settings.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "slow cooker conversion",
    "oven to slow cooker",
    "crockpot conversion",
    "slow cooker time",
    "slow cooker high to low",
    "crock pot calculator",
  ],
  variants: [
    {
      id: "oven-to-slow",
      name: "Oven to Slow Cooker",
      description: "Convert conventional oven cooking times to slow cooker",
      fields: [
        {
          name: "ovenTime",
          label: "Oven Cooking Time (minutes)",
          type: "number",
          placeholder: "e.g. 60",
        },
        {
          name: "ovenTemp",
          label: "Oven Temperature",
          type: "select",
          options: [
            { label: "300\u00B0F (150\u00B0C)", value: "300" },
            { label: "325\u00B0F (163\u00B0C)", value: "325" },
            { label: "350\u00B0F (177\u00B0C)", value: "350" },
            { label: "375\u00B0F (191\u00B0C)", value: "375" },
            { label: "400\u00B0F (204\u00B0C)", value: "400" },
          ],
        },
        {
          name: "setting",
          label: "Slow Cooker Setting",
          type: "select",
          options: [
            { label: "Low (~200\u00B0F)", value: "low" },
            { label: "High (~300\u00B0F)", value: "high" },
          ],
        },
      ],
      calculate: (inputs) => {
        const ovenTime = inputs.ovenTime as number;
        const ovenTemp = inputs.ovenTemp as string;
        const setting = inputs.setting as string;
        if (!ovenTime || !ovenTemp || !setting) return null;

        // Conversion rules: oven time -> slow cooker time
        // Low: multiply by 4-6x, High: multiply by 2-3x
        let multiplier: number;
        if (setting === "low") {
          multiplier = ovenTime <= 45 ? 6 : ovenTime <= 90 ? 5 : 4;
        } else {
          multiplier = ovenTime <= 45 ? 3 : ovenTime <= 90 ? 2.5 : 2;
        }

        const slowMinutes = ovenTime * multiplier;
        const slowHours = slowMinutes / 60;
        const lowRange = Math.floor(slowHours * 0.9);
        const highRange = Math.ceil(slowHours * 1.1);

        const timeStr = slowHours >= 1
          ? `${Math.floor(slowHours)} hr ${Math.round(slowMinutes % 60)} min`
          : `${Math.round(slowMinutes)} min`;

        return {
          primary: {
            label: "Slow Cooker Time",
            value: timeStr,
          },
          details: [
            { label: "Original Oven Time", value: ovenTime + " minutes" },
            { label: "Original Oven Temp", value: ovenTemp + "\u00B0F" },
            { label: "Slow Cooker Setting", value: setting === "low" ? "Low (~200\u00B0F)" : "High (~300\u00B0F)" },
            { label: "Time Range", value: lowRange + " - " + highRange + " hours" },
            { label: "Time Multiplier", value: multiplier + "x" },
          ],
          note: "Add liquid when converting oven recipes to slow cooker. Reduce liquid by about 1/3 if the recipe has a lot of liquid, as slow cookers trap moisture.",
        };
      },
    },
    {
      id: "high-to-low",
      name: "High to Low Setting",
      description: "Convert between slow cooker high and low settings",
      fields: [
        {
          name: "hours",
          label: "Cooking Time (hours)",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "from",
          label: "Convert From",
          type: "select",
          options: [
            { label: "High to Low", value: "high_to_low" },
            { label: "Low to High", value: "low_to_high" },
          ],
        },
      ],
      calculate: (inputs) => {
        const hours = inputs.hours as number;
        const from = inputs.from as string;
        if (!hours || !from) return null;

        // 1 hour on high = ~2 hours on low
        const converted = from === "high_to_low" ? hours * 2 : hours / 2;

        return {
          primary: {
            label: from === "high_to_low" ? "Low Setting Time" : "High Setting Time",
            value: formatNumber(converted, 1) + " hours",
          },
          details: [
            { label: "Original Time", value: hours + " hours" },
            { label: "Original Setting", value: from === "high_to_low" ? "High" : "Low" },
            { label: "Converted Time", value: formatNumber(converted, 1) + " hours" },
            { label: "Converted Setting", value: from === "high_to_low" ? "Low" : "High" },
            { label: "Conversion Ratio", value: "1 hr High = 2 hr Low" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["meat-cooking-time-calculator", "meal-prep-calculator"],
  faq: [
    {
      question: "How do I convert oven recipes to slow cooker?",
      answer:
        "As a general rule, divide the oven temperature by the slow cooker equivalent and multiply the time. For a recipe that cooks at 350\u00B0F for 1 hour: cook on Low for 6-8 hours or High for 3-4 hours.",
    },
    {
      question: "What is the difference between high and low on a slow cooker?",
      answer:
        "Both settings reach about 209\u00B0F, but Low takes longer to get there. Low cooks at about 200\u00B0F and High at about 300\u00B0F. Generally, 1 hour on High equals about 2 hours on Low.",
    },
    {
      question: "Should I reduce liquid for slow cooker recipes?",
      answer:
        "Yes, slow cookers trap moisture under the lid, so less evaporation occurs. When converting oven recipes, reduce liquid by about one-third. The exception is soups and stews where you want extra broth.",
    },
  ],
  formula:
    "Slow Cooker Time (Low) = Oven Time x 4-6. Slow Cooker Time (High) = Oven Time x 2-3. High to Low: multiply by 2. Low to High: divide by 2. Both settings eventually reach ~209\u00B0F internally.",
};
