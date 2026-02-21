import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const batteryLifeCalculator: CalculatorDefinition = {
  slug: "battery-life-calculator",
  title: "Battery Life Calculator",
  description:
    "Free battery life calculator. Estimate how long a battery lasts from its capacity (mAh) and device consumption (mA).",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "battery life",
    "mAh",
    "battery capacity",
    "current consumption",
    "runtime",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Battery Life",
      fields: [
        {
          name: "capacity",
          label: "Battery Capacity (mAh)",
          type: "number",
          placeholder: "e.g. 5000",
        },
        {
          name: "consumption",
          label: "Device Consumption (mA)",
          type: "number",
          placeholder: "e.g. 250",
        },
      ],
      calculate: (inputs) => {
        const capacity = inputs.capacity as number;
        const consumption = inputs.consumption as number;
        if (!capacity || !consumption) return null;
        if (consumption <= 0) return null;
        const hours = capacity / consumption;
        const minutes = hours * 60;
        const days = hours / 24;
        return {
          primary: {
            label: "Battery Life",
            value: formatNumber(hours, 2) + " hours",
          },
          details: [
            {
              label: "Battery Life (minutes)",
              value: formatNumber(minutes, 1) + " min",
            },
            {
              label: "Battery Life (days)",
              value: formatNumber(days, 2) + " days",
            },
            {
              label: "Capacity",
              value: formatNumber(capacity, 0) + " mAh",
            },
            {
              label: "Consumption",
              value: formatNumber(consumption, 2) + " mA",
            },
            {
              label: "Consumption (W at 3.7V)",
              value: formatNumber((consumption / 1000) * 3.7, 4) + " W",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["solar-panel-calculator", "circuit-calculator"],
  faq: [
    {
      question: "How is battery life calculated?",
      answer:
        "Battery life in hours = capacity (mAh) / consumption (mA). This is an idealized estimate; real-world battery life is affected by temperature, voltage sag, and discharge efficiency.",
    },
    {
      question: "What does mAh mean?",
      answer:
        "mAh stands for milliamp-hours. A 5000 mAh battery can theoretically supply 5000 mA for 1 hour, or 500 mA for 10 hours.",
    },
  ],
  formula:
    "Battery Life (hours) = Capacity (mAh) / Consumption (mA).",
};
