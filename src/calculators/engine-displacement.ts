import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const engineDisplacementCalculator: CalculatorDefinition = {
  slug: "engine-displacement-calculator",
  title: "Engine Displacement Calculator",
  description:
    "Free engine displacement calculator. Calculate engine displacement in cc and liters from bore, stroke, and number of cylinders.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "engine displacement",
    "engine cc",
    "bore and stroke",
    "engine size",
    "cylinder volume",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Engine Displacement",
      fields: [
        {
          name: "bore",
          label: "Bore Diameter (mm)",
          type: "number",
          placeholder: "e.g. 86",
        },
        {
          name: "stroke",
          label: "Stroke Length (mm)",
          type: "number",
          placeholder: "e.g. 86",
        },
        {
          name: "cylinders",
          label: "Number of Cylinders",
          type: "number",
          placeholder: "e.g. 4",
        },
      ],
      calculate: (inputs) => {
        const bore = inputs.bore as number;
        const stroke = inputs.stroke as number;
        const cylinders = inputs.cylinders as number;

        if (!bore || !stroke || !cylinders) return null;
        if (bore <= 0 || stroke <= 0 || cylinders <= 0) return null;

        // V = (pi/4) x bore^2 x stroke x cylinders (in mm^3)
        const displacementMm3 =
          (Math.PI / 4) * Math.pow(bore, 2) * stroke * cylinders;

        // Convert to cc (1 cc = 1000 mm^3)
        const displacementCc = displacementMm3 / 1000;

        // Convert to liters
        const displacementLiters = displacementCc / 1000;

        // Convert to cubic inches (1 cc = 0.0610237 cu in)
        const displacementCuIn = displacementCc * 0.0610237;

        // Single cylinder volume
        const singleCylinderCc =
          ((Math.PI / 4) * Math.pow(bore, 2) * stroke) / 1000;

        // Bore/stroke ratio
        const boreStrokeRatio = bore / stroke;
        let engineType = "";
        if (boreStrokeRatio > 1.05) engineType = "Over-square (bore > stroke)";
        else if (boreStrokeRatio < 0.95)
          engineType = "Under-square (stroke > bore)";
        else engineType = "Square (bore ≈ stroke)";

        return {
          primary: {
            label: "Engine Displacement",
            value: `${formatNumber(displacementCc, 0)} cc (${formatNumber(displacementLiters, 1)}L)`,
          },
          details: [
            {
              label: "Bore",
              value: `${formatNumber(bore, 1)} mm`,
            },
            {
              label: "Stroke",
              value: `${formatNumber(stroke, 1)} mm`,
            },
            {
              label: "Cylinders",
              value: formatNumber(cylinders, 0),
            },
            {
              label: "Displacement (cc)",
              value: `${formatNumber(displacementCc, 1)} cc`,
            },
            {
              label: "Displacement (Liters)",
              value: `${formatNumber(displacementLiters, 2)} L`,
            },
            {
              label: "Displacement (cu in)",
              value: `${formatNumber(displacementCuIn, 1)} cu in`,
            },
            {
              label: "Single Cylinder Volume",
              value: `${formatNumber(singleCylinderCc, 1)} cc`,
            },
            {
              label: "Bore/Stroke Ratio",
              value: `${formatNumber(boreStrokeRatio, 3)} (${engineType})`,
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gear-ratio-calculator", "tire-size-calculator"],
  faq: [
    {
      question: "How is engine displacement calculated?",
      answer:
        "Displacement = (pi/4) x bore^2 x stroke x number of cylinders. The bore is the cylinder diameter and stroke is the piston travel distance. Result is in mm^3, divided by 1000 for cc.",
    },
    {
      question: "What is bore/stroke ratio?",
      answer:
        "Bore/stroke ratio compares cylinder diameter to piston travel. Over-square engines (ratio > 1) favor high RPM. Under-square engines (ratio < 1) favor torque. Square engines have equal bore and stroke.",
    },
  ],
  formula:
    "V = (pi / 4) x bore^2 x stroke x cylinders. Result in mm^3, divide by 1,000 for cc, by 1,000,000 for liters.",
};
