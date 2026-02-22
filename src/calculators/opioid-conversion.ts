import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const opioidConversionCalculator: CalculatorDefinition = {
  slug: "opioid-conversion",
  title: "Opioid Equianalgesic Calculator",
  description: "Free opioid equianalgesic conversion calculator. Convert between opioid medications using standard morphine milligram equivalents (MME).",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["opioid conversion", "equianalgesic calculator", "morphine equivalent", "mme calculator", "opioid rotation", "pain management"],
  variants: [
    {
      id: "opioid-convert",
      name: "Opioid Equianalgesic Conversion",
      fields: [
        { name: "fromOpioid", label: "Current Opioid", type: "select", options: [
          { label: "Morphine PO", value: "morphine_po" },
          { label: "Morphine IV/IM/SC", value: "morphine_iv" },
          { label: "Hydromorphone PO", value: "hydromorphone_po" },
          { label: "Hydromorphone IV", value: "hydromorphone_iv" },
          { label: "Oxycodone PO", value: "oxycodone_po" },
          { label: "Hydrocodone PO", value: "hydrocodone_po" },
          { label: "Fentanyl IV (mcg)", value: "fentanyl_iv" },
          { label: "Codeine PO", value: "codeine_po" },
          { label: "Tramadol PO", value: "tramadol_po" },
        ] },
        { name: "fromDose", label: "Current Dose (mg or mcg for fentanyl)", type: "number", placeholder: "e.g. 10", min: 0.1, max: 10000, step: 0.1 },
        { name: "toOpioid", label: "Target Opioid", type: "select", options: [
          { label: "Morphine PO", value: "morphine_po" },
          { label: "Morphine IV/IM/SC", value: "morphine_iv" },
          { label: "Hydromorphone PO", value: "hydromorphone_po" },
          { label: "Hydromorphone IV", value: "hydromorphone_iv" },
          { label: "Oxycodone PO", value: "oxycodone_po" },
          { label: "Hydrocodone PO", value: "hydrocodone_po" },
          { label: "Fentanyl IV (mcg)", value: "fentanyl_iv" },
          { label: "Codeine PO", value: "codeine_po" },
          { label: "Tramadol PO", value: "tramadol_po" },
        ] },
      ],
      calculate: (inputs) => {
        const fromOpioid = inputs.fromOpioid as string;
        const fromDose = inputs.fromDose as number;
        const toOpioid = inputs.toOpioid as string;
        if (!fromOpioid || !fromDose || !toOpioid) return null;
        const mmeFactors: Record<string, number> = {
          morphine_po: 1, morphine_iv: 3, hydromorphone_po: 4, hydromorphone_iv: 20,
          oxycodone_po: 1.5, hydrocodone_po: 1, fentanyl_iv: 300, codeine_po: 0.15, tramadol_po: 0.1,
        };
        const fromFactor = mmeFactors[fromOpioid];
        const toFactor = mmeFactors[toOpioid];
        if (!fromFactor || !toFactor) return null;
        const mme = fromDose * fromFactor;
        const equivalentDose = mme / toFactor;
        const reducedDose = equivalentDose * 0.75;
        const opioidNames: Record<string, string> = {
          morphine_po: "Morphine PO", morphine_iv: "Morphine IV", hydromorphone_po: "Hydromorphone PO",
          hydromorphone_iv: "Hydromorphone IV", oxycodone_po: "Oxycodone PO", hydrocodone_po: "Hydrocodone PO",
          fentanyl_iv: "Fentanyl IV", codeine_po: "Codeine PO", tramadol_po: "Tramadol PO",
        };
        const unit = toOpioid === "fentanyl_iv" ? "mcg" : "mg";
        const fromUnit = fromOpioid === "fentanyl_iv" ? "mcg" : "mg";
        return {
          primary: { label: "Equivalent Dose", value: formatNumber(equivalentDose, 2) + " " + unit },
          details: [
            { label: "Calculated Equivalent", value: formatNumber(equivalentDose, 2) + " " + unit + " " + opioidNames[toOpioid] },
            { label: "With 25% Reduction", value: formatNumber(reducedDose, 2) + " " + unit + " (recommended for rotation)" },
            { label: "Oral Morphine Equivalent", value: formatNumber(mme, 1) + " mg MME" },
            { label: "From", value: formatNumber(fromDose, 1) + " " + fromUnit + " " + opioidNames[fromOpioid] },
            { label: "MME Factor (from)", value: formatNumber(fromFactor, 2) },
            { label: "MME Factor (to)", value: formatNumber(toFactor, 2) },
          ],
          note: "When rotating opioids, reduce the calculated equianalgesic dose by 25-50% due to incomplete cross-tolerance. Fentanyl doses are in mcg. Always verify calculations independently. Clinical judgment is essential.",
        };
      },
    },
  ],
  relatedSlugs: ["harris-benedict", "fluid-maintenance", "news-score"],
  faq: [
    { question: "What is equianalgesic dosing?", answer: "Equianalgesic dosing compares doses of different opioids that provide approximately equal pain relief. 30 mg oral morphine is the standard reference dose." },
    { question: "Why reduce dose when switching opioids?", answer: "A 25-50% dose reduction is recommended when rotating opioids due to incomplete cross-tolerance. Patients may be more sensitive to the new opioid." },
    { question: "What are morphine milligram equivalents (MME)?", answer: "MME standardize opioid doses to oral morphine equivalents. CDC guidelines flag prescriptions >= 50 MME/day as higher risk and >= 90 MME/day as warranting careful justification." },
  ],
  formula: "Equivalent Dose = (Current Dose x From MME Factor) / To MME Factor | Reduce by 25-50% for rotation",
};
