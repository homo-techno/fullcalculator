import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const miterAngleCalculator: CalculatorDefinition = {
  slug: "miter-angle-calculator",
  title: "Miter Angle Calculator",
  description: "Free miter angle calculator. Calculate miter and bevel angles for polygonal shapes, picture frames, and multi-sided projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["miter angle calculator", "polygon angle calculator", "picture frame angle", "miter saw angle", "bevel angle calculator"],
  variants: [
    {
      id: "polygon-miter",
      name: "Polygon Miter Angle",
      description: "Calculate miter angle for regular polygons",
      fields: [
        { name: "sides", label: "Number of Sides", type: "number", placeholder: "e.g. 6" },
        { name: "sideLength", label: "Side Length (inches)", type: "number", placeholder: "e.g. 12" },
        {
          name: "jointType",
          label: "Joint Type",
          type: "select",
          options: [
            { label: "Flat Miter (no bevel)", value: "flat" },
            { label: "Compound Miter", value: "compound" },
          ],
        },
      ],
      calculate: (inputs) => {
        const sides = inputs.sides as number;
        const sideLength = inputs.sideLength as number;
        const jointType = inputs.jointType as string;
        if (!sides || sides < 3 || !sideLength) return null;
        const interiorAngle = ((sides - 2) * 180) / sides;
        const miterAngle = 180 / sides;
        const complementAngle = 90 - miterAngle;
        const perimeter = sides * sideLength;
        const apothem = sideLength / (2 * Math.tan(Math.PI / sides));
        const radius = sideLength / (2 * Math.sin(Math.PI / sides));
        const area = (perimeter * apothem) / 2;
        return {
          primary: { label: "Miter Saw Setting", value: `${formatNumber(miterAngle, 2)} degrees` },
          details: [
            { label: "Interior Angle", value: `${formatNumber(interiorAngle, 2)} degrees` },
            { label: "Miter Angle (each piece)", value: `${formatNumber(miterAngle, 2)} degrees` },
            { label: "Complement Angle", value: `${formatNumber(complementAngle, 2)} degrees` },
            { label: "Number of Sides", value: formatNumber(sides, 0) },
            { label: "Side Length", value: `${formatNumber(sideLength, 2)} inches` },
            { label: "Perimeter", value: `${formatNumber(perimeter, 2)} inches` },
            { label: "Apothem (inner radius)", value: `${formatNumber(apothem, 2)} inches` },
            { label: "Circumradius", value: `${formatNumber(radius, 2)} inches` },
            { label: "Enclosed Area", value: `${formatNumber(area, 2)} sq inches` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dovetail-joint-calculator", "dado-joint-calculator", "table-leg-taper-calculator"],
  faq: [
    { question: "What angle do I set my miter saw to?", answer: "For a regular polygon, divide 180 by the number of sides. For a 4-sided frame, 180/4 = 45 degrees. For a hexagon, 180/6 = 30 degrees." },
    { question: "How do I cut a perfect picture frame?", answer: "A picture frame is a 4-sided polygon, so set your miter saw to 45 degrees. Ensure your material is flat and consistently sized for best results." },
  ],
  formula: "Miter Angle = 180 / N | Interior Angle = (N-2) x 180 / N | where N = number of sides",
};
