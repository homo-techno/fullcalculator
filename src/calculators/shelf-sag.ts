import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const shelfSagCalculator: CalculatorDefinition = {
  slug: "shelf-sag-calculator",
  title: "Shelf Sag/Deflection Calculator",
  description: "Free shelf sag calculator. Predict how much a shelf will deflect under load based on material, span, and weight distribution.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["shelf sag calculator", "shelf deflection calculator", "bookshelf sag", "shelf span calculator", "shelf load calculator"],
  variants: [
    {
      id: "uniform-load",
      name: "Uniform Load Deflection",
      description: "Calculate shelf sag under evenly distributed weight",
      fields: [
        { name: "spanLength", label: "Shelf Span (inches)", type: "number", placeholder: "e.g. 36" },
        { name: "shelfWidth", label: "Shelf Width/Depth (inches)", type: "number", placeholder: "e.g. 10" },
        { name: "thickness", label: "Shelf Thickness (inches)", type: "number", placeholder: "e.g. 0.75" },
        { name: "totalLoad", label: "Total Load (lbs)", type: "number", placeholder: "e.g. 50" },
        {
          name: "material",
          label: "Shelf Material",
          type: "select",
          options: [
            { label: "Solid Wood - Pine (1,200,000 psi)", value: "1200000" },
            { label: "Solid Wood - Oak (1,500,000 psi)", value: "1500000" },
            { label: "Solid Wood - Maple (1,800,000 psi)", value: "1800000" },
            { label: "Plywood - 3/4 inch (1,500,000 psi)", value: "1500000" },
            { label: "MDF (580,000 psi)", value: "580000" },
            { label: "Particleboard (400,000 psi)", value: "400000" },
            { label: "Melamine (400,000 psi)", value: "400000" },
          ],
        },
      ],
      calculate: (inputs) => {
        const span = inputs.spanLength as number;
        const width = inputs.shelfWidth as number;
        const thickness = inputs.thickness as number;
        const totalLoad = inputs.totalLoad as number;
        const moe = parseFloat(inputs.material as string);
        if (!span || !width || !thickness || !totalLoad || !moe) return null;
        const momentOfInertia = (width * Math.pow(thickness, 3)) / 12;
        const loadPerInch = totalLoad / span;
        const deflection = (5 * loadPerInch * Math.pow(span, 4)) / (384 * moe * momentOfInertia);
        const maxSpanForAcceptable = Math.pow((0.02 * 384 * moe * momentOfInertia) / (5 * loadPerInch), 0.25);
        const stress = (loadPerInch * span * span) / (8 * (width * thickness * thickness / 6));
        const safeLoad = (0.02 * 384 * moe * momentOfInertia) / (5 * Math.pow(span, 3));
        const acceptable = deflection <= 0.02 * span;
        return {
          primary: { label: "Shelf Deflection", value: `${formatNumber(deflection, 4)} inches` },
          details: [
            { label: "Deflection Ratio (L/x)", value: deflection > 0 ? `L/${formatNumber(span / deflection, 0)}` : "No deflection" },
            { label: "Acceptable (< L/50)", value: acceptable ? "Yes" : "No - add support" },
            { label: "Max Span for Acceptable Sag", value: `${formatNumber(maxSpanForAcceptable, 1)} inches` },
            { label: "Safe Load at This Span", value: `${formatNumber(safeLoad, 1)} lbs` },
            { label: "Bending Stress", value: `${formatNumber(stress, 0)} psi` },
            { label: "Moment of Inertia", value: `${formatNumber(momentOfInertia, 4)} in4` },
            { label: "Load per Inch", value: `${formatNumber(loadPerInch, 3)} lbs/in` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wood-density-calculator", "board-footage-calculator", "cabinet-door-size-calculator"],
  faq: [
    { question: "How much sag is acceptable?", answer: "A common rule of thumb is that deflection should be less than 1/50 of the span (L/50). For a 36-inch shelf, that means less than 0.72 inches. For fine furniture, aim for L/200 or less." },
    { question: "How can I reduce shelf sag?", answer: "Increase thickness, use a stiffer material, reduce span (add a center support), add a front edge band for extra rigidity, or reduce the load." },
  ],
  formula: "Deflection = (5 x w x L^4) / (384 x E x I) | I = (b x h^3) / 12 | where w = load/inch, L = span, E = MOE",
};
