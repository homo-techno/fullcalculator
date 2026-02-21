import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const helmetSizeCalculator: CalculatorDefinition = {
  slug: "helmet-size-calculator",
  title: "Helmet Size Calculator",
  description: "Free helmet size calculator. Find your helmet size by head circumference for motorcycle, bicycle, ski, and other helmets.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["helmet size calculator", "helmet size chart", "head circumference helmet", "motorcycle helmet size", "bike helmet size"],
  variants: [
    {
      id: "calc",
      name: "Find Helmet Size",
      fields: [
        { name: "circumference", label: "Head Circumference", type: "number", placeholder: "e.g. 57", suffix: "cm", step: 0.1 },
      ],
      calculate: (inputs) => {
        const circ = inputs.circumference as number;
        if (!circ) return null;

        const inches = circ / 2.54;

        // Standard helmet sizing
        let size: string;
        let sizeLabel: string;
        if (circ < 51) {
          size = "XXXS"; sizeLabel = "Triple Extra Small";
        } else if (circ < 53) {
          size = "XXS"; sizeLabel = "Double Extra Small (51–52 cm)";
        } else if (circ < 55) {
          size = "XS"; sizeLabel = "Extra Small (53–54 cm)";
        } else if (circ < 57) {
          size = "S"; sizeLabel = "Small (55–56 cm)";
        } else if (circ < 59) {
          size = "M"; sizeLabel = "Medium (57–58 cm)";
        } else if (circ < 61) {
          size = "L"; sizeLabel = "Large (59–60 cm)";
        } else if (circ < 63) {
          size = "XL"; sizeLabel = "Extra Large (61–62 cm)";
        } else if (circ < 65) {
          size = "XXL"; sizeLabel = "Double Extra Large (63–64 cm)";
        } else {
          size = "XXXL"; sizeLabel = "Triple Extra Large (65+ cm)";
        }

        // Hat size equivalent
        const hatSize = inches / Math.PI;
        const hatRounded = Math.round(hatSize * 8) / 8;

        return {
          primary: { label: "Helmet Size", value: size },
          details: [
            { label: "Size Description", value: sizeLabel },
            { label: "Head Circumference", value: `${formatNumber(circ, 1)} cm (${formatNumber(inches, 1)} in)` },
            { label: "Equivalent Hat Size", value: formatNumber(hatRounded, 3) },
            { label: "Snell / DOT Range", value: size },
          ],
          note: "Helmet sizing varies between brands and models. Always try on a helmet before purchasing. The helmet should fit snugly without pressure points.",
        };
      },
    },
  ],
  relatedSlugs: ["hat-size-calculator", "bike-size-calculator", "ski-size-calculator"],
  faq: [
    { question: "How do I measure my head for a helmet?", answer: "Wrap a flexible tape measure around the widest part of your head, about 1 inch (2.5 cm) above your eyebrows and ears. This is your head circumference." },
    { question: "What helmet size is medium?", answer: "Medium helmets typically fit head circumferences of 57–58 cm (22.4–22.8 inches). This is the most common adult size." },
    { question: "Do helmet sizes differ between brands?", answer: "Yes, sizing can vary between manufacturers. Always check the specific brand's size chart. Some brands run small or large compared to the standard XS-XXL scale." },
  ],
  formula: "XS: 53–54cm | S: 55–56cm | M: 57–58cm | L: 59–60cm | XL: 61–62cm | XXL: 63–64cm",
};
