import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const forceUnits: Record<string, number> = {
  N: 1, kN: 1000, lbf: 4.44822, kgf: 9.80665,
  dyn: 0.00001, ozf: 0.278014, ton_f: 8896.44,
};
const unitLabels: Record<string, string> = {
  N: "Newtons (N)", kN: "Kilonewtons (kN)", lbf: "Pound-force (lbf)",
  kgf: "Kilogram-force (kgf)", dyn: "Dynes", ozf: "Ounce-force", ton_f: "Ton-force (US)",
};

export const forceConverter: CalculatorDefinition = {
  slug: "force-converter",
  title: "Force Converter",
  description: "Free force unit converter. Convert between Newtons, pound-force, kilogram-force, dynes, and other force units.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["force converter", "newton converter", "lbf to newtons", "force unit conversion", "kgf to N"],
  variants: [
    {
      id: "convert",
      name: "Convert Force",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 100" },
        { name: "from", label: "From", type: "select", options: Object.entries(unitLabels).map(([v, l]) => ({ label: l, value: v })) },
        { name: "to", label: "To", type: "select", options: Object.entries(unitLabels).map(([v, l]) => ({ label: l, value: v })) },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "lbf";
        const to = (inputs.to as string) || "N";
        if (!val) return null;
        const newtons = val * (forceUnits[from] || 1);
        const result = newtons / (forceUnits[to] || 1);
        return {
          primary: { label: `${val} ${unitLabels[from]}`, value: `${formatNumber(result, 6)} ${unitLabels[to]}` },
          details: [
            { label: "Newtons", value: formatNumber(newtons, 6) },
            { label: "Pound-force", value: formatNumber(newtons / 4.44822, 6) },
            { label: "Kilogram-force", value: formatNumber(newtons / 9.80665, 6) },
            { label: "Kilonewtons", value: formatNumber(newtons / 1000, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["force-calculator", "unit-converter", "torque-calculator"],
  faq: [{ question: "How do I convert pounds to Newtons?", answer: "1 pound-force (lbf) = 4.44822 Newtons. 1 kilogram-force (kgf) = 9.80665 Newtons. 1 Newton is the force needed to accelerate 1 kg at 1 m/s²." }],
  formula: "1 lbf = 4.448 N | 1 kgf = 9.807 N",
};
