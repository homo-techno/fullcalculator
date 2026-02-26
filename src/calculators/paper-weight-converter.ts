import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paperWeightConverterCalculator: CalculatorDefinition = {
  slug: "paper-weight-converter",
  title: "Paper Weight / GSM Converter",
  description:
    "Free paper weight converter. Convert between GSM (g/m²), US basis weight (lbs), and points. Compare bond, text, cover, and index paper weights.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "paper weight converter",
    "GSM converter",
    "basis weight",
    "paper thickness",
    "bond weight to GSM",
    "cover weight",
    "paper stock calculator",
  ],
  variants: [
    {
      id: "gsm-to-basis",
      name: "GSM to US Basis Weight",
      description: "Convert GSM to US basis weight by paper type",
      fields: [
        {
          name: "gsm",
          label: "Paper Weight (GSM / g/m²)",
          type: "number",
          placeholder: "e.g. 120",
        },
        {
          name: "paperType",
          label: "US Paper Category",
          type: "select",
          options: [
            { label: "Bond / Writing (17x22)", value: "bond" },
            { label: "Text / Book (25x38)", value: "text" },
            { label: "Cover (20x26)", value: "cover" },
            { label: "Index (25.5x30.5)", value: "index" },
            { label: "Bristol (22.5x28.5)", value: "bristol" },
            { label: "Tag (24x36)", value: "tag" },
          ],
          defaultValue: "bond",
        },
      ],
      calculate: (inputs) => {
        const gsm = parseFloat(inputs.gsm as string);
        const paperType = inputs.paperType as string;
        if (isNaN(gsm) || gsm <= 0) return null;

        // Conversion factors: GSM to basis weight
        // Factor = ream area in sq meters / 453.592 (grams per pound) * 500 sheets
        const factors: Record<string, { factor: number; sheetSize: string }> = {
          "bond": { factor: 3.7597, sheetSize: "17 x 22 in" },
          "text": { factor: 1.4806, sheetSize: "25 x 38 in" },
          "cover": { factor: 2.7042, sheetSize: "20 x 26 in" },
          "index": { factor: 1.8107, sheetSize: "25.5 x 30.5 in" },
          "bristol": { factor: 2.2825, sheetSize: "22.5 x 28.5 in" },
          "tag": { factor: 1.6307, sheetSize: "24 x 36 in" },
        };

        const f = factors[paperType];
        if (!f) return null;

        const basisWeight = gsm / f.factor;

        return {
          primary: {
            label: "US Basis Weight",
            value: formatNumber(basisWeight, 1),
            suffix: "lbs",
          },
          details: [
            { label: "GSM", value: formatNumber(gsm) + " g/m²" },
            { label: "Paper Category", value: paperType.charAt(0).toUpperCase() + paperType.slice(1) },
            { label: "Basic Sheet Size", value: f.sheetSize },
            { label: "Approximate Points", value: formatNumber(gsm * 0.0025 * 1000, 1) + " pt" },
          ],
        };
      },
    },
    {
      id: "basis-to-gsm",
      name: "US Basis Weight to GSM",
      description: "Convert US basis weight (lbs) to GSM",
      fields: [
        {
          name: "basisWeight",
          label: "Basis Weight (lbs)",
          type: "number",
          placeholder: "e.g. 80",
        },
        {
          name: "paperType",
          label: "US Paper Category",
          type: "select",
          options: [
            { label: "Bond / Writing (17x22)", value: "bond" },
            { label: "Text / Book (25x38)", value: "text" },
            { label: "Cover (20x26)", value: "cover" },
            { label: "Index (25.5x30.5)", value: "index" },
          ],
          defaultValue: "bond",
        },
      ],
      calculate: (inputs) => {
        const basisWeight = parseFloat(inputs.basisWeight as string);
        const paperType = inputs.paperType as string;
        if (isNaN(basisWeight) || basisWeight <= 0) return null;

        const factors: Record<string, number> = {
          "bond": 3.7597,
          "text": 1.4806,
          "cover": 2.7042,
          "index": 1.8107,
        };

        const f = factors[paperType];
        if (!f) return null;

        const gsm = basisWeight * f;

        return {
          primary: {
            label: "Paper Weight (GSM)",
            value: formatNumber(gsm, 1),
            suffix: "g/m²",
          },
          details: [
            { label: "Basis Weight", value: formatNumber(basisWeight) + " lbs" },
            { label: "Paper Category", value: paperType.charAt(0).toUpperCase() + paperType.slice(1) },
            { label: "Approximate Thickness", value: formatNumber(gsm * 0.001, 3) + " mm" },
          ],
        };
      },
    },
    {
      id: "common-papers",
      name: "Common Paper Weights",
      description: "Reference guide for common paper stocks",
      fields: [
        {
          name: "commonPaper",
          label: "Common Paper Type",
          type: "select",
          options: [
            { label: "Copy Paper (20lb Bond)", value: "copy" },
            { label: "Letterhead (24lb Bond)", value: "letterhead" },
            { label: "Brochure (80lb Text)", value: "brochure" },
            { label: "Postcard (80lb Cover)", value: "postcard" },
            { label: "Business Card (100lb Cover)", value: "bizcard" },
            { label: "Cardstock (110lb Index)", value: "cardstock" },
            { label: "Heavy Cardstock (14pt)", value: "heavycard" },
            { label: "Newspaper", value: "newspaper" },
          ],
          defaultValue: "copy",
        },
      ],
      calculate: (inputs) => {
        const commonPaper = inputs.commonPaper as string;

        const papers: Record<string, { name: string; gsm: number; basisLbs: string; thickness: string; use: string }> = {
          "copy": { name: "Copy Paper", gsm: 75, basisLbs: "20 lb Bond", thickness: "0.10 mm", use: "Everyday printing, copiers" },
          "letterhead": { name: "Letterhead", gsm: 90, basisLbs: "24 lb Bond", thickness: "0.12 mm", use: "Professional letters, forms" },
          "brochure": { name: "Brochure Stock", gsm: 118, basisLbs: "80 lb Text", thickness: "0.15 mm", use: "Brochures, flyers, inserts" },
          "postcard": { name: "Postcard Stock", gsm: 216, basisLbs: "80 lb Cover", thickness: "0.28 mm", use: "Postcards, invitations" },
          "bizcard": { name: "Business Card", gsm: 270, basisLbs: "100 lb Cover", thickness: "0.35 mm", use: "Business cards, covers" },
          "cardstock": { name: "Cardstock", gsm: 199, basisLbs: "110 lb Index", thickness: "0.25 mm", use: "Index cards, dividers" },
          "heavycard": { name: "Heavy Cardstock", gsm: 350, basisLbs: "130 lb Cover", thickness: "0.36 mm", use: "Premium cards, packaging" },
          "newspaper": { name: "Newsprint", gsm: 49, basisLbs: "30 lb Text", thickness: "0.07 mm", use: "Newspapers, circulars" },
        };

        const p = papers[commonPaper];
        if (!p) return null;

        return {
          primary: {
            label: p.name,
            value: formatNumber(p.gsm),
            suffix: "GSM",
          },
          details: [
            { label: "US Basis Weight", value: p.basisLbs },
            { label: "Approx Thickness", value: p.thickness },
            { label: "Common Use", value: p.use },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "area-converter-calculator", "dpi-ppi-calc"],
  faq: [
    {
      question: "What does GSM mean for paper?",
      answer:
        "GSM stands for grams per square meter. It measures paper weight (density) universally. Higher GSM means thicker, heavier paper. Standard copy paper is 75-80 GSM, while cardstock is 200-350 GSM.",
    },
    {
      question: "Why are US paper weights confusing?",
      answer:
        "US basis weight varies by paper category because each type uses a different basic sheet size. A 80 lb cover stock is much heavier than 80 lb text stock. GSM eliminates this confusion by using a single universal measurement.",
    },
    {
      question: "What paper weight should I use for business cards?",
      answer:
        "Business cards typically use 270-350 GSM (100-130 lb cover). The most common is 300 GSM (110 lb cover). Thicker cards feel more premium and professional. Some cards use 14pt or 16pt which refers to caliper thickness.",
    },
  ],
  formula:
    "GSM = Basis Weight x Conversion Factor | Factor varies by paper category (Bond: 3.76, Text: 1.48, Cover: 2.70)",
};
