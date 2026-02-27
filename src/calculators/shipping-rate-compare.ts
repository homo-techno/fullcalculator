import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const shippingRateCompareCalculator: CalculatorDefinition = {
  slug: "shipping-rate-compare",
  title: "Shipping Rate Comparison Calculator",
  description:
    "Compare shipping rates between USPS, UPS, and FedEx for your package size and weight to find the cheapest option.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "shipping",
    "USPS",
    "UPS",
    "FedEx",
    "shipping rate",
    "comparison",
    "postage",
    "ecommerce",
  ],
  variants: [
    {
      slug: "shipping-rate-compare",
      title: "Carrier Rate Comparison",
      description:
        "Estimate and compare shipping rates across major carriers for your package.",
      fields: [
        {
          name: "packageWeight",
          label: "Package Weight (lbs)",
          type: "number",
          defaultValue: "3",
        },
        {
          name: "longestSide",
          label: "Longest Side (inches)",
          type: "number",
          defaultValue: "12",
        },
        {
          name: "width",
          label: "Width (inches)",
          type: "number",
          defaultValue: "8",
        },
        {
          name: "height",
          label: "Height (inches)",
          type: "number",
          defaultValue: "6",
        },
        {
          name: "shippingSpeed",
          label: "Shipping Speed",
          type: "select",
          defaultValue: "ground",
          options: [
            { label: "Ground (5-7 days)", value: "ground" },
            { label: "3-Day Select", value: "threeday" },
            { label: "2-Day", value: "twoday" },
            { label: "Overnight", value: "overnight" },
          ],
        },
        {
          name: "monthlyVolume",
          label: "Monthly Package Volume",
          type: "number",
          defaultValue: "50",
        },
        {
          name: "declaredValue",
          label: "Declared Value ($)",
          type: "number",
          defaultValue: "50",
        },
      ],
      calculate(inputs) {
        const weight = parseFloat(inputs.packageWeight as string);
        const length = parseFloat(inputs.longestSide as string);
        const width = parseFloat(inputs.width as string);
        const height = parseFloat(inputs.height as string);
        const speed = inputs.shippingSpeed as string;
        const volume = parseFloat(inputs.monthlyVolume as string);
        const declared = parseFloat(inputs.declaredValue as string);

        const dimWeight = (length * width * height) / 139;
        const billableWeight = Math.max(weight, dimWeight);

        const speedMultiplier =
          speed === "ground"
            ? 1
            : speed === "threeday"
            ? 1.8
            : speed === "twoday"
            ? 2.5
            : 4.5;

        const uspsBase = 4.5 + billableWeight * 0.75;
        const upsBase = 8.5 + billableWeight * 1.1;
        const fedexBase = 8.2 + billableWeight * 1.05;

        const uspsRate = uspsBase * (speed === "ground" ? 1 : speed === "twoday" ? 2.2 : speed === "threeday" ? 1.6 : 3.8);
        const upsRate = upsBase * speedMultiplier;
        const fedexRate = fedexBase * speedMultiplier;

        const insuranceCost = declared > 100 ? (declared - 100) * 0.02 + 3 : declared > 0 ? 3 : 0;

        const uspsTotal = uspsRate + insuranceCost;
        const upsTotal = upsRate + (declared > 100 ? insuranceCost : 0);
        const fedexTotal = fedexRate + (declared > 100 ? insuranceCost : 0);

        const cheapest = Math.min(uspsTotal, upsTotal, fedexTotal);
        const cheapestCarrier =
          cheapest === uspsTotal ? "USPS" : cheapest === upsTotal ? "UPS" : "FedEx";

        const monthlyUsps = uspsTotal * volume;
        const monthlyUps = upsTotal * volume;
        const monthlyFedex = fedexTotal * volume;
        const monthlySavings = Math.max(monthlyUsps, monthlyUps, monthlyFedex) - Math.min(monthlyUsps, monthlyUps, monthlyFedex);

        return {
          "Billable Weight": `${formatNumber(billableWeight)} lbs`,
          "Dim Weight": `${formatNumber(dimWeight)} lbs`,
          "USPS Estimated Rate": `$${formatNumber(uspsTotal)}`,
          "UPS Estimated Rate": `$${formatNumber(upsTotal)}`,
          "FedEx Estimated Rate": `$${formatNumber(fedexTotal)}`,
          "Cheapest Option": cheapestCarrier,
          "Monthly Cost (USPS)": `$${formatNumber(monthlyUsps)}`,
          "Monthly Cost (UPS)": `$${formatNumber(monthlyUps)}`,
          "Monthly Cost (FedEx)": `$${formatNumber(monthlyFedex)}`,
          "Monthly Savings (Best vs Worst)": `$${formatNumber(monthlySavings)}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "product-pricing",
    "wholesale-markup",
    "inventory-reorder",
  ],
  faq: [
    {
      question: "How is dimensional weight calculated?",
      answer:
        "Dimensional (DIM) weight is calculated as Length x Width x Height / DIM factor. The DIM factor is 139 for domestic shipments (UPS/FedEx) and 166 for USPS. Carriers charge based on the greater of actual weight or DIM weight.",
    },
    {
      question: "Which shipping carrier is cheapest for small packages?",
      answer:
        "For packages under 1 lb, USPS First Class is usually cheapest ($3-5). For 1-5 lbs, USPS Priority Mail is competitive. For heavier packages (5+ lbs), UPS and FedEx Ground often offer better rates, especially with volume discounts.",
    },
    {
      question: "Can I get shipping discounts?",
      answer:
        "Yes. Use platforms like Pirate Ship, ShipStation, or Shippo for discounted USPS/UPS rates (often 50%+ off retail). High-volume shippers can negotiate direct carrier accounts. Many ecommerce platforms also include discounted shipping.",
    },
  ],
  formula:
    "Dim Weight = (L x W x H) / 139. Billable Weight = max(Actual, Dim). Rate = Base Rate + (Billable Weight x Per-Lb Rate) x Speed Multiplier + Insurance. Monthly Cost = Rate x Volume.",
};
