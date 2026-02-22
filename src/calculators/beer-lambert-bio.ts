import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beerLambertBioCalculator: CalculatorDefinition = {
  slug: "beer-lambert-bio-calculator",
  title: "Beer-Lambert Law (Biology) Calculator",
  description:
    "Free Beer-Lambert law calculator for biology. Calculate absorbance, concentration, or optical density for biological samples and growth measurements.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "beer-lambert",
    "absorbance",
    "OD600",
    "optical density",
    "bacterial growth",
    "spectrophotometry",
    "biology",
  ],
  variants: [
    {
      id: "od600",
      name: "OD600 Bacterial Growth",
      description:
        "Estimate bacterial cell density from OD600 optical density reading",
      fields: [
        {
          name: "od600",
          label: "OD600 Reading",
          type: "number",
          placeholder: "e.g. 0.5",
          min: 0,
          step: 0.01,
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
          name: "conversionFactor",
          label: "Cells per OD600 unit (×10⁸ cells/mL)",
          type: "number",
          placeholder: "e.g. 8",
          defaultValue: 8,
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const od = inputs.od600 as number;
        const df = inputs.dilutionFactor as number;
        const cf = inputs.conversionFactor as number;
        if (od == null || od < 0 || !df || !cf) return null;

        const correctedOD = od * df;
        const cellDensity = correctedOD * cf * 1e8; // cells/mL

        const growthPhase =
          correctedOD < 0.1
            ? "Lag phase"
            : correctedOD < 0.3
            ? "Early exponential"
            : correctedOD <= 0.8
            ? "Mid-exponential (ideal for experiments)"
            : correctedOD <= 1.5
            ? "Late exponential"
            : "Stationary phase (OD may be non-linear)";

        return {
          primary: {
            label: "Estimated Cell Density",
            value: cellDensity.toExponential(2) + " cells/mL",
          },
          details: [
            { label: "Corrected OD600", value: formatNumber(correctedOD, 3) },
            { label: "Raw OD600 reading", value: formatNumber(od, 3) },
            { label: "Dilution factor", value: String(df) },
            { label: "Growth phase", value: growthPhase },
            {
              label: "Conversion used",
              value: cf + " × 10⁸ cells/mL per OD600",
            },
          ],
          note:
            correctedOD > 1.0
              ? "OD > 1.0 may not be linear. Consider diluting and re-measuring."
              : undefined,
        };
      },
    },
    {
      id: "absorbance-calc",
      name: "Absorbance from Transmittance",
      description: "Convert percent transmittance to absorbance",
      fields: [
        {
          name: "percentT",
          label: "Percent Transmittance (%T)",
          type: "number",
          placeholder: "e.g. 50",
          min: 0.001,
          max: 100,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const pctT = inputs.percentT as number;
        if (!pctT || pctT <= 0 || pctT > 100) return null;

        const T = pctT / 100;
        const A = -Math.log10(T);

        return {
          primary: {
            label: "Absorbance (A)",
            value: formatNumber(A, 4),
          },
          details: [
            { label: "Transmittance (T)", value: formatNumber(T, 4) },
            { label: "% Transmittance", value: formatNumber(pctT, 2) + "%" },
            { label: "% Absorbed", value: formatNumber(100 - pctT, 2) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "dna-concentration-calculator",
    "generation-time-calculator",
    "hemocytometer-calculator",
  ],
  faq: [
    {
      question: "What is OD600?",
      answer:
        "OD600 is the optical density of a cell culture measured at 600 nm wavelength. It estimates bacterial cell density. An OD600 of 1.0 corresponds to roughly 8 × 10⁸ cells/mL for E. coli, though this varies by species.",
    },
    {
      question: "When is OD600 not linear?",
      answer:
        "OD600 readings above ~1.0 are typically outside the linear range of most spectrophotometers. At high densities, multiple scattering causes underestimation. Dilute the sample and re-measure for accuracy.",
    },
    {
      question: "What is the relationship between absorbance and transmittance?",
      answer:
        "Absorbance A = −log₁₀(T) = −log₁₀(%T/100). An absorbance of 1 corresponds to 10% transmittance; absorbance of 2 corresponds to 1% transmittance.",
    },
  ],
  formula:
    "A = −log₁₀(T). Cell density ≈ OD600 × conversion factor (e.g., 8 × 10⁸ cells/mL for E. coli). Corrected OD = raw OD × dilution factor.",
};
