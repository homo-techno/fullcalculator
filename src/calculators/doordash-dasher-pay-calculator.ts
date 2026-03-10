import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const doordashDasherPayCalculator: CalculatorDefinition = {
  slug: "doordash-dasher-pay-calculator",
  title: "DoorDash Dasher Pay Calculator",
  description:
    "Calculate your true DoorDash Dasher earnings after gas, vehicle costs, and taxes. Find your real hourly rate delivering for DoorDash.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "DoorDash earnings calculator",
    "DoorDash dasher pay calculator",
    "how much does DoorDash pay",
    "DoorDash net income",
    "DoorDash driver profit",
  ],
  variants: [
    {
      id: "net",
      name: "Net Earnings per Shift",
      description: "Calculate true income from a DoorDash shift",
      fields: [
        {
          name: "hoursWorked",
          label: "Hours Worked",
          type: "number",
          placeholder: "e.g. 4",
          suffix: "hours",
        },
        {
          name: "grossEarnings",
          label: "Gross Earnings (base + tips)",
          type: "number",
          placeholder: "e.g. 60",
          prefix: "$",
        },
        {
          name: "milesDriven",
          label: "Miles Driven",
          type: "number",
          placeholder: "e.g. 40",
          suffix: "miles",
        },
        {
          name: "gasPrice",
          label: "Gas Price per Gallon",
          type: "number",
          placeholder: "e.g. 3.50",
          prefix: "$",
          defaultValue: 3.50,
        },
        {
          name: "mpg",
          label: "Vehicle MPG",
          type: "number",
          placeholder: "e.g. 28",
          suffix: "mpg",
          defaultValue: 28,
        },
      ],
      calculate: (inputs) => {
        const hours = parseFloat(inputs.hoursWorked as string) || 1;
        const gross = parseFloat(inputs.grossEarnings as string) || 0;
        const miles = parseFloat(inputs.milesDriven as string) || 0;
        const gasPrice = parseFloat(inputs.gasPrice as string) || 3.50;
        const mpg = parseFloat(inputs.mpg as string) || 28;

        const gasCost = (miles / mpg) * gasPrice;
        const depreciation = miles * 0.08; // lower for shorter delivery routes
        const maintenance = miles * 0.04;
        const totalVehicleCost = gasCost + depreciation + maintenance;

        const netBeforeTax = gross - totalVehicleCost;
        const netAfterTax = netBeforeTax * 0.72; // ~28% self-employment + income tax
        const trueHourly = hours > 0 ? netAfterTax / hours : 0;

        return {
          primary: { label: "True Hourly Rate", value: `$${formatNumber(trueHourly, 2)}/hr` },
          details: [
            { label: "Gross earnings", value: `$${formatNumber(gross, 2)}` },
            { label: "Gas cost", value: `-$${formatNumber(gasCost, 2)}` },
            { label: "Depreciation + maintenance", value: `-$${formatNumber(depreciation + maintenance, 2)}` },
            { label: "Net before tax", value: `$${formatNumber(netBeforeTax, 2)}` },
            { label: "Net after SE + income tax", value: `$${formatNumber(netAfterTax, 2)}` },
            { label: "True hourly rate", value: `$${formatNumber(trueHourly, 2)}/hr` },
            { label: "Gross hourly (before expenses)", value: `$${formatNumber(gross / hours, 2)}/hr` },
          ],
          note: "DoorDash tips average $3–$7 per delivery. Tip baiting (high promised tip that gets reduced) costs drivers $2–$5/hr in expected income.",
        };
      },
    },
  ],
  relatedSlugs: ["instacart-shopper-pay-calculator", "food-delivery-earnings-calculator", "gig-worker-quarterly-tax-calculator"],
  faq: [
    {
      question: "How much do DoorDash drivers make per hour?",
      answer:
        "DoorDash advertises $15–$25/hr but actual net after vehicle costs and taxes is $8–$14/hr for most drivers. Top Dashers in dense urban areas with fuel-efficient cars can net $14–$18/hr.",
    },
    {
      question: "How does DoorDash pay work?",
      answer:
        "DoorDash pay = Base Pay ($2–$10 per delivery) + Tips + Promotions/Challenges. DoorDash doesn't take a cut of driver pay per se — their revenue comes from the restaurant commission and customer delivery fee. Drivers receive 100% of customer tips.",
    },
    {
      question: "Should I accept all DoorDash orders?",
      answer:
        "Experienced Dashers recommend declining orders with low pay/mileage ratios. A good rule: minimum $1–$1.50 per mile. Decline anything under $2 base pay. Long-distance orders (8+ miles for $3) have poor return on vehicle cost.",
    },
  ],
  formula: "Net Hourly = (Gross − Gas − Depreciation − Maintenance) ÷ Hours × 0.72 (after tax)",
};
