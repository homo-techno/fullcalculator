import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const foodTrailerLicensingCostCalculator: CalculatorDefinition = {
  slug: "food-trailer-licensing-cost-calculator",
  title: "Food Trailer Licensing Cost Calculator",
  description: "Estimate all licensing, permit, and registration costs required to legally operate a food trailer or mobile food vending business in your area.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["food trailer license","mobile food permit","food truck permits","food vendor license cost"],
  variants: [{
    id: "standard",
    name: "Food Trailer Licensing Cost",
    description: "Estimate all licensing, permit, and registration costs required to legally operate a food trailer or mobile food vending business in your area.",
    fields: [
      { name: "businessLicense", label: "Business License ($)", type: "number", min: 0, max: 5000, defaultValue: 250 },
      { name: "healthPermit", label: "Health Department Permit ($)", type: "number", min: 0, max: 5000, defaultValue: 500 },
      { name: "fireSafety", label: "Fire Safety Inspection ($)", type: "number", min: 0, max: 2000, defaultValue: 200 },
      { name: "mobileVendor", label: "Mobile Vendor Permit ($)", type: "number", min: 0, max: 5000, defaultValue: 400 },
      { name: "vehicleRegistration", label: "Vehicle Registration ($)", type: "number", min: 0, max: 2000, defaultValue: 150 },
      { name: "commissaryFee", label: "Monthly Commissary Fee ($)", type: "number", min: 0, max: 3000, defaultValue: 500 },
      { name: "liabilityInsurance", label: "Annual Liability Insurance ($)", type: "number", min: 500, max: 15000, defaultValue: 3000 },
    ],
    calculate: (inputs) => {
    const business = inputs.businessLicense as number;
    const health = inputs.healthPermit as number;
    const fire = inputs.fireSafety as number;
    const vendor = inputs.mobileVendor as number;
    const registration = inputs.vehicleRegistration as number;
    const commissary = inputs.commissaryFee as number;
    const insurance = inputs.liabilityInsurance as number;
    const oneTimeTotal = business + health + fire + vendor + registration;
    const annualRecurring = (commissary * 12) + insurance;
    const firstYearTotal = oneTimeTotal + annualRecurring;
    const monthlyLicensingCost = Math.round(firstYearTotal / 12);
    return {
      primary: { label: "First Year Total Cost", value: "$" + formatNumber(Math.round(firstYearTotal)) },
      details: [
        { label: "One-Time Permits and Licenses", value: "$" + formatNumber(Math.round(oneTimeTotal)) },
        { label: "Annual Recurring Costs", value: "$" + formatNumber(Math.round(annualRecurring)) },
        { label: "Monthly Commissary", value: "$" + formatNumber(Math.round(commissary)) },
        { label: "Monthly Insurance", value: "$" + formatNumber(Math.round(insurance / 12)) },
        { label: "Average Monthly Licensing Cost", value: "$" + formatNumber(monthlyLicensingCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["food-truck-startup-cost-calculator","restaurant-break-even-calculator"],
  faq: [
    { question: "What permits do I need for a food trailer?", answer: "Typical requirements include a business license, health department food service permit, fire safety inspection certificate, mobile food vendor permit, vehicle registration, liability insurance, and often a commissary agreement for prep and storage." },
    { question: "How much do food trailer permits cost?", answer: "Total first-year permit and licensing costs range from $2,000 to $10,000 depending on your city and state. Annual renewal costs are typically 40 to 60 percent of first-year costs since one-time fees are not repeated." },
    { question: "What is a commissary kitchen requirement?", answer: "Many cities require food trailers to operate from a licensed commissary kitchen for food prep, storage, and waste disposal. Commissary fees range from $300 to $1,500 per month depending on the facility and your usage level." },
  ],
  formula: "One-Time Costs = Business License + Health Permit + Fire Safety + Vendor Permit + Registration
Annual Recurring = (Commissary x 12) + Insurance
First Year Total = One-Time Costs + Annual Recurring",
};
