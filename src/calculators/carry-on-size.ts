import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carryOnSizeCalculator: CalculatorDefinition = {
  slug: "carry-on-size-calculator",
  title: "Carry-On Size Checker Calculator",
  description:
    "Free carry-on size checker. Verify if your bag meets airline carry-on dimensions and calculate total linear inches for any airline.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "carry-on size",
    "carry on dimensions",
    "airline bag size",
    "hand luggage size",
    "cabin baggage",
  ],
  variants: [
    {
      id: "check",
      name: "Check Carry-On Size",
      description: "Verify your bag meets airline carry-on limits",
      fields: [
        {
          name: "length",
          label: "Bag Length",
          type: "number",
          placeholder: "e.g. 22",
        },
        {
          name: "width",
          label: "Bag Width",
          type: "number",
          placeholder: "e.g. 14",
        },
        {
          name: "height",
          label: "Bag Height/Depth",
          type: "number",
          placeholder: "e.g. 9",
        },
        {
          name: "unit",
          label: "Measurement Unit",
          type: "select",
          options: [
            { label: "Inches", value: "in" },
            { label: "Centimeters", value: "cm" },
          ],
          defaultValue: "in",
        },
        {
          name: "airline",
          label: "Airline Standard",
          type: "select",
          options: [
            { label: "Standard US (22x14x9 in)", value: "us" },
            { label: "International IATA (56x45x25 cm)", value: "iata" },
            { label: "Budget Airlines (21.5x15.5x9 in)", value: "budget" },
            { label: "European Budget (55x40x20 cm)", value: "eubudget" },
            { label: "Asian Airlines (55x40x25 cm)", value: "asian" },
          ],
          defaultValue: "us",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        const unit = inputs.unit as string;
        const airline = inputs.airline as string;
        if (!length || !width || !height) return null;

        const toIn = (val: number) => (unit === "cm" ? val / 2.54 : val);
        const toCm = (val: number) => (unit === "in" ? val * 2.54 : val);

        const lengthIn = toIn(length);
        const widthIn = toIn(width);
        const heightIn = toIn(height);
        const lengthCm = toCm(length);
        const widthCm = toCm(width);
        const heightCm = toCm(height);

        const limitsIn: Record<string, [number, number, number]> = {
          us: [22, 14, 9],
          iata: [22.05, 17.72, 9.84],
          budget: [21.5, 15.5, 9],
          eubudget: [21.65, 15.75, 7.87],
          asian: [21.65, 15.75, 9.84],
        };

        const limit = limitsIn[airline] || limitsIn.us;
        const linearIn = lengthIn + widthIn + heightIn;
        const linearCm = lengthCm + widthCm + heightCm;
        const fitsLength = lengthIn <= limit[0];
        const fitsWidth = widthIn <= limit[1];
        const fitsHeight = heightIn <= limit[2];
        const fitsAll = fitsLength && fitsWidth && fitsHeight;

        const volume = lengthIn * widthIn * heightIn;
        const volumeLiters = (lengthCm * widthCm * heightCm) / 1000;

        return {
          primary: {
            label: fitsAll ? "Fits as Carry-On" : "Does NOT Fit",
            value: `${formatNumber(linearIn, 1)} linear inches`,
          },
          details: [
            { label: "Your dimensions (in)", value: `${formatNumber(lengthIn, 1)} x ${formatNumber(widthIn, 1)} x ${formatNumber(heightIn, 1)}` },
            { label: "Your dimensions (cm)", value: `${formatNumber(lengthCm, 1)} x ${formatNumber(widthCm, 1)} x ${formatNumber(heightCm, 1)}` },
            { label: "Limit (in)", value: `${limit[0]} x ${limit[1]} x ${limit[2]}` },
            { label: "Linear inches", value: `${formatNumber(linearIn, 1)} in` },
            { label: "Linear cm", value: `${formatNumber(linearCm, 1)} cm` },
            { label: "Volume", value: `${formatNumber(volumeLiters, 1)} liters` },
            { label: "Length", value: fitsLength ? "OK" : "Too large" },
            { label: "Width", value: fitsWidth ? "OK" : "Too large" },
            { label: "Height/Depth", value: fitsHeight ? "OK" : "Too large" },
          ],
          note: fitsAll
            ? "Your bag fits within the airline's carry-on limits."
            : "Your bag exceeds one or more dimensions. You may need to check it.",
        };
      },
    },
  ],
  relatedSlugs: ["luggage-weight-calculator", "travel-packing-calculator"],
  faq: [
    {
      question: "What is the standard carry-on size for most airlines?",
      answer:
        "The most common carry-on size limit is 22 x 14 x 9 inches (56 x 36 x 23 cm) including handles and wheels. However, limits vary by airline, so always check your specific airline's policy before flying.",
    },
    {
      question: "What are linear inches?",
      answer:
        "Linear inches are the total of a bag's length + width + height. Many airlines use a maximum of 45 linear inches (115 cm) for carry-on bags. This single number makes it easy to quickly determine if a bag meets size requirements.",
    },
    {
      question: "Do wheels and handles count in carry-on measurements?",
      answer:
        "Yes, most airlines measure carry-on bags including handles, wheels, and any external pockets. When measuring your bag, include everything that extends beyond the body of the bag.",
    },
  ],
  formula:
    "Linear inches = Length + Width + Height; bag passes if each dimension is within the airline limit.",
};
