import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const groundingResistanceCalculator: CalculatorDefinition = {
  slug: "grounding-resistance-calculator",
  title: "Grounding Resistance Calculator",
  description:
    "Free grounding (earthing) resistance calculator. Calculate ground rod resistance using soil resistivity, rod dimensions, and NEC/IEEE grounding standards.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "grounding resistance",
    "earthing calculator",
    "ground rod calculator",
    "soil resistivity",
    "grounding system",
    "earth resistance",
  ],
  variants: [
    {
      id: "single-rod",
      name: "Single Ground Rod",
      description: "R = (ρ / 2πL) × ln(4L/d) — NBS formula for a single vertical rod",
      fields: [
        {
          name: "soilResistivity",
          label: "Soil Resistivity (Ω·m)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "rodLength",
          label: "Rod Length (m)",
          type: "number",
          placeholder: "e.g. 2.4",
          defaultValue: 2.4,
        },
        {
          name: "rodDiameter",
          label: "Rod Diameter (mm)",
          type: "select",
          options: [
            { label: "12.7 mm (1/2 inch)", value: "12.7" },
            { label: "15.87 mm (5/8 inch)", value: "15.87" },
            { label: "19.05 mm (3/4 inch)", value: "19.05" },
            { label: "25.4 mm (1 inch)", value: "25.4" },
          ],
          defaultValue: "15.87",
        },
      ],
      calculate: (inputs) => {
        const rho = inputs.soilResistivity as number;
        const length = inputs.rodLength as number;
        const diamMm = Number(inputs.rodDiameter);
        if (!rho || !length || !diamMm) return null;

        const diamM = diamMm / 1000;
        // NBS (Dwight) formula: R = (ρ / 2πL) × ln(4L/d)
        const resistance = (rho / (2 * Math.PI * length)) * Math.log(4 * length / diamM);

        const meetsNec = resistance <= 25;
        const rodsFor25 = Math.ceil(resistance / 25);
        const lengthFt = length * 3.28084;

        return {
          primary: {
            label: "Ground Resistance",
            value: `${formatNumber(resistance, 2)} Ω`,
          },
          details: [
            { label: "Ground Resistance", value: `${formatNumber(resistance, 4)} Ω` },
            { label: "NEC 250.56 Compliance", value: meetsNec ? "YES (≤ 25Ω)" : "NO (> 25Ω - add more rods)" },
            { label: "Soil Resistivity", value: `${formatNumber(rho, 0)} Ω·m` },
            { label: "Rod Length", value: `${formatNumber(length, 2)} m (${formatNumber(lengthFt, 1)} ft)` },
            { label: "Rod Diameter", value: `${diamMm} mm` },
            { label: "Est. Rods for ≤25Ω", value: `${rodsFor25} (with proper spacing)` },
          ],
          note: "NEC 250.56 requires supplemental grounding electrodes if a single rod exceeds 25Ω. Rods should be spaced at least 6 feet apart.",
        };
      },
    },
    {
      id: "parallel-rods",
      name: "Parallel Ground Rods",
      description: "Estimate combined resistance of multiple parallel ground rods",
      fields: [
        {
          name: "singleRodResistance",
          label: "Single Rod Resistance (Ω)",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "numRods",
          label: "Number of Rods",
          type: "select",
          options: [
            { label: "2 rods", value: "2" },
            { label: "3 rods", value: "3" },
            { label: "4 rods", value: "4" },
            { label: "6 rods", value: "6" },
            { label: "8 rods", value: "8" },
            { label: "10 rods", value: "10" },
          ],
          defaultValue: "2",
        },
        {
          name: "spacing",
          label: "Rod Spacing",
          type: "select",
          options: [
            { label: "1× rod length (mutual coupling ~0.55)", value: "0.55" },
            { label: "2× rod length (mutual coupling ~0.45)", value: "0.45" },
            { label: "3× rod length (mutual coupling ~0.35)", value: "0.35" },
            { label: "5× rod length (mutual coupling ~0.25)", value: "0.25" },
            { label: "10× rod length (mutual coupling ~0.15)", value: "0.15" },
          ],
          defaultValue: "0.55",
        },
      ],
      calculate: (inputs) => {
        const r1 = inputs.singleRodResistance as number;
        const n = Number(inputs.numRods);
        const coupling = Number(inputs.spacing);
        if (!r1 || !n) return null;

        // Approximate formula considering mutual coupling
        // R_total ≈ R_single/n × (1 + coupling × (n-1)/n)
        // This is a simplified model; actual values depend on exact geometry
        const effectiveFactor = 1 + coupling * (n - 1);
        const combinedR = (r1 / n) * effectiveFactor;

        const reduction = ((r1 - combinedR) / r1) * 100;
        const meetsNec = combinedR <= 25;

        return {
          primary: {
            label: "Combined Resistance",
            value: `${formatNumber(combinedR, 2)} Ω`,
          },
          details: [
            { label: "Combined Resistance", value: `${formatNumber(combinedR, 2)} Ω` },
            { label: "Single Rod Resistance", value: `${formatNumber(r1, 2)} Ω` },
            { label: "Number of Rods", value: String(n) },
            { label: "Resistance Reduction", value: `${formatNumber(reduction, 1)}%` },
            { label: "Ideal (no coupling)", value: `${formatNumber(r1 / n, 2)} Ω` },
            { label: "Coupling Effect", value: `+${formatNumber(combinedR - r1 / n, 2)} Ω` },
            { label: "NEC 250.56 Compliance", value: meetsNec ? "YES (≤ 25Ω)" : "NO (> 25Ω)" },
          ],
          note: "Mutual coupling reduces effectiveness of parallel rods. Space rods at least 2× rod length apart for better results. Values are approximate.",
        };
      },
    },
    {
      id: "soil-lookup",
      name: "Soil Resistivity Reference",
      description: "Typical soil resistivity values by soil type",
      fields: [
        {
          name: "soilType",
          label: "Soil Type",
          type: "select",
          options: [
            { label: "Marshy ground (10-50 Ω·m)", value: "30" },
            { label: "Clay (8-70 Ω·m)", value: "40" },
            { label: "Loam / Garden soil (10-150 Ω·m)", value: "50" },
            { label: "Sandy clay (50-200 Ω·m)", value: "100" },
            { label: "Sand (200-3000 Ω·m)", value: "500" },
            { label: "Gravel (300-5000 Ω·m)", value: "1000" },
            { label: "Limestone (50-400 Ω·m)", value: "200" },
            { label: "Granite / Rock (1000-50000 Ω·m)", value: "5000" },
            { label: "Concrete (wet) (30-100 Ω·m)", value: "50" },
          ],
          defaultValue: "100",
        },
        {
          name: "rodLength",
          label: "Rod Length (m)",
          type: "number",
          placeholder: "e.g. 2.4",
          defaultValue: 2.4,
        },
      ],
      calculate: (inputs) => {
        const rho = Number(inputs.soilType);
        const length = (inputs.rodLength as number) || 2.4;
        if (!rho) return null;

        const diamM = 0.01587; // 5/8" standard rod
        const resistance = (rho / (2 * Math.PI * length)) * Math.log(4 * length / diamM);

        const meetsNec = resistance <= 25;
        const rodsNeeded = Math.ceil(resistance / 25);

        return {
          primary: {
            label: "Estimated Ground Resistance",
            value: `${formatNumber(resistance, 2)} Ω`,
          },
          details: [
            { label: "Ground Resistance", value: `${formatNumber(resistance, 2)} Ω` },
            { label: "Soil Resistivity", value: `${rho} Ω·m (typical)` },
            { label: "Rod Length", value: `${formatNumber(length, 2)} m (${formatNumber(length * 3.28084, 1)} ft)` },
            { label: "Rod Diameter", value: "5/8 inch (15.87 mm)" },
            { label: "NEC Compliance", value: meetsNec ? "Likely OK (≤ 25Ω)" : `May need ${rodsNeeded}+ rods` },
          ],
          note: "Soil resistivity varies widely. Actual values should be measured with a ground resistance tester. Moisture, temperature, and depth all affect resistivity.",
        };
      },
    },
  ],
  relatedSlugs: ["resistance-calculator", "ohms-law-calculator", "electrical-load-calculator"],
  faq: [
    {
      question: "What is a good grounding resistance?",
      answer:
        "NEC 250.56 requires that if a single ground rod exceeds 25 ohms, a supplemental electrode must be added. For most residential applications, 25Ω or less is acceptable. Telecommunications typically requires 5Ω, and sensitive electronics may require 1-5Ω. Industrial and commercial facilities often target 5Ω or less.",
    },
    {
      question: "How do I reduce ground resistance?",
      answer:
        "Methods include: adding more ground rods (spaced 2× rod length apart), using longer rods, improving soil conductivity with chemical treatment (bentonite or ground enhancement material), using ground plates or ground rings, and ensuring moist soil conditions around the electrode.",
    },
    {
      question: "What factors affect soil resistivity?",
      answer:
        "Soil resistivity depends on: soil type (clay is lower, sand/gravel is higher), moisture content (wet soil conducts better), temperature (frozen soil is very resistive), mineral content (salt reduces resistivity), and depth (deeper soil may have different characteristics).",
    },
  ],
  formula:
    "Single rod: R = (ρ / 2πL) × ln(4L/d) | ρ = soil resistivity (Ω·m) | L = rod length (m) | d = rod diameter (m) | Parallel: R ≈ R₁/n × (1 + coupling factor)",
};
