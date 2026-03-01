import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const commercialRentCalculator: CalculatorDefinition = {
  slug: "commercial-rent-calculator",
  title: "Commercial Rent Calculator",
  description: "Calculate the total cost of leasing commercial space including base rent, CAM charges, and other fees.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["commercial rent calculator", "commercial lease cost", "office rent calculator"],
  variants: [{
    id: "standard",
    name: "Commercial Rent",
    description: "Calculate the total cost of leasing commercial space including base rent, CAM charges, and other fees",
    fields: [
      { name: "sqft", label: "Square Footage", type: "number", suffix: "sq ft", min: 200, max: 50000, defaultValue: 2000 },
      { name: "pricePerSqft", label: "Annual Price per Sq Ft", type: "number", suffix: "$", min: 5, max: 200, defaultValue: 25 },
      { name: "cam", label: "CAM Charges per Sq Ft", type: "number", suffix: "$", min: 0, max: 30, defaultValue: 8 },
      { name: "leaseYears", label: "Lease Term", type: "number", suffix: "years", min: 1, max: 15, defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const sqft = inputs.sqft as number;
      const price = inputs.pricePerSqft as number;
      const cam = inputs.cam as number;
      const years = inputs.leaseYears as number;
      if (!sqft || !price) return null;
      const annualBase = sqft * price;
      const annualCam = sqft * cam;
      const annualTotal = annualBase + annualCam;
      const monthlyTotal = annualTotal / 12;
      const totalLease = annualTotal * years;
      return {
        primary: { label: "Monthly Total Cost", value: "$" + formatNumber(monthlyTotal) },
        details: [
          { label: "Annual Base Rent", value: "$" + formatNumber(annualBase) },
          { label: "Annual CAM Charges", value: "$" + formatNumber(annualCam) },
          { label: "Annual Total", value: "$" + formatNumber(annualTotal) },
          { label: "Total Lease Cost (" + years + " years)", value: "$" + formatNumber(totalLease) },
          { label: "Effective Rate per Sq Ft", value: "$" + formatNumber(annualTotal / sqft) },
        ],
      };
    },
  }],
  relatedSlugs: ["triple-net-lease-calculator", "cap-rate-comparison-calculator"],
  faq: [
    { question: "What is a CAM charge?", answer: "Common Area Maintenance (CAM) charges cover shared expenses like property taxes, insurance, landscaping, and common area upkeep. CAM charges typically add $5 to $15 per square foot per year." },
    { question: "How is commercial rent calculated?", answer: "Commercial rent is usually quoted as an annual price per square foot. The total cost includes base rent plus CAM charges, taxes, and insurance. A $25 per square foot rate for 2,000 square feet equals $50,000 per year." },
  ],
  formula: "Monthly Cost = (Sq Ft x (Price per Sq Ft + CAM)) / 12; Total Lease = Annual Total x Years",
};
