import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterSupplyDemandCalculator: CalculatorDefinition = {
  slug: "water-supply-demand-calculator",
  title: "Water Supply Demand Calculator",
  description: "Free water supply demand calculator. Estimate peak water demand using fixture units (WSFU) for sizing supply pipes and meters.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["water supply demand", "fixture unit calculator", "WSFU calculator", "peak water demand", "water meter sizing"],
  variants: [
    {
      id: "fixture-units",
      name: "Demand from Fixture Units",
      description: "Calculate peak demand from water supply fixture units",
      fields: [
        { name: "toilets", label: "Toilets (flush valve = 10, tank = 3 WSFU)", type: "number", placeholder: "e.g. 3", defaultValue: 0 },
        { name: "lavatories", label: "Lavatories (1 WSFU each)", type: "number", placeholder: "e.g. 3", defaultValue: 0 },
        { name: "showers", label: "Showers (2 WSFU each)", type: "number", placeholder: "e.g. 2", defaultValue: 0 },
        { name: "kitchenSinks", label: "Kitchen Sinks (2 WSFU each)", type: "number", placeholder: "e.g. 1", defaultValue: 0 },
        { name: "washingMachines", label: "Washing Machines (4 WSFU each)", type: "number", placeholder: "e.g. 1", defaultValue: 0 },
        { name: "dishwashers", label: "Dishwashers (2 WSFU each)", type: "number", placeholder: "e.g. 1", defaultValue: 0 },
        { name: "toiletType", label: "Toilet Type", type: "select", options: [
          { label: "Tank Type (3 WSFU)", value: "tank" },
          { label: "Flush Valve (10 WSFU)", value: "valve" },
        ], defaultValue: "tank" },
      ],
      calculate: (inputs) => {
        const toilets = (inputs.toilets as number) || 0;
        const lavatories = (inputs.lavatories as number) || 0;
        const showers = (inputs.showers as number) || 0;
        const kitchenSinks = (inputs.kitchenSinks as number) || 0;
        const washingMachines = (inputs.washingMachines as number) || 0;
        const dishwashers = (inputs.dishwashers as number) || 0;
        const toiletType = inputs.toiletType as string;
        const toiletWsfu = toiletType === "valve" ? 10 : 3;
        const totalWsfu = (toilets * toiletWsfu) + (lavatories * 1) + (showers * 2) + (kitchenSinks * 2) + (washingMachines * 4) + (dishwashers * 2);
        if (totalWsfu === 0) return null;
        let gpm = 0;
        if (totalWsfu <= 6) gpm = totalWsfu * 1.0;
        else if (totalWsfu <= 20) gpm = 6 + (totalWsfu - 6) * 0.8;
        else if (totalWsfu <= 50) gpm = 17.2 + (totalWsfu - 20) * 0.6;
        else gpm = 35.2 + (totalWsfu - 50) * 0.4;
        const meterSize = gpm <= 15 ? 0.75 : gpm <= 25 ? 1 : gpm <= 50 ? 1.5 : gpm <= 100 ? 2 : 3;
        return {
          primary: { label: "Peak Demand", value: `${formatNumber(gpm, 1)}` + " GPM" },
          details: [
            { label: "Total WSFU", value: `${formatNumber(totalWsfu, 0)}` },
            { label: "Suggested Meter Size", value: `${formatNumber(meterSize, 2)}` + " inches" },
            { label: "Toilets", value: `${formatNumber(toilets, 0)}` + " (" + `${formatNumber(toilets * toiletWsfu, 0)}` + " WSFU)" },
            { label: "Showers", value: `${formatNumber(showers, 0)}` + " (" + `${formatNumber(showers * 2, 0)}` + " WSFU)" },
            { label: "Other Fixtures WSFU", value: `${formatNumber((lavatories * 1) + (kitchenSinks * 2) + (washingMachines * 4) + (dishwashers * 2), 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pipe-sizing-calculator", "water-heater-size-calculator", "backflow-preventer-calculator"],
  faq: [
    { question: "What are water supply fixture units?", answer: "WSFU is a measure of probable water demand. Each fixture type has a WSFU value based on its flow rate and typical usage pattern. The total is converted to GPM using a diversity curve." },
    { question: "Why is peak demand less than sum of all fixtures?", answer: "Not all fixtures operate simultaneously. The Hunter curve (diversity curve) accounts for the probability that only a fraction of fixtures are in use at any given time." },
  ],
  formula: "Total WSFU = sum of all fixture units | GPM from Hunter/WSFU curve | Meter size from peak GPM",
};