import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hardnessConverterCalculator: CalculatorDefinition = {
  slug: "hardness-converter",
  title: "Material Hardness Converter",
  description:
    "Free material hardness converter. Convert between Rockwell (HRC/HRB), Brinell (HB), and Vickers (HV) hardness scales for metals and alloys.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "hardness converter",
    "Rockwell to Brinell",
    "HRC to HB",
    "Vickers hardness",
    "HV to HRC",
    "material hardness",
    "steel hardness conversion",
  ],
  variants: [
    {
      id: "hrc-convert",
      name: "Rockwell C (HRC) Converter",
      description: "Convert from Rockwell C to other hardness scales",
      fields: [
        {
          name: "hrc",
          label: "Rockwell C Hardness (HRC)",
          type: "number",
          placeholder: "e.g. 45",
          min: 20,
          max: 68,
        },
      ],
      calculate: (inputs) => {
        const hrc = parseFloat(inputs.hrc as string);
        if (isNaN(hrc) || hrc < 20 || hrc > 68) return null;

        // Approximate conversions based on ASTM E140
        const hv = 916.4 * Math.exp(0.0137 * hrc) - 835;
        const hb = hrc < 21 ? null : Math.round(-0.0257 * hrc * hrc + 6.4 * hrc + 104);
        const tensileApprox = (hb ? hb * 500 : null);

        return {
          primary: {
            label: "Vickers Hardness",
            value: formatNumber(Math.round(hv)),
            suffix: "HV",
          },
          details: [
            { label: "Rockwell C", value: formatNumber(hrc) + " HRC" },
            { label: "Brinell (approx)", value: hb ? formatNumber(hb) + " HB" : "N/A (out of range)" },
            { label: "Tensile Strength (approx)", value: tensileApprox ? formatNumber(tensileApprox) + " psi" : "N/A" },
          ],
          note: "Conversions are approximate. Exact values depend on material type and test conditions.",
        };
      },
    },
    {
      id: "hb-convert",
      name: "Brinell (HB) Converter",
      description: "Convert from Brinell to other hardness scales",
      fields: [
        {
          name: "hb",
          label: "Brinell Hardness (HB)",
          type: "number",
          placeholder: "e.g. 200",
          min: 80,
          max: 739,
        },
      ],
      calculate: (inputs) => {
        const hb = parseFloat(inputs.hb as string);
        if (isNaN(hb) || hb < 80 || hb > 739) return null;

        // Approximate conversions
        const hv = Math.round(hb * 1.05 + (hb > 350 ? (hb - 350) * 0.15 : 0));
        const hrc = hb < 225 ? null : Math.round(0.0426 * hb + (hb > 350 ? 0.02 * (hb - 350) : 0) - 1.5);
        const hrb = hb <= 240 ? Math.round(0.197 * hb + 52.3) : null;
        const tensile = Math.round(hb * 500);

        return {
          primary: {
            label: "Brinell Hardness",
            value: formatNumber(hb),
            suffix: "HB",
          },
          details: [
            { label: "Vickers (approx)", value: formatNumber(hv) + " HV" },
            { label: "Rockwell C (approx)", value: hrc !== null ? formatNumber(hrc) + " HRC" : "N/A (HB < 225)" },
            { label: "Rockwell B (approx)", value: hrb !== null ? formatNumber(hrb) + " HRB" : "N/A (HB > 240)" },
            { label: "Tensile Strength (approx)", value: formatNumber(tensile) + " psi" },
          ],
          note: "Conversions are approximate per ASTM E140 standards.",
        };
      },
    },
    {
      id: "hv-convert",
      name: "Vickers (HV) Converter",
      description: "Convert from Vickers to other hardness scales",
      fields: [
        {
          name: "hv",
          label: "Vickers Hardness (HV)",
          type: "number",
          placeholder: "e.g. 300",
          min: 85,
          max: 940,
        },
      ],
      calculate: (inputs) => {
        const hv = parseFloat(inputs.hv as string);
        if (isNaN(hv) || hv < 85 || hv > 940) return null;

        const hb = Math.round(hv / 1.05 - (hv > 370 ? (hv - 370) * 0.12 : 0));
        const hrc = hv < 235 ? null : Math.round(0.0602 * hv + (hv > 400 ? 0.01 * (hv - 400) : 0) + 2.5);
        const tensile = Math.round(hb * 500);

        return {
          primary: {
            label: "Vickers Hardness",
            value: formatNumber(hv),
            suffix: "HV",
          },
          details: [
            { label: "Brinell (approx)", value: formatNumber(hb) + " HB" },
            { label: "Rockwell C (approx)", value: hrc !== null ? formatNumber(hrc) + " HRC" : "N/A (HV < 235)" },
            { label: "Tensile Strength (approx)", value: formatNumber(tensile) + " psi" },
          ],
          note: "Conversions are approximate. Use ASTM E140 tables for certified values.",
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "density-calculator", "force-calculator"],
  faq: [
    {
      question: "What is the difference between Rockwell, Brinell, and Vickers hardness?",
      answer:
        "Rockwell measures depth of indentation under load. Brinell uses a steel ball to measure the diameter of indentation. Vickers uses a diamond pyramid and measures the diagonal of the impression. Each is suited for different material types and thicknesses.",
    },
    {
      question: "When should I use HRC vs HRB?",
      answer:
        "Use HRC (Rockwell C) for hardened steels and materials with hardness above about 20 HRC (225 HB). Use HRB (Rockwell B) for softer metals like mild steel, brass, and aluminum with hardness below about 100 HRB.",
    },
    {
      question: "Can I convert hardness to tensile strength?",
      answer:
        "An approximate conversion exists: Tensile Strength (psi) is roughly equal to Brinell Hardness x 500 for carbon and alloy steels. This is an estimate only and does not apply to all materials.",
    },
  ],
  formula:
    "Tensile Strength (psi) ≈ HB x 500 | HV ≈ HB x 1.05 (approximate for steels)",
};
