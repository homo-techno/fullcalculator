import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carSeatExpirationCalculator: CalculatorDefinition = {
  slug: "car-seat-expiration-calculator",
  title: "Car Seat Expiration Calculator",
  description: "Determine when your child car seat expires based on manufacture date and type, plus find the right seat for your child weight and age.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["car seat expiration","car seat lifespan","child safety seat","car seat age limit","car seat replacement"],
  variants: [{
    id: "standard",
    name: "Car Seat Expiration",
    description: "Determine when your child car seat expires based on manufacture date and type, plus find the right seat for your child weight and age.",
    fields: [
      { name: "seatType", label: "Car Seat Type", type: "select", options: [{ value: "6", label: "Infant Carrier (6 yr)" }, { value: "8", label: "Convertible Seat (8 yr)" }, { value: "10", label: "Booster Seat (10 yr)" }, { value: "7", label: "All-in-One (7 yr)" }], defaultValue: "8" },
      { name: "mfgYear", label: "Manufacture Year", type: "number", min: 2015, max: 2026, defaultValue: 2022 },
      { name: "childWeight", label: "Child Weight (lbs)", type: "number", min: 4, max: 120, defaultValue: 25 },
      { name: "childAge", label: "Child Age (Months)", type: "number", min: 0, max: 144, defaultValue: 18 },
    ],
    calculate: (inputs) => {
    const lifespan = inputs.seatType as number;
    const mfgYear = inputs.mfgYear as number;
    const childWeight = inputs.childWeight as number;
    const childAge = inputs.childAge as number;
    const expirationYear = mfgYear + lifespan;
    const currentYear = 2026;
    const yearsRemaining = expirationYear - currentYear;
    const isExpired = yearsRemaining <= 0;
    var recommendedSeat = "Rear-Facing Infant Seat";
    if (childAge >= 12 && childWeight >= 20) { recommendedSeat = "Rear-Facing Convertible (recommended to age 2+)"; }
    if (childAge >= 24 && childWeight >= 30) { recommendedSeat = "Forward-Facing with Harness"; }
    if (childAge >= 48 && childWeight >= 40) { recommendedSeat = "Booster Seat"; }
    if (childAge >= 96 && childWeight >= 65) { recommendedSeat = "Seat Belt (if 4ft 9in+)"; }
    return {
      primary: { label: "Expiration Year", value: isExpired ? "EXPIRED" : formatNumber(expirationYear) },
      details: [
        { label: "Years Remaining", value: isExpired ? "Expired - Replace Immediately" : formatNumber(yearsRemaining) + " years" },
        { label: "Seat Lifespan", value: formatNumber(lifespan) + " years" },
        { label: "Recommended Seat Type", value: recommendedSeat },
        { label: "Child Age", value: formatNumber(Math.floor(childAge / 12)) + " yr " + formatNumber(childAge % 12) + " mo" }
      ]
    };
  },
  }],
  relatedSlugs: ["baby-clothes-size-predictor","childproofing-cost-calculator","stroller-value-comparison-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Expiration Year = Manufacture Year + Seat Lifespan; Seat recommendation based on child age and weight milestones",
};
