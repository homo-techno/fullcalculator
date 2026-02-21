import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const licensePlateFeeCalculator: CalculatorDefinition = {
  slug: "license-plate-fee-calculator",
  title: "License Plate & Registration Fee Calculator",
  description: "Free license plate and registration fee estimator. Estimate your annual vehicle registration, plate, and title fees based on vehicle value and weight.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["license plate fee", "registration fee calculator", "vehicle registration cost", "car registration", "title fee calculator"],
  variants: [
    {
      id: "estimate",
      name: "Estimate Registration Fees",
      description: "Estimate your vehicle registration and plate fees",
      fields: [
        { name: "vehicleValue", label: "Vehicle Value", type: "number", placeholder: "e.g. 30000", prefix: "$" },
        { name: "vehicleAge", label: "Vehicle Age (years)", type: "number", placeholder: "e.g. 3" },
        { name: "vehicleWeight", label: "Vehicle Weight (lbs)", type: "number", placeholder: "e.g. 3500" },
        { name: "feeStructure", label: "Fee Basis", type: "select", options: [
          { label: "Value-based (ad valorem)", value: "value" },
          { label: "Weight-based", value: "weight" },
          { label: "Flat fee", value: "flat" },
          { label: "Combination (value + weight)", value: "combo" },
        ], defaultValue: "value" },
        { name: "isNewReg", label: "Registration Type", type: "select", options: [
          { label: "New registration / transfer", value: "new" },
          { label: "Annual renewal", value: "renewal" },
        ], defaultValue: "renewal" },
      ],
      calculate: (inputs) => {
        const value = inputs.vehicleValue as number;
        const age = (inputs.vehicleAge as number) || 0;
        const weight = (inputs.vehicleWeight as number) || 3500;
        const feeStructure = (inputs.feeStructure as string) || "value";
        const isNew = (inputs.isNewReg as string) === "new";
        if (!value) return null;

        let registrationFee = 0;
        let titleFee = isNew ? 35 : 0; // average title fee
        let plateFee = isNew ? 25 : 0; // new plate fee
        const techFee = 5; // technology/processing fee

        // Calculate depreciated value for registration
        const depreciatedValue = value * Math.pow(0.85, age);

        switch (feeStructure) {
          case "value":
            // Ad valorem: typically 1-3% of depreciated value
            registrationFee = depreciatedValue * 0.015;
            break;
          case "weight":
            // Weight-based: varies, typically $0.01-$0.02 per lb
            registrationFee = weight * 0.015 + 50; // base + per-lb
            break;
          case "flat":
            registrationFee = 75; // average flat fee
            break;
          case "combo":
            registrationFee = depreciatedValue * 0.01 + weight * 0.008 + 25;
            break;
        }

        const inspectionFee = 15; // average state inspection
        const totalAnnual = registrationFee + techFee + inspectionFee;
        const totalFirstTime = totalAnnual + titleFee + plateFee;

        return {
          primary: { label: isNew ? "Total First-Time Fees" : "Annual Registration Cost", value: `$${formatNumber(isNew ? totalFirstTime : totalAnnual)}` },
          details: [
            { label: "Registration fee", value: `$${formatNumber(registrationFee)}` },
            ...(isNew ? [
              { label: "Title fee", value: `$${formatNumber(titleFee)}` },
              { label: "Plate fee", value: `$${formatNumber(plateFee)}` },
            ] : []),
            { label: "Technology/processing fee", value: `$${formatNumber(techFee)}` },
            { label: "Inspection fee (est.)", value: `$${formatNumber(inspectionFee)}` },
            { label: "Depreciated value used", value: `$${formatNumber(depreciatedValue)}` },
          ],
          note: "Fees vary significantly by state. This is a general estimate. Contact your local DMV for exact fees. Some states also charge emissions testing fees and county-specific fees.",
        };
      },
    },
  ],
  relatedSlugs: ["vehicle-tax-calculator", "car-payment-calculator", "car-insurance-calculator"],
  faq: [
    { question: "What fees are involved in registering a car?", answer: "Common fees include registration fee, title fee (for new purchases/transfers), plate fee, emissions testing fee, state inspection fee, and various processing fees. Total first-time fees typically range from $100-$500+ depending on the state and vehicle value." },
    { question: "How do states calculate registration fees?", answer: "It varies by state. Some use a percentage of vehicle value (ad valorem), some base it on vehicle weight, some charge a flat fee, and some use a combination. California, for example, charges 0.65% of the vehicle's value plus fixed fees. Some states like Oregon base fees primarily on MPG rating." },
    { question: "Are registration fees tax deductible?", answer: "The value-based (ad valorem) portion of your registration fee may be deductible as a personal property tax on your federal tax return if you itemize deductions. The flat fee portions are generally not deductible. Keep your registration receipt for tax purposes." },
  ],
  formula: "Fees vary by state. Value-based = Depreciated Value x Rate; Weight-based = Vehicle Weight x Rate + Base Fee",
};
