import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lasikCostCalculator: CalculatorDefinition = {
  slug: "lasik-cost-calculator",
  title: "LASIK Cost Calculator",
  description:
    "Estimate the cost of LASIK eye surgery by procedure type and location. Compare LASIK, PRK, and SMILE procedures with long-term savings on glasses/contacts.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "lasik cost",
    "lasik surgery price",
    "lasik eye surgery cost",
    "prk cost",
    "smile eye surgery cost",
    "laser eye surgery cost",
  ],
  variants: [
    {
      id: "procedure",
      name: "Procedure Cost",
      description: "Estimate LASIK cost by procedure type",
      fields: [
        {
          name: "procedureType",
          label: "Procedure Type",
          type: "select",
          options: [
            { label: "Traditional LASIK", value: "traditional" },
            { label: "Custom/Wavefront LASIK", value: "custom" },
            { label: "Bladeless (All-Laser) LASIK", value: "bladeless" },
            { label: "PRK", value: "prk" },
            { label: "SMILE", value: "smile" },
          ],
          defaultValue: "bladeless",
        },
        {
          name: "prescription",
          label: "Prescription Severity",
          type: "select",
          options: [
            { label: "Mild (-1 to -3 diopters)", value: "mild" },
            { label: "Moderate (-3 to -6 diopters)", value: "moderate" },
            { label: "High (-6 to -10 diopters)", value: "high" },
          ],
          defaultValue: "moderate",
        },
        {
          name: "region",
          label: "Region",
          type: "select",
          options: [
            { label: "Major city", value: "major" },
            { label: "Mid-size city", value: "mid" },
            { label: "Small city/rural", value: "small" },
          ],
          defaultValue: "mid",
        },
      ],
      calculate: (inputs) => {
        const procedureType = inputs.procedureType as string;
        const prescription = inputs.prescription as string;
        const region = inputs.region as string;

        const baseCosts: Record<string, number> = {
          traditional: 1800, custom: 2300, bladeless: 2600, prk: 2200, smile: 3000,
        };
        const prescriptionAdj: Record<string, number> = { mild: 0, moderate: 200, high: 500 };
        const regionMultipliers: Record<string, number> = { major: 1.20, mid: 1.0, small: 0.85 };

        const perEye = (baseCosts[procedureType] + (prescriptionAdj[prescription] || 0)) * (regionMultipliers[region] || 1.0);
        const bothEyes = perEye * 2;

        return {
          primary: { label: "Total Cost (Both Eyes)", value: `$${formatNumber(bothEyes, 0)}` },
          details: [
            { label: "Cost Per Eye", value: `$${formatNumber(perEye, 0)}` },
            { label: "Procedure Type", value: procedureType === "bladeless" ? "All-Laser LASIK" : procedureType.toUpperCase() },
            { label: "Typical Range", value: `$${formatNumber(bothEyes * 0.85, 0)} - $${formatNumber(bothEyes * 1.15, 0)}` },
            { label: "Financing (24 mo)", value: `$${formatNumber(bothEyes / 24, 0)}/mo` },
          ],
          note: "Prices are per eye estimates and include pre-op exams, surgery, and standard post-op care. Enhancement/touch-up policies vary by surgeon. Many providers offer interest-free financing.",
        };
      },
    },
    {
      id: "savings",
      name: "Long-Term Savings",
      description: "Compare LASIK cost vs ongoing glasses/contacts expenses",
      fields: [
        {
          name: "lasikCost",
          label: "LASIK Cost (both eyes)",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          min: 1000,
          max: 10000,
          defaultValue: 5000,
        },
        {
          name: "annualCurrent",
          label: "Annual Glasses/Contacts Cost",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          min: 50,
          max: 5000,
          defaultValue: 500,
        },
        {
          name: "years",
          label: "Years to Compare",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "years",
          min: 1,
          max: 40,
          defaultValue: 20,
        },
      ],
      calculate: (inputs) => {
        const lasikCost = parseFloat(inputs.lasikCost as string);
        const annualCost = parseFloat(inputs.annualCurrent as string);
        const years = parseFloat(inputs.years as string);
        if (!lasikCost || !annualCost || !years) return null;

        const totalWithoutLasik = annualCost * years;
        const breakEvenYears = lasikCost / annualCost;
        const netSavings = totalWithoutLasik - lasikCost;

        return {
          primary: { label: "Net Savings Over Period", value: `$${formatNumber(netSavings, 0)}` },
          details: [
            { label: "Break-Even Point", value: `${formatNumber(breakEvenYears, 1)} years` },
            { label: "Total Glasses/Contacts Cost", value: `$${formatNumber(totalWithoutLasik, 0)}` },
            { label: "LASIK Cost (one-time)", value: `$${formatNumber(lasikCost, 0)}` },
            { label: "Annual Savings After Break-Even", value: `$${formatNumber(annualCost, 0)}/yr` },
          ],
          note: "Does not account for inflation in glasses/contacts costs, which would increase savings. Some patients may need reading glasses later in life or LASIK enhancement.",
        };
      },
    },
  ],
  relatedSlugs: ["cosmetic-surgery-cost-calculator", "dental-implant-cost-calculator", "hearing-aid-cost-calculator"],
  faq: [
    {
      question: "How much does LASIK cost?",
      answer:
        "LASIK costs $2,000-$3,500 per eye on average, or $4,000-$7,000 for both eyes. Traditional LASIK is less expensive ($1,500-$2,500/eye), while all-laser bladeless LASIK and SMILE cost more ($2,500-$3,500/eye). Very low advertised prices often exclude necessary add-ons.",
    },
    {
      question: "Is LASIK worth the cost?",
      answer:
        "For most patients, LASIK pays for itself within 5-10 years compared to ongoing glasses and contacts costs. With results lasting 20+ years and a 96% satisfaction rate, it is generally considered a worthwhile investment. However, suitability depends on eye health, age, and prescription stability.",
    },
  ],
  formula:
    "Total Cost = (Base Cost + Prescription Adjustment) x Region Multiplier x 2 eyes | Break-Even = LASIK Cost / Annual Glasses Cost",
};
