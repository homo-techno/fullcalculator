import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const commuteCarbonCalculator: CalculatorDefinition = {
  slug: "commute-carbon-calculator",
  title: "Commute Carbon Footprint Calculator",
  description:
    "Free commute carbon footprint calculator. Compare CO2 emissions from driving, public transit, cycling, and remote work.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "commute carbon",
    "commute emissions",
    "transportation footprint",
    "drive vs transit",
    "commute environmental impact",
    "work commute co2",
  ],
  variants: [
    {
      id: "commute",
      name: "Daily Commute Emissions",
      fields: [
        {
          name: "distance",
          label: "One-Way Distance (miles)",
          type: "number",
          placeholder: "e.g. 15",
        },
        {
          name: "mode",
          label: "Commute Mode",
          type: "select",
          options: [
            { label: "Car (gasoline)", value: "car_gas" },
            { label: "Car (diesel)", value: "car_diesel" },
            { label: "Hybrid Car", value: "hybrid" },
            { label: "Electric Car", value: "ev" },
            { label: "Bus", value: "bus" },
            { label: "Train/Subway", value: "train" },
            { label: "Bicycle/Walk", value: "bike" },
          ],
        },
        {
          name: "daysPerWeek",
          label: "Work Days per Week",
          type: "number",
          placeholder: "e.g. 5",
          defaultValue: 5,
        },
        {
          name: "weeksPerYear",
          label: "Working Weeks per Year",
          type: "number",
          placeholder: "e.g. 48",
          defaultValue: 48,
        },
      ],
      calculate: (inputs) => {
        const distance = inputs.distance as number;
        const mode = (inputs.mode as string) || "car_gas";
        const daysPerWeek = (inputs.daysPerWeek as number) || 5;
        const weeksPerYear = (inputs.weeksPerYear as number) || 48;
        if (!distance) return null;

        // kg CO2 per passenger mile
        const emissionFactors: Record<string, number> = {
          car_gas: 0.404,
          car_diesel: 0.370,
          hybrid: 0.220,
          ev: 0.100,
          bus: 0.089,
          train: 0.041,
          bike: 0,
        };

        const factor = emissionFactors[mode] || 0.404;
        const dailyMiles = distance * 2;
        const dailyCO2 = dailyMiles * factor;
        const weeklyCO2 = dailyCO2 * daysPerWeek;
        const annualCO2 = weeklyCO2 * weeksPerYear;
        const annualTons = annualCO2 / 1000;
        const annualMiles = dailyMiles * daysPerWeek * weeksPerYear;

        // Compare to car baseline
        const carAnnualCO2 = dailyMiles * 0.404 * daysPerWeek * weeksPerYear;
        const savings = carAnnualCO2 - annualCO2;

        return {
          primary: {
            label: "Annual Commute CO2",
            value: formatNumber(annualTons, 2) + " metric tons",
          },
          details: [
            { label: "Daily CO2", value: formatNumber(dailyCO2, 2) + " kg" },
            { label: "Weekly CO2", value: formatNumber(weeklyCO2, 2) + " kg" },
            { label: "Annual CO2", value: formatNumber(annualCO2, 1) + " kg" },
            { label: "Annual Commute Miles", value: formatNumber(annualMiles, 0) },
            { label: "Savings vs Gasoline Car", value: formatNumber(savings, 1) + " kg CO2/yr" },
            { label: "Round-Trip Distance", value: formatNumber(dailyMiles, 1) + " miles" },
          ],
          note: "Switching from driving alone to public transit can reduce commute emissions by 75-90%. Even carpooling halves your per-person footprint.",
        };
      },
    },
  ],
  relatedSlugs: ["carbon-footprint-calculator", "gas-mileage-calculator"],
  faq: [
    {
      question: "What is the most eco-friendly way to commute?",
      answer:
        "Walking and cycling produce zero direct emissions. Trains and subways are the next best option, followed by buses. If you must drive, carpooling or using an electric vehicle significantly reduces your footprint.",
    },
    {
      question: "How much CO2 does working from home save?",
      answer:
        "A typical 15-mile each-way car commuter saves approximately 2.4 metric tons of CO2 per year by working from home full time. Even 2-3 remote days per week makes a meaningful difference.",
    },
  ],
  formula:
    "Annual CO2 = Distance x 2 (round trip) x Emission Factor x Days/Week x Weeks/Year. Factors (kg CO2/mile): Car 0.404, Hybrid 0.22, EV 0.10, Bus 0.089, Train 0.041, Bike 0.",
};
