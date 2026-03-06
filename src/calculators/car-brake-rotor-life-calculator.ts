import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carBrakeRotorLifeCalculator: CalculatorDefinition = {
  slug: "car-brake-rotor-life-calculator",
  title: "Car Brake Rotor Life Calculator",
  description: "Estimate remaining brake rotor life and replacement cost based on rotor thickness, minimum specification, and driving patterns.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["brake rotor life","rotor replacement","brake disc wear","rotor thickness calculator"],
  variants: [{
    id: "standard",
    name: "Car Brake Rotor Life",
    description: "Estimate remaining brake rotor life and replacement cost based on rotor thickness, minimum specification, and driving patterns.",
    fields: [
      { name: "currentThickness", label: "Current Rotor Thickness (mm)", type: "number", min: 15, max: 40, defaultValue: 26 },
      { name: "minimumThickness", label: "Minimum Thickness Spec (mm)", type: "number", min: 12, max: 35, defaultValue: 22 },
      { name: "originalThickness", label: "Original Thickness (mm)", type: "number", min: 20, max: 40, defaultValue: 30 },
      { name: "milesSinceNew", label: "Miles Since Rotors New", type: "number", min: 0, max: 200000, defaultValue: 35000 },
      { name: "monthlyMiles", label: "Monthly Miles Driven", type: "number", min: 100, max: 10000, defaultValue: 1200 },
      { name: "rotorSetCost", label: "Rotor Set Cost ($)", type: "number", min: 50, max: 1000, defaultValue: 200 },
    ],
    calculate: (inputs) => {
    const current = inputs.currentThickness as number;
    const minimum = inputs.minimumThickness as number;
    const original = inputs.originalThickness as number;
    const miles = inputs.milesSinceNew as number;
    const monthly = inputs.monthlyMiles as number;
    const rotorCost = inputs.rotorSetCost as number;
    const totalWorn = original - current;
    const usableRemaining = current - minimum;
    const wearRate = totalWorn > 0 ? miles / totalWorn : 0;
    const milesRemaining = Math.round(usableRemaining * wearRate);
    const monthsRemaining = monthly > 0 ? Math.round(milesRemaining / monthly * 10) / 10 : 0;
    const percentWorn = Math.round(totalWorn / (original - minimum) * 100);
    const laborEstimate = 150;
    const totalReplacementCost = rotorCost + laborEstimate;
    return {
      primary: { label: "Estimated Miles Remaining", value: formatNumber(milesRemaining) + " mi" },
      details: [
        { label: "Months Until Replacement", value: formatNumber(monthsRemaining) },
        { label: "Rotor Wear", value: formatNumber(Math.min(percentWorn, 100)) + "%" },
        { label: "Remaining Thickness Above Min", value: formatNumber(Math.round(usableRemaining * 10) / 10) + " mm" },
        { label: "Replacement Cost (parts + labor)", value: "$" + formatNumber(totalReplacementCost) },
        { label: "Status", value: usableRemaining <= 0 ? "Replace Now" : usableRemaining <= 1 ? "Replace Soon" : "Good" }
      ]
    };
  },
  }],
  relatedSlugs: ["brake-pad-life-calculator","tire-tread-life-calculator"],
  faq: [
    { question: "How do I know if my brake rotors need replacing?", answer: "Measure rotor thickness with a micrometer and compare to the minimum specification stamped on the rotor. Visible grooves deeper than 1mm, blue discoloration, or vibration during braking also indicate replacement is needed." },
    { question: "Can brake rotors be resurfaced instead of replaced?", answer: "Rotors can be resurfaced if there is enough material above the minimum thickness specification. However, modern rotors are thinner and many cannot be resurfaced. Replacement is often more cost-effective." },
    { question: "How long do brake rotors last?", answer: "Brake rotors typically last 50,000 to 80,000 miles depending on driving habits, vehicle weight, and whether brake pads were replaced on time. Aggressive driving and frequent towing shorten rotor life." },
  ],
  formula: "Wear Rate = Miles Driven / Thickness Worn (mm); Miles Remaining = Usable Thickness Left x Wear Rate; Usable Remaining = Current Thickness - Minimum Spec",
};
