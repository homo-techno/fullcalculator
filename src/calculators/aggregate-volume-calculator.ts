import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aggregateVolumeCalculator: CalculatorDefinition = {
  slug: "aggregate-volume-calculator",
  title: "Aggregate Volume Calculator",
  description: "Calculate the volume and weight of aggregate material needed for construction projects based on area, depth, and material type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["aggregate volume","gravel amount","crushed stone calculator","fill material","construction aggregate"],
  variants: [{
    id: "standard",
    name: "Aggregate Volume",
    description: "Calculate the volume and weight of aggregate material needed for construction projects based on area, depth, and material type.",
    fields: [
      { name: "length", label: "Area Length (meters)", type: "number", min: 0.5, max: 1000, defaultValue: 10 },
      { name: "width", label: "Area Width (meters)", type: "number", min: 0.5, max: 1000, defaultValue: 5 },
      { name: "depth", label: "Depth/Thickness (cm)", type: "number", min: 1, max: 200, defaultValue: 15 },
      { name: "materialType", label: "Material Type", type: "select", options: [{ value: "1500", label: "Pea Gravel (1,500 kg/m3)" }, { value: "1600", label: "Crushed Stone (1,600 kg/m3)" }, { value: "1700", label: "Compacted Gravel (1,700 kg/m3)" }, { value: "1400", label: "Sand (1,400 kg/m3)" }, { value: "2000", label: "Recycled Concrete (2,000 kg/m3)" }], defaultValue: "1600" },
      { name: "compactionFactor", label: "Compaction Waste Factor (%)", type: "number", min: 0, max: 30, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const l = inputs.length as number;
    const w = inputs.width as number;
    const d = inputs.depth as number / 100;
    const density = parseFloat(inputs.materialType as unknown as string);
    const waste = inputs.compactionFactor as number / 100;
    const baseVolume = l * w * d;
    const totalVolume = baseVolume * (1 + waste);
    const weightKg = totalVolume * density;
    const weightTons = weightKg / 1000;
    const cubicYards = totalVolume * 1.30795;
    const area = l * w;
    const priceEstimate = weightTons * 25;
    return {
      primary: { label: "Total Volume Needed", value: formatNumber(parseFloat(totalVolume.toFixed(2))) + " m3" },
      details: [
        { label: "Weight", value: formatNumber(Math.round(weightKg)) + " kg (" + formatNumber(parseFloat(weightTons.toFixed(2))) + " tonnes)" },
        { label: "Cubic Yards", value: formatNumber(parseFloat(cubicYards.toFixed(2))) + " yd3" },
        { label: "Coverage Area", value: formatNumber(parseFloat(area.toFixed(2))) + " m2" },
        { label: "Base Volume (no waste)", value: formatNumber(parseFloat(baseVolume.toFixed(2))) + " m3" },
        { label: "Estimated Cost ($25/tonne)", value: "$" + formatNumber(Math.round(priceEstimate)) }
      ]
    };
  },
  }],
  relatedSlugs: ["gravel-calculator","excavation-volume-calculator","land-survey-area-calculator"],
  faq: [
    { question: "How much aggregate do I need per square meter?", answer: "It depends on depth. For a 10cm layer, you need 0.1 cubic meters per square meter. At typical crushed stone density (1,600 kg/m3), that is about 160 kg per square meter." },
    { question: "Should I add extra for waste and compaction?", answer: "Yes. Aggregate compacts during installation and some material is lost during spreading. Adding 10-15% extra is standard practice. Compacted gravel may need even more as it settles significantly." },
    { question: "What size aggregate should I use?", answer: "For driveways, use 3/4 inch crushed stone. For drainage, use larger 1.5 to 2 inch stone. For base layers under pavement, use a graded mix of sizes for maximum compaction and stability." },
  ],
  formula: "Volume = Length x Width x (Depth / 100)
Total Volume = Volume x (1 + Waste Factor)
Weight = Total Volume x Material Density
Cubic Yards = Volume(m3) x 1.30795",
};
