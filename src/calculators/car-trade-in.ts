import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carTradeInCalculator: CalculatorDefinition = {
  slug: "car-trade-in-calculator",
  title: "Car Trade-In Value Calculator",
  description: "Free car trade-in value estimator. Estimate your vehicle trade-in value based on age, mileage, condition, and original price.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["car trade-in value", "trade-in calculator", "vehicle trade-in", "car value estimator", "used car value"],
  variants: [
    {
      id: "estimate",
      name: "Estimate Trade-In Value",
      description: "Estimate your car's trade-in value",
      fields: [
        { name: "originalPrice", label: "Original Purchase Price", type: "number", placeholder: "e.g. 35000", prefix: "$" },
        { name: "age", label: "Vehicle Age (years)", type: "number", placeholder: "e.g. 5" },
        { name: "mileage", label: "Current Mileage", type: "number", placeholder: "e.g. 60000" },
        { name: "condition", label: "Overall Condition", type: "select", options: [
          { label: "Excellent (like new, no issues)", value: "excellent" },
          { label: "Good (minor wear, well maintained)", value: "good" },
          { label: "Fair (some repairs needed)", value: "fair" },
          { label: "Poor (major repairs needed)", value: "poor" },
        ], defaultValue: "good" },
        { name: "vehicleType", label: "Vehicle Type", type: "select", options: [
          { label: "Sedan", value: "sedan" },
          { label: "SUV / Crossover", value: "suv" },
          { label: "Truck", value: "truck" },
          { label: "Sports Car", value: "sports" },
          { label: "Luxury Vehicle", value: "luxury" },
          { label: "Minivan", value: "minivan" },
        ], defaultValue: "sedan" },
      ],
      calculate: (inputs) => {
        const originalPrice = inputs.originalPrice as number;
        const age = inputs.age as number;
        const mileage = (inputs.mileage as number) || 0;
        const condition = (inputs.condition as string) || "good";
        const vehicleType = (inputs.vehicleType as string) || "sedan";
        if (!originalPrice || !age) return null;

        // Base depreciation: ~15-20% first year, ~10-15% subsequent years
        let depreciatedValue = originalPrice;
        for (let i = 0; i < age; i++) {
          if (i === 0) {
            depreciatedValue *= 0.80; // 20% first year
          } else {
            depreciatedValue *= 0.88; // 12% per subsequent year
          }
        }

        // Mileage adjustment: avg 12,000 miles/year
        const expectedMileage = age * 12000;
        const mileageDiff = mileage - expectedMileage;
        const mileageAdjustment = -(mileageDiff * 0.10); // $0.10 per mile over/under
        depreciatedValue += mileageAdjustment;

        // Condition factor
        const conditionFactors: Record<string, number> = { excellent: 1.10, good: 1.0, fair: 0.85, poor: 0.65 };
        depreciatedValue *= conditionFactors[condition] || 1.0;

        // Vehicle type retention factor
        const typeFactors: Record<string, number> = { sedan: 1.0, suv: 1.05, truck: 1.12, sports: 0.92, luxury: 0.88, minivan: 0.95 };
        depreciatedValue *= typeFactors[vehicleType] || 1.0;

        depreciatedValue = Math.max(depreciatedValue, 500); // minimum $500

        const privatePartyValue = depreciatedValue * 1.15;
        const percentRetained = (depreciatedValue / originalPrice) * 100;

        return {
          primary: { label: "Estimated Trade-In Value", value: `$${formatNumber(depreciatedValue)}` },
          details: [
            { label: "Private party value", value: `$${formatNumber(privatePartyValue)}` },
            { label: "Value retained", value: `${formatNumber(percentRetained, 1)}%` },
            { label: "Total depreciation", value: `$${formatNumber(originalPrice - depreciatedValue)}` },
            { label: "Mileage adjustment", value: `${mileageDiff > 0 ? "-" : "+"}$${formatNumber(Math.abs(mileageAdjustment))}` },
          ],
          note: "This is a rough estimate. Actual trade-in values depend on make, model, local market demand, and dealer. Check KBB or Edmunds for more accurate values.",
        };
      },
    },
  ],
  relatedSlugs: ["car-depreciation-calculator", "car-payment-calculator", "vehicle-tax-calculator"],
  faq: [
    { question: "How is trade-in value determined?", answer: "Dealers consider the vehicle's age, mileage, condition, accident history, market demand, and current wholesale auction values. The trade-in value is typically 10-20% less than private party value because the dealer needs to recondition and resell at a profit." },
    { question: "How can I get a better trade-in value?", answer: "Clean your car thoroughly inside and out, fix minor cosmetic issues, keep maintenance records, get quotes from multiple dealers, and consider online trade-in offers from Carvana, CarMax, or Vroom. Getting pre-offers creates leverage for negotiation." },
    { question: "Which vehicles hold their value best?", answer: "Trucks, SUVs, and certain Japanese brands (Toyota, Honda) tend to retain value best. Toyota Tacoma, Jeep Wrangler, and Porsche 911 are consistently among the highest resale value vehicles. Electric vehicles and luxury sedans tend to depreciate faster." },
  ],
  formula: "Trade-In Value = Original Price x Depreciation Factor x Condition Factor x Type Factor +/- Mileage Adjustment",
};
