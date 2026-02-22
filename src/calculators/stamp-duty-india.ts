import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stampDutyIndiaCalculator: CalculatorDefinition = {
  slug: "stamp-duty-india-calculator",
  title: "Stamp Duty Calculator India",
  description:
    "Free stamp duty calculator for India. Calculate stamp duty and registration charges for property purchase across all Indian states.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "stamp duty calculator",
    "stamp duty India",
    "registration charges",
    "property stamp duty",
    "stamp duty rates",
    "property registration cost",
  ],
  variants: [
    {
      id: "basic",
      name: "Stamp Duty Calculator",
      description: "Calculate stamp duty and registration charges by state",
      fields: [
        {
          name: "propertyValue",
          label: "Property Value / Agreement Value",
          type: "number",
          placeholder: "e.g. 5000000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "state",
          label: "State",
          type: "select",
          options: [
            { label: "Maharashtra", value: "MH" },
            { label: "Karnataka", value: "KA" },
            { label: "Tamil Nadu", value: "TN" },
            { label: "Delhi", value: "DL" },
            { label: "Uttar Pradesh", value: "UP" },
            { label: "Telangana", value: "TS" },
            { label: "Gujarat", value: "GJ" },
            { label: "Rajasthan", value: "RJ" },
            { label: "West Bengal", value: "WB" },
            { label: "Kerala", value: "KL" },
            { label: "Madhya Pradesh", value: "MP" },
            { label: "Haryana", value: "HR" },
          ],
          defaultValue: "MH",
        },
        {
          name: "gender",
          label: "Buyer Gender",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Joint (Male + Female)", value: "joint" },
          ],
          defaultValue: "male",
        },
      ],
      calculate: (inputs) => {
        const propertyValue = inputs.propertyValue as number;
        const state = inputs.state as string;
        const gender = inputs.gender as string;
        if (!propertyValue) return null;

        // Stamp duty rates by state (approximate, general rates)
        const rates: Record<string, { male: number; female: number; registration: number }> = {
          MH: { male: 6, female: 5, registration: 1 },
          KA: { male: 5.6, female: 5.6, registration: 1 },
          TN: { male: 7, female: 7, registration: 4 },
          DL: { male: 6, female: 4, registration: 1 },
          UP: { male: 7, female: 6, registration: 1 },
          TS: { male: 6, female: 6, registration: 0.5 },
          GJ: { male: 4.9, female: 4.9, registration: 1 },
          RJ: { male: 6, female: 5, registration: 1 },
          WB: { male: 7, female: 7, registration: 1 },
          KL: { male: 8, female: 8, registration: 2 },
          MP: { male: 7.5, female: 7.5, registration: 3 },
          HR: { male: 7, female: 5, registration: 1 },
        };

        const stateRates = rates[state] || rates.MH;
        let stampDutyRate: number;

        if (gender === "female") {
          stampDutyRate = stateRates.female;
        } else if (gender === "joint") {
          stampDutyRate = (stateRates.male + stateRates.female) / 2;
        } else {
          stampDutyRate = stateRates.male;
        }

        const stampDuty = propertyValue * (stampDutyRate / 100);
        const registrationCharges = propertyValue * (stateRates.registration / 100);
        const totalCost = stampDuty + registrationCharges;
        const totalPropertyCost = propertyValue + totalCost;

        return {
          primary: { label: "Total Stamp Duty + Registration", value: `₹${formatNumber(totalCost)}` },
          details: [
            { label: "Property value", value: `₹${formatNumber(propertyValue)}` },
            { label: `Stamp duty (${stampDutyRate}%)`, value: `₹${formatNumber(stampDuty)}` },
            { label: `Registration charges (${stateRates.registration}%)`, value: `₹${formatNumber(registrationCharges)}` },
            { label: "Total property cost", value: `₹${formatNumber(totalPropertyCost)}` },
            {
              label: "Additional cost as % of property value",
              value: `${formatNumber((totalCost / propertyValue) * 100, 2)}%`,
            },
          ],
          note: "Rates are approximate and may vary based on property type, location within the state, and applicable surcharges. Check with local registrar for exact rates.",
        };
      },
    },
    {
      id: "comparison",
      name: "Compare States",
      description: "Compare stamp duty between two states for the same property",
      fields: [
        {
          name: "propertyValue",
          label: "Property Value",
          type: "number",
          placeholder: "e.g. 5000000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "state1",
          label: "State 1",
          type: "select",
          options: [
            { label: "Maharashtra", value: "6" },
            { label: "Karnataka", value: "5.6" },
            { label: "Tamil Nadu", value: "7" },
            { label: "Delhi", value: "6" },
            { label: "Gujarat", value: "4.9" },
            { label: "Telangana", value: "6" },
            { label: "Kerala", value: "8" },
            { label: "Uttar Pradesh", value: "7" },
          ],
          defaultValue: "6",
        },
        {
          name: "state2",
          label: "State 2",
          type: "select",
          options: [
            { label: "Maharashtra", value: "6" },
            { label: "Karnataka", value: "5.6" },
            { label: "Tamil Nadu", value: "7" },
            { label: "Delhi", value: "6" },
            { label: "Gujarat", value: "4.9" },
            { label: "Telangana", value: "6" },
            { label: "Kerala", value: "8" },
            { label: "Uttar Pradesh", value: "7" },
          ],
          defaultValue: "5.6",
        },
      ],
      calculate: (inputs) => {
        const propertyValue = inputs.propertyValue as number;
        const rate1 = parseFloat(inputs.state1 as string);
        const rate2 = parseFloat(inputs.state2 as string);
        if (!propertyValue) return null;

        const duty1 = propertyValue * (rate1 / 100);
        const duty2 = propertyValue * (rate2 / 100);
        const difference = Math.abs(duty1 - duty2);

        return {
          primary: { label: "Stamp Duty Difference", value: `₹${formatNumber(difference)}` },
          details: [
            { label: `State 1 stamp duty (${rate1}%)`, value: `₹${formatNumber(duty1)}` },
            { label: `State 2 stamp duty (${rate2}%)`, value: `₹${formatNumber(duty2)}` },
            { label: "Savings", value: `₹${formatNumber(difference)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-affordability-calculator", "mortgage-calculator", "income-tax-india-calculator"],
  faq: [
    {
      question: "What is stamp duty?",
      answer:
        "Stamp duty is a tax levied by state governments on property transactions. It is paid at the time of property registration and varies by state, property type, and location. It is a one-time tax payable by the property buyer.",
    },
    {
      question: "Do women get a stamp duty discount?",
      answer:
        "Yes, several states offer reduced stamp duty for women buyers. For example, Delhi charges 4% for women vs 6% for men, Maharashtra charges 5% vs 6%, and Haryana charges 5% vs 7%. Registering property in a woman's name can save significant amounts.",
    },
    {
      question: "Can stamp duty be claimed as a tax deduction?",
      answer:
        "Yes, stamp duty and registration charges paid for a residential property can be claimed as a deduction under Section 80C of the Income Tax Act, subject to the overall limit of ₹1.5 lakh. This is available only in the year of payment.",
    },
  ],
  formula: "Stamp Duty = Property Value × State Rate | Registration = Property Value × Registration Rate",
};
