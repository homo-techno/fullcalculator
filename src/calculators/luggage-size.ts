import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const luggageSize: CalculatorDefinition = {
  slug: "luggage-size",
  title: "Luggage Size Calculator",
  description:
    "Free online luggage size calculator. Check if your luggage dimensions meet airline carry-on and checked bag size limits.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "luggage size",
    "carry-on dimensions",
    "baggage size limit",
    "suitcase size",
    "airline luggage",
  ],
  variants: [
    {
      id: "size-check",
      name: "Check Luggage Size Compliance",
      fields: [
        {
          name: "length",
          label: "Length (longest side)",
          type: "number",
          placeholder: "e.g. 22",
        },
        {
          name: "width",
          label: "Width",
          type: "number",
          placeholder: "e.g. 14",
        },
        {
          name: "depth",
          label: "Depth",
          type: "number",
          placeholder: "e.g. 9",
        },
        {
          name: "unit",
          label: "Measurement Unit",
          type: "select",
          options: [
            { label: "Inches", value: "inches" },
            { label: "Centimeters", value: "cm" },
          ],
        },
        {
          name: "bagType",
          label: "Bag Type",
          type: "select",
          options: [
            { label: "Carry-On", value: "carryon" },
            { label: "Checked Bag", value: "checked" },
          ],
        },
        {
          name: "airline",
          label: "Airline",
          type: "select",
          options: [
            { label: "Delta Air Lines", value: "delta" },
            { label: "United Airlines", value: "united" },
            { label: "American Airlines", value: "american" },
            { label: "Southwest Airlines", value: "southwest" },
            { label: "JetBlue Airways", value: "jetblue" },
            { label: "Ryanair", value: "ryanair" },
            { label: "EasyJet", value: "easyjet" },
            { label: "British Airways", value: "british" },
            { label: "Emirates", value: "emirates" },
          ],
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string) || 0;
        const width = parseFloat(inputs.width as string) || 0;
        const depth = parseFloat(inputs.depth as string) || 0;
        const unit = inputs.unit as string;
        const bagType = inputs.bagType as string;
        const airline = inputs.airline as string;

        // Convert to inches for comparison
        const lenIn = unit === "cm" ? length / 2.54 : length;
        const widIn = unit === "cm" ? width / 2.54 : width;
        const depIn = unit === "cm" ? depth / 2.54 : depth;
        const totalLinear = lenIn + widIn + depIn;

        // Carry-on limits in inches (L x W x D)
        const carryOnLimits: Record<string, [number, number, number]> = {
          delta: [22, 14, 9],
          united: [22, 14, 9],
          american: [22, 14, 9],
          southwest: [24, 16, 10],
          jetblue: [22, 14, 9],
          ryanair: [22, 16, 8],
          easyjet: [22, 18, 8],
          british: [22, 18, 10],
          emirates: [22, 15, 8],
        };

        // Checked bag linear limit (inches)
        const checkedLinearLimit: Record<string, number> = {
          delta: 62,
          united: 62,
          american: 62,
          southwest: 62,
          jetblue: 62,
          ryanair: 62,
          easyjet: 108,
          british: 62,
          emirates: 59,
        };

        let compliant = false;
        let limitDesc = "";

        if (bagType === "carryon") {
          const limits = carryOnLimits[airline] || [22, 14, 9];
          compliant = lenIn <= limits[0] && widIn <= limits[1] && depIn <= limits[2];
          limitDesc = limits[0] + " x " + limits[1] + " x " + limits[2] + " in";
        } else {
          const linearLimit = checkedLinearLimit[airline] || 62;
          compliant = totalLinear <= linearLimit;
          limitDesc = formatNumber(linearLimit) + " in total linear";
        }

        const lenCm = lenIn * 2.54;
        const widCm = widIn * 2.54;
        const depCm = depIn * 2.54;
        const volumeCuIn = lenIn * widIn * depIn;
        const volumeLiters = volumeCuIn * 0.016387;

        return {
          primary: {
            label: "Compliance",
            value: compliant ? "PASSES - Within airline limits" : "FAILS - Exceeds airline limits",
          },
          details: [
            { label: "Your Bag", value: formatNumber(lenIn, 1) + " x " + formatNumber(widIn, 1) + " x " + formatNumber(depIn, 1) + " in" },
            { label: "In Centimeters", value: formatNumber(lenCm, 1) + " x " + formatNumber(widCm, 1) + " x " + formatNumber(depCm, 1) + " cm" },
            { label: "Airline Limit", value: limitDesc },
            { label: "Total Linear", value: formatNumber(totalLinear, 1) + " in" },
            { label: "Volume", value: formatNumber(volumeLiters, 1) + " liters" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["carry-on-weight", "customs-duty", "duty-free-savings"],
  faq: [
    {
      question: "What is the standard carry-on size?",
      answer:
        "Most US airlines allow carry-ons up to 22 x 14 x 9 inches (56 x 36 x 23 cm) including wheels and handles. Southwest is more generous at 24 x 16 x 10 inches.",
    },
    {
      question: "What is the checked bag size limit?",
      answer:
        "Most airlines allow checked bags with total linear dimensions (length + width + height) of 62 inches (158 cm) or less. Oversize bags incur additional fees.",
    },
    {
      question: "Do bag dimensions include wheels and handles?",
      answer:
        "Yes, airline dimension limits include wheels, handles, and any external pockets. Measure your bag at its largest points including these features.",
    },
  ],
  formula:
    "Linear Dimensions = Length + Width + Depth\nVolume = Length x Width x Depth\nCompliance = All dimensions within airline limits",
};
