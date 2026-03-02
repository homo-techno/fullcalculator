import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pickPackTimeCalculator: CalculatorDefinition = {
  slug: "pick-pack-time-calculator",
  title: "Pick and Pack Time Calculator",
  description: "Estimate order fulfillment pick and pack time.",
  category: "Everyday",
  categorySlug: "~",
  icon: "Clock",
  keywords: ["pick","pack","fulfillment","warehouse","order"],
  variants: [{
    id: "standard",
    name: "Pick and Pack Time",
    description: "Estimate order fulfillment pick and pack time.",
    fields: [
      { name: "orderCount", label: "Number of Orders", type: "number", min: 1, max: 10000, defaultValue: 100 },
      { name: "itemsPerOrder", label: "Avg Items Per Order", type: "number", min: 1, max: 100, defaultValue: 5 },
      { name: "pickTimePerItem", label: "Pick Time Per Item (sec)", type: "number", min: 1, max: 300, defaultValue: 30 },
      { name: "packTimePerOrder", label: "Pack Time Per Order (sec)", type: "number", min: 10, max: 600, defaultValue: 120 },
      { name: "workers", label: "Number of Workers", type: "number", min: 1, max: 100, defaultValue: 5 },
    ],
    calculate: (inputs) => {
    const orderCount = inputs.orderCount as number;
    const itemsPerOrder = inputs.itemsPerOrder as number;
    const pickTimePerItem = inputs.pickTimePerItem as number;
    const packTimePerOrder = inputs.packTimePerOrder as number;
    const workers = inputs.workers as number;
    const totalItems = orderCount * itemsPerOrder;
    const totalPickSec = totalItems * pickTimePerItem;
    const totalPackSec = orderCount * packTimePerOrder;
    const totalSec = totalPickSec + totalPackSec;
    const totalHours = totalSec / 3600;
    const hoursPerWorker = totalHours / workers;
    return {
      primary: { label: "Total Fulfillment Time (hrs)", value: formatNumber(totalHours) },
      details: [
        { label: "Hours Per Worker", value: formatNumber(hoursPerWorker) },
        { label: "Total Pick Time (hrs)", value: formatNumber(totalPickSec / 3600) },
        { label: "Total Pack Time (hrs)", value: formatNumber(totalPackSec / 3600) },
        { label: "Total Items to Pick", value: formatNumber(totalItems) }
      ]
    };
  },
  }],
  relatedSlugs: ["warehouse-space-calculator","pallet-load-calculator","conveyor-speed-calculator"],
  faq: [
    { question: "How do I estimate pick and pack time?", answer: "Multiply items by pick time, add pack time per order, then divide by workers." },
    { question: "What is a good pick rate?", answer: "A typical manual pick rate is 60 to 120 items per hour per worker." },
  ],
  formula: "Total Time = (Items x Pick Time + Orders x Pack Time) / Workers",
};
