import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airFlowCalculator: CalculatorDefinition = {
  slug: "air-flow-calculator",
  title: "Air Flow (CFM) Calculator",
  description:
    "Free air flow CFM calculator. Calculate the cubic feet per minute (CFM) needed for a room based on dimensions and desired air changes per hour.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "cfm calculator",
    "air flow calculator",
    "air changes per hour",
    "ventilation calculator",
    "hvac cfm",
    "room ventilation",
  ],
  variants: [
    {
      id: "cfm-from-room",
      name: "CFM from Room Dimensions",
      description: "CFM = (Room Volume × ACH) / 60",
      fields: [
        {
          name: "length",
          label: "Room Length (feet)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "width",
          label: "Room Width (feet)",
          type: "number",
          placeholder: "e.g. 15",
        },
        {
          name: "height",
          label: "Ceiling Height (feet)",
          type: "number",
          placeholder: "e.g. 8",
          defaultValue: 8,
        },
        {
          name: "ach",
          label: "Air Changes per Hour (ACH)",
          type: "number",
          placeholder: "e.g. 6",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        const ach = inputs.ach as number;
        if (!length || !width || !height || !ach) return null;

        const volumeCuFt = length * width * height;
        const cfm = (volumeCuFt * ach) / 60;
        const cmh = cfm * 1.69901; // cubic meters per hour
        const lps = cfm * 0.471947; // liters per second

        return {
          primary: {
            label: "Required Airflow",
            value: `${formatNumber(cfm, 2)} CFM`,
          },
          details: [
            { label: "CFM Required", value: formatNumber(cfm, 2) },
            { label: "Room Volume", value: `${formatNumber(volumeCuFt, 2)} cu ft` },
            { label: "Air Changes/Hour", value: formatNumber(ach, 2) },
            { label: "Cubic Meters/Hour", value: formatNumber(cmh, 2) },
            { label: "Liters/Second", value: formatNumber(lps, 2) },
            { label: "Room Area", value: `${formatNumber(length * width, 2)} sq ft` },
          ],
        };
      },
    },
    {
      id: "ach-from-cfm",
      name: "ACH from Known CFM",
      description: "ACH = (CFM × 60) / Room Volume",
      fields: [
        {
          name: "cfm",
          label: "Airflow (CFM)",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "length",
          label: "Room Length (feet)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "width",
          label: "Room Width (feet)",
          type: "number",
          placeholder: "e.g. 15",
        },
        {
          name: "height",
          label: "Ceiling Height (feet)",
          type: "number",
          placeholder: "e.g. 8",
          defaultValue: 8,
        },
      ],
      calculate: (inputs) => {
        const cfm = inputs.cfm as number;
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        if (!cfm || !length || !width || !height) return null;

        const volumeCuFt = length * width * height;
        const ach = (cfm * 60) / volumeCuFt;

        return {
          primary: {
            label: "Air Changes per Hour",
            value: `${formatNumber(ach, 2)} ACH`,
          },
          details: [
            { label: "ACH", value: formatNumber(ach, 2) },
            { label: "Room Volume", value: `${formatNumber(volumeCuFt, 2)} cu ft` },
            { label: "CFM", value: formatNumber(cfm, 2) },
            { label: "Room Area", value: `${formatNumber(length * width, 2)} sq ft` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hvac-calculator", "pipe-flow-calculator", "cubic-feet-calculator"],
  faq: [
    {
      question: "How do I calculate CFM for a room?",
      answer:
        "CFM = (Room Volume × ACH) / 60. First calculate the room volume (L × W × H in feet), multiply by the desired air changes per hour, then divide by 60 to convert to cubic feet per minute.",
    },
    {
      question: "What are typical air changes per hour?",
      answer:
        "Bedrooms: 5-6 ACH, Living rooms: 6-8 ACH, Kitchens: 15-20 ACH, Bathrooms: 8-10 ACH, Garages: 6-8 ACH, Labs/workshops: 10-15 ACH.",
    },
  ],
  formula: "CFM = (Length × Width × Height × ACH) / 60",
};
