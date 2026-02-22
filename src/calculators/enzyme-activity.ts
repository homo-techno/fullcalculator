import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const enzymeActivityCalculator: CalculatorDefinition = {
  slug: "enzyme-activity-calculator",
  title: "Enzyme Activity Calculator",
  description:
    "Free enzyme activity calculator. Calculate enzyme activity in units, specific activity, and turnover number from reaction data.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "enzyme activity",
    "specific activity",
    "turnover number",
    "kcat",
    "enzyme unit",
    "IU",
    "catalysis",
  ],
  variants: [
    {
      id: "activity",
      name: "Calculate Enzyme Activity",
      description:
        "Calculate enzyme activity (U) from amount of product formed per time",
      fields: [
        {
          name: "productAmount",
          label: "Product Formed (µmol)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
        },
        {
          name: "time",
          label: "Reaction Time (minutes)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
        },
        {
          name: "volume",
          label: "Reaction Volume (mL)",
          type: "number",
          placeholder: "e.g. 1",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const product = inputs.productAmount as number;
        const time = inputs.time as number;
        const volume = inputs.volume as number;
        if (!product || !time || !volume || product <= 0 || time <= 0 || volume <= 0)
          return null;

        const activity = product / time; // U = µmol/min
        const volumetricActivity = activity / volume; // U/mL
        const nkat = activity * 16.67; // 1 U = 16.67 nkat

        return {
          primary: {
            label: "Enzyme Activity",
            value: formatNumber(activity, 4) + " U",
          },
          details: [
            { label: "Activity (U = µmol/min)", value: formatNumber(activity, 4) },
            { label: "Volumetric activity", value: formatNumber(volumetricActivity, 4) + " U/mL" },
            { label: "Activity (nkat)", value: formatNumber(nkat, 2) },
            { label: "Product formed", value: formatNumber(product, 4) + " µmol" },
            { label: "Reaction time", value: formatNumber(time, 2) + " min" },
            { label: "Reaction volume", value: formatNumber(volume, 2) + " mL" },
          ],
        };
      },
    },
    {
      id: "specific-activity",
      name: "Specific Activity & Turnover Number",
      description: "Calculate specific activity and kcat from enzyme and activity data",
      fields: [
        {
          name: "activity",
          label: "Total Activity (U)",
          type: "number",
          placeholder: "e.g. 100",
          min: 0,
        },
        {
          name: "proteinAmount",
          label: "Total Protein (mg)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
        },
        {
          name: "enzymeMW",
          label: "Enzyme Molecular Weight (Da)",
          type: "number",
          placeholder: "e.g. 50000",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const activity = inputs.activity as number;
        const protein = inputs.proteinAmount as number;
        const mw = inputs.enzymeMW as number;
        if (!activity || !protein || activity <= 0 || protein <= 0) return null;

        const specificActivity = activity / protein; // U/mg

        const details = [
          { label: "Specific activity", value: formatNumber(specificActivity, 2) + " U/mg" },
          { label: "Total activity", value: formatNumber(activity, 2) + " U" },
          { label: "Total protein", value: formatNumber(protein, 4) + " mg" },
        ];

        if (mw && mw > 0) {
          // kcat = (specific activity * MW) / (1e6 µmol conversion)
          // specific activity in U/mg = µmol/(min·mg)
          // kcat in s⁻¹ = (U/mg × MW in g/mol) / (1000 × 60)
          const kcat = (specificActivity * mw) / (1000 * 60);
          details.push({ label: "Turnover number (kcat)", value: formatNumber(kcat, 2) + " s⁻¹" });
          details.push({ label: "Enzyme MW", value: formatNumber(mw, 0) + " Da" });
        }

        return {
          primary: {
            label: "Specific Activity",
            value: formatNumber(specificActivity, 2) + " U/mg",
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: [
    "michaelis-menten-calculator",
    "protein-molecular-weight-calculator",
    "beer-lambert-bio-calculator",
  ],
  faq: [
    {
      question: "What is an enzyme unit (U)?",
      answer:
        "One enzyme unit (U) is defined as the amount of enzyme that catalyzes the conversion of 1 µmol of substrate per minute under specified conditions. The SI unit is the katal: 1 U = 16.67 nkat.",
    },
    {
      question: "What is specific activity?",
      answer:
        "Specific activity is the enzyme activity per mg of total protein (U/mg). It measures enzyme purity — higher specific activity indicates a purer enzyme preparation.",
    },
    {
      question: "What is turnover number (kcat)?",
      answer:
        "Turnover number (kcat) is the number of substrate molecules converted to product per enzyme molecule per second. It reflects the intrinsic catalytic efficiency of the enzyme.",
    },
  ],
  formula:
    "Activity (U) = µmol product / min. Specific activity = U / mg protein. kcat = (Specific activity × MW) / (1000 × 60) in s⁻¹. 1 U = 16.67 nkat.",
};
