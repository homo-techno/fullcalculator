import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tireSizeCalculator: CalculatorDefinition = {
  slug: "tire-size-calculator",
  title: "Tire Size Calculator",
  description:
    "Free tire size calculator. Enter tire width, aspect ratio, and rim diameter to calculate overall diameter, circumference, and revolutions per mile.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "tire size",
    "tire calculator",
    "tire diameter",
    "tire circumference",
    "revolutions per mile",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Tire Dimensions",
      fields: [
        {
          name: "width",
          label: "Tire Width (mm)",
          type: "number",
          placeholder: "e.g. 225",
        },
        {
          name: "aspect",
          label: "Aspect Ratio (%)",
          type: "number",
          placeholder: "e.g. 45",
        },
        {
          name: "rim",
          label: "Rim Diameter (inches)",
          type: "number",
          placeholder: "e.g. 17",
        },
      ],
      calculate: (inputs) => {
        const width = inputs.width as number;
        const aspect = inputs.aspect as number;
        const rim = inputs.rim as number;

        if (!width || !aspect || !rim) return null;
        if (width <= 0 || aspect <= 0 || rim <= 0) return null;

        // Sidewall height in inches
        const sidewallHeight = (width * (aspect / 100)) / 25.4;

        // Overall diameter = rim + 2 x sidewall height
        const overallDiameter = rim + 2 * sidewallHeight;

        // Circumference
        const circumference = Math.PI * overallDiameter;

        // Revolutions per mile (1 mile = 63,360 inches)
        const revsPerMile = 63360 / circumference;

        // Width in inches
        const widthInches = width / 25.4;

        return {
          primary: {
            label: "Overall Diameter",
            value: `${formatNumber(overallDiameter, 2)} in`,
          },
          details: [
            {
              label: "Tire Code",
              value: `${formatNumber(width, 0)}/${formatNumber(aspect, 0)}R${formatNumber(rim, 0)}`,
            },
            {
              label: "Sidewall Height",
              value: `${formatNumber(sidewallHeight, 2)} in (${formatNumber(sidewallHeight * 25.4, 1)} mm)`,
            },
            {
              label: "Overall Diameter",
              value: `${formatNumber(overallDiameter, 2)} in (${formatNumber(overallDiameter * 25.4, 1)} mm)`,
            },
            {
              label: "Circumference",
              value: `${formatNumber(circumference, 2)} in (${formatNumber(circumference * 25.4, 1)} mm)`,
            },
            {
              label: "Revolutions per Mile",
              value: formatNumber(revsPerMile, 0),
            },
            {
              label: "Revolutions per Kilometer",
              value: formatNumber(revsPerMile / 1.60934, 0),
            },
            {
              label: "Section Width",
              value: `${formatNumber(widthInches, 2)} in (${formatNumber(width, 0)} mm)`,
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gear-ratio-calculator", "engine-displacement-calculator"],
  faq: [
    {
      question: "How do I read a tire size code?",
      answer:
        "A tire code like 225/45R17 means: 225mm width, 45% aspect ratio (sidewall is 45% of width), R for radial construction, and 17-inch rim diameter.",
    },
    {
      question: "How is overall tire diameter calculated?",
      answer:
        "Overall diameter = rim diameter + 2 x sidewall height. Sidewall height = width (mm) x aspect ratio / 100 / 25.4 (to convert to inches).",
    },
  ],
  formula:
    "Sidewall = Width_mm x Aspect / 100 / 25.4. Diameter = Rim + 2 x Sidewall. Circumference = pi x Diameter. Revs/Mile = 63,360 / Circumference.",
};
