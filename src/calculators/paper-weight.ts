import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paperWeightCalculator: CalculatorDefinition = {
  slug: "paper-weight-calculator",
  title: "Paper Weight / GSM Converter",
  description: "Free paper weight calculator. Convert between GSM, bond weight, cover weight, and text weight for paper and cardstock selection.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["paper weight calculator", "GSM converter", "paper weight conversion", "bond weight to GSM", "cardstock weight calculator"],
  variants: [
    {
      id: "gsm-to-us",
      name: "GSM to US Weights",
      description: "Convert GSM (grams per square meter) to US paper weights",
      fields: [
        { name: "gsm", label: "Paper Weight (GSM)", type: "number", placeholder: "e.g. 80" },
      ],
      calculate: (inputs) => {
        const gsm = inputs.gsm as number;
        if (!gsm) return null;

        const bondWeight = gsm * 0.266;
        const textWeight = gsm * 0.676;
        const coverWeight = gsm * 0.370;
        const indexWeight = gsm * 0.410;
        const thickness = gsm * 0.001;

        let category: string;
        if (gsm <= 60) category = "Lightweight (tissue, tracing)";
        else if (gsm <= 90) category = "Standard office paper";
        else if (gsm <= 120) category = "Premium / letterhead";
        else if (gsm <= 170) category = "Light cardstock / brochure";
        else if (gsm <= 250) category = "Cardstock / postcard";
        else if (gsm <= 350) category = "Heavy cardstock / business card";
        else category = "Board / packaging";

        return {
          primary: { label: "Bond Weight", value: `${formatNumber(bondWeight, 0)} lb Bond` },
          details: [
            { label: "Bond / Writing weight", value: `${formatNumber(bondWeight, 1)} lb` },
            { label: "Text weight", value: `${formatNumber(textWeight, 1)} lb` },
            { label: "Cover weight", value: `${formatNumber(coverWeight, 1)} lb` },
            { label: "Index weight", value: `${formatNumber(indexWeight, 1)} lb` },
            { label: "GSM", value: `${gsm} g/m²` },
            { label: "Approx. thickness", value: `~${formatNumber(thickness, 3)} mm per sheet` },
            { label: "Paper category", value: category },
          ],
        };
      },
    },
    {
      id: "us-to-gsm",
      name: "US Weight to GSM",
      description: "Convert US paper weight to GSM",
      fields: [
        { name: "weight", label: "Paper Weight (lb)", type: "number", placeholder: "e.g. 20" },
        { name: "paperType", label: "Paper Type", type: "select", options: [
          { label: "Bond / Writing / Ledger", value: "bond" },
          { label: "Text / Book / Offset", value: "text" },
          { label: "Cover", value: "cover" },
          { label: "Index / Tag", value: "index" },
          { label: "Newsprint", value: "newsprint" },
        ], defaultValue: "bond" },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const type = inputs.paperType as string;
        if (!weight) return null;

        const conversionFactors: Record<string, number> = {
          bond: 3.76,
          text: 1.48,
          cover: 2.70,
          index: 2.44,
          newsprint: 1.63,
        };

        const factor = conversionFactors[type] || 3.76;
        const gsm = weight * factor;

        return {
          primary: { label: "GSM", value: `${formatNumber(gsm, 0)} g/m²` },
          details: [
            { label: "GSM (g/m²)", value: formatNumber(gsm, 1) },
            { label: "US weight", value: `${weight} lb ${type}` },
            { label: "Conversion factor", value: `× ${factor}` },
            { label: "Approx. thickness", value: `~${formatNumber(gsm * 0.001, 3)} mm` },
          ],
        };
      },
    },
    {
      id: "presets",
      name: "Common Paper Weights",
      description: "Quick reference for common paper types",
      fields: [
        { name: "paperUse", label: "Paper Use", type: "select", options: [
          { label: "Newspaper (45 GSM)", value: "45" },
          { label: "Copy/Printer Paper (75-80 GSM)", value: "80" },
          { label: "Letterhead (90-100 GSM)", value: "100" },
          { label: "Flyer / Handout (120 GSM)", value: "120" },
          { label: "Brochure (150 GSM)", value: "150" },
          { label: "Postcard (200 GSM)", value: "200" },
          { label: "Light Business Card (250 GSM)", value: "250" },
          { label: "Business Card (300 GSM)", value: "300" },
          { label: "Heavy Business Card (350 GSM)", value: "350" },
          { label: "Thick Cardboard (400 GSM)", value: "400" },
        ], defaultValue: "80" },
        { name: "sheets", label: "Number of Sheets", type: "number", placeholder: "e.g. 500", defaultValue: 500 },
      ],
      calculate: (inputs) => {
        const gsm = parseInt(inputs.paperUse as string) || 80;
        const sheets = (inputs.sheets as number) || 500;

        const bondWeight = gsm * 0.266;
        const letterAreaM2 = 0.2159 * 0.2794;
        const a4AreaM2 = 0.210 * 0.297;
        const sheetWeightLetter = gsm * letterAreaM2;
        const sheetWeightA4 = gsm * a4AreaM2;
        const totalWeightKg = (sheetWeightLetter * sheets) / 1000;
        const thickness = gsm * 0.001 * sheets;

        return {
          primary: { label: "Paper Weight", value: `${gsm} GSM (~${formatNumber(bondWeight, 0)} lb Bond)` },
          details: [
            { label: "GSM", value: `${gsm} g/m²` },
            { label: "US Bond weight", value: `~${formatNumber(bondWeight, 0)} lb` },
            { label: "Weight per Letter sheet", value: `${formatNumber(sheetWeightLetter, 1)} g` },
            { label: "Weight per A4 sheet", value: `${formatNumber(sheetWeightA4, 1)} g` },
            { label: `${sheets} sheets (Letter)`, value: `${formatNumber(totalWeightKg, 2)} kg (${formatNumber(totalWeightKg * 2.205, 1)} lb)` },
            { label: `Stack height (${sheets} sheets)`, value: `~${formatNumber(thickness, 1)} mm (${formatNumber(thickness / 25.4, 1)} in)` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["printing-cost-calculator", "ink-coverage-calculator", "binding-calculator"],
  faq: [
    { question: "What is GSM?", answer: "GSM (grams per square meter) is the international standard for paper weight. It measures the actual weight of one square meter of paper. Higher GSM means thicker, heavier paper. Standard copy paper is 75-80 GSM." },
    { question: "What is the difference between Bond and Text weight?", answer: "Bond and Text weights use different 'basis sizes' for measurement. 20 lb Bond = 50 lb Text = 75 GSM. The same paper can have different numbers depending on the US weight system used." },
    { question: "What GSM is best for business cards?", answer: "Business cards are typically 300-350 GSM (110-130 lb cover). Premium cards use 400+ GSM. Anything below 250 GSM feels flimsy for a business card." },
  ],
  formula: "GSM = US Bond × 3.76 | GSM = US Text × 1.48 | GSM = US Cover × 2.70 | Thickness ≈ GSM × 0.001 mm",
};
