import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dnaConcentrationCalculator: CalculatorDefinition = {
  slug: "dna-concentration-calculator",
  title: "DNA Concentration Calculator",
  description:
    "Free DNA concentration calculator. Convert between absorbance (A260), DNA concentration, and total yield for spectrophotometric measurements.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "DNA concentration",
    "A260",
    "absorbance",
    "nanodrop",
    "spectrophotometry",
    "nucleic acid quantification",
    "260/280 ratio",
  ],
  variants: [
    {
      id: "from-absorbance",
      name: "From A260 Absorbance",
      description: "Calculate DNA concentration from A260 reading",
      fields: [
        {
          name: "a260",
          label: "Absorbance at 260 nm (A260)",
          type: "number",
          placeholder: "e.g. 0.5",
          min: 0,
          step: 0.001,
        },
        {
          name: "a280",
          label: "Absorbance at 280 nm (A280)",
          type: "number",
          placeholder: "e.g. 0.27",
          min: 0,
          step: 0.001,
        },
        {
          name: "dilutionFactor",
          label: "Dilution Factor",
          type: "number",
          placeholder: "e.g. 1",
          defaultValue: 1,
          min: 1,
        },
        {
          name: "nucleicAcidType",
          label: "Nucleic Acid Type",
          type: "select",
          options: [
            { label: "dsDNA (50 µg/mL per A260)", value: "dsdna" },
            { label: "ssDNA (33 µg/mL per A260)", value: "ssdna" },
            { label: "RNA (40 µg/mL per A260)", value: "rna" },
          ],
          defaultValue: "dsdna",
        },
      ],
      calculate: (inputs) => {
        const a260 = inputs.a260 as number;
        const a280 = inputs.a280 as number;
        const df = inputs.dilutionFactor as number;
        const naType = inputs.nucleicAcidType as string;
        if (a260 == null || a260 < 0 || !df) return null;

        const factors: Record<string, number> = {
          dsdna: 50,
          ssdna: 33,
          rna: 40,
        };
        const factor = factors[naType] || 50;
        const concentration = a260 * factor * df; // µg/mL = ng/µL

        const ratio260_280 = a280 && a280 > 0 ? a260 / a280 : null;

        const purityNote = ratio260_280
          ? ratio260_280 >= 1.8 && ratio260_280 <= 2.0
            ? "Good purity for DNA"
            : ratio260_280 > 2.0
            ? "May indicate RNA contamination"
            : "May indicate protein or phenol contamination"
          : "Enter A280 to assess purity";

        const details = [
          { label: "Concentration (ng/µL)", value: formatNumber(concentration, 2) },
          { label: "Concentration (µg/mL)", value: formatNumber(concentration, 2) },
          { label: "Conversion factor", value: factor + " µg/mL per A260 unit" },
          { label: "Dilution factor", value: String(df) },
        ];

        if (ratio260_280 !== null) {
          details.push({ label: "A260/A280 ratio", value: formatNumber(ratio260_280, 2) });
        }
        details.push({ label: "Purity assessment", value: purityNote });

        return {
          primary: {
            label: "DNA Concentration",
            value: formatNumber(concentration, 2) + " ng/µL",
          },
          details,
        };
      },
    },
    {
      id: "total-yield",
      name: "Total DNA Yield",
      description: "Calculate total DNA yield from concentration and volume",
      fields: [
        {
          name: "concentration",
          label: "Concentration (ng/µL)",
          type: "number",
          placeholder: "e.g. 50",
          min: 0,
        },
        {
          name: "volume",
          label: "Volume (µL)",
          type: "number",
          placeholder: "e.g. 100",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const conc = inputs.concentration as number;
        const vol = inputs.volume as number;
        if (!conc || !vol || conc <= 0 || vol <= 0) return null;

        const totalNg = conc * vol;
        const totalUg = totalNg / 1000;

        return {
          primary: {
            label: "Total DNA Yield",
            value: totalUg >= 1 ? formatNumber(totalUg, 2) + " µg" : formatNumber(totalNg, 1) + " ng",
          },
          details: [
            { label: "Total (ng)", value: formatNumber(totalNg, 1) },
            { label: "Total (µg)", value: formatNumber(totalUg, 4) },
            { label: "Concentration", value: formatNumber(conc, 2) + " ng/µL" },
            { label: "Volume", value: formatNumber(vol, 1) + " µL" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "beer-lambert-bio-calculator",
    "pcr-primer-calculator",
    "dna-molecular-weight-calculator",
  ],
  faq: [
    {
      question: "How do you calculate DNA concentration from A260?",
      answer:
        "DNA concentration = A260 × conversion factor × dilution factor. For dsDNA the factor is 50 µg/mL per A260 unit, for ssDNA it is 33, and for RNA it is 40.",
    },
    {
      question: "What is a good 260/280 ratio?",
      answer:
        "A 260/280 ratio of ~1.8 is generally accepted as pure DNA, while ~2.0 indicates pure RNA. Ratios significantly lower suggest protein, phenol, or other contaminant presence.",
    },
  ],
  formula:
    "Concentration (µg/mL) = A260 × Factor × Dilution Factor. dsDNA factor = 50, ssDNA = 33, RNA = 40. Total yield = concentration × volume. 1 A260 unit of dsDNA ≈ 50 µg/mL.",
};
