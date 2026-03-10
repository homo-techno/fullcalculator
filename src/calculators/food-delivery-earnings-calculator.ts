import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const foodDeliveryEarningsCalculator: CalculatorDefinition = {
  slug: "food-delivery-earnings-calculator",
  title: "Food Delivery Earnings Calculator",
  description:
    "Compare DoorDash, Uber Eats, Grubhub, and Instacart net earnings per hour. Find which food delivery platform pays the most in your market.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "food delivery earnings comparison",
    "DoorDash vs Uber Eats income",
    "best food delivery app to work for",
    "food delivery driver income calculator",
    "delivery driver pay comparison",
  ],
  variants: [
    {
      id: "compare",
      name: "Platform Comparison",
      description: "Compare net earnings across food delivery apps",
      fields: [
        {
          name: "deliveriesPerHour",
          label: "Deliveries per Hour",
          type: "number",
          placeholder: "e.g. 2",
          suffix: "deliveries",
          defaultValue: 2,
        },
        {
          name: "avgBasePay",
          label: "Average Base Pay per Delivery",
          type: "number",
          placeholder: "e.g. 4",
          prefix: "$",
          defaultValue: 4,
        },
        {
          name: "avgTip",
          label: "Average Tip per Delivery",
          type: "number",
          placeholder: "e.g. 5",
          prefix: "$",
          defaultValue: 5,
        },
        {
          name: "milesPerDelivery",
          label: "Miles per Delivery (round trip)",
          type: "number",
          placeholder: "e.g. 4",
          suffix: "miles",
          defaultValue: 4,
        },
        {
          name: "platform",
          label: "Platform",
          type: "select",
          options: [
            { label: "DoorDash", value: "doordash" },
            { label: "Uber Eats", value: "ubereats" },
            { label: "Grubhub", value: "grubhub" },
            { label: "Instacart", value: "instacart" },
          ],
          defaultValue: "doordash",
        },
      ],
      calculate: (inputs) => {
        const delivPerHour = parseFloat(inputs.deliveriesPerHour as string) || 2;
        const basePay = parseFloat(inputs.avgBasePay as string) || 4;
        const tip = parseFloat(inputs.avgTip as string) || 5;
        const milesPerDelivery = parseFloat(inputs.milesPerDelivery as string) || 4;
        const platform = inputs.platform as string;

        // Platform-specific tip guarantees and promotions
        const platformMultiplier: Record<string, number> = {
          doordash: 1.0,
          ubereats: 1.05, // slightly higher base in some markets
          grubhub: 0.95,
          instacart: 1.15, // higher tips on average
        };
        const mult = platformMultiplier[platform] || 1.0;

        const grossPerDelivery = (basePay + tip) * mult;
        const grossHourly = grossPerDelivery * delivPerHour;
        const milesPerHour = milesPerDelivery * delivPerHour;
        const vehicleCostPerMile = 0.22;
        const vehicleCostHourly = milesPerHour * vehicleCostPerMile;

        const netBeforeTax = grossHourly - vehicleCostHourly;
        const netAfterTax = netBeforeTax * 0.72;

        const weeklyNet = netAfterTax * 20; // 20 hr week
        const monthlyNet = weeklyNet * 4.33;

        // Comparison to other platforms
        const platforms = [
          { name: "DoorDash", mult: 1.0 },
          { name: "Uber Eats", mult: 1.05 },
          { name: "Grubhub", mult: 0.95 },
          { name: "Instacart", mult: 1.15 },
        ];
        const bestPlatform = platforms.reduce((best, p) => {
          const net = ((basePay + tip) * p.mult * delivPerHour - vehicleCostHourly) * 0.72;
          const bestNet = ((basePay + tip) * best.mult * delivPerHour - vehicleCostHourly) * 0.72;
          return net > bestNet ? p : best;
        });

        return {
          primary: { label: "Net Hourly Rate", value: `$${formatNumber(netAfterTax, 2)}/hr` },
          details: [
            { label: "Gross per delivery", value: `$${formatNumber(grossPerDelivery, 2)}` },
            { label: "Deliveries per hour", value: `${delivPerHour}` },
            { label: "Gross hourly", value: `$${formatNumber(grossHourly, 2)}` },
            { label: "Vehicle cost per hour", value: `-$${formatNumber(vehicleCostHourly, 2)}` },
            { label: "Net before tax", value: `$${formatNumber(netBeforeTax, 2)}` },
            { label: "Net after tax (~28%)", value: `$${formatNumber(netAfterTax, 2)}/hr` },
            { label: "Weekly net (20 hrs)", value: `$${formatNumber(weeklyNet, 2)}` },
            { label: "Monthly net income", value: `$${formatNumber(monthlyNet, 2)}` },
            { label: "Best paying platform (these inputs)", value: bestPlatform.name },
          ],
          note: `Tip quality varies dramatically by platform and market. ${platform === "instacart" ? "Instacart" : "DoorDash"} typically has highest tips in most US markets. Multi-apping (running 2 apps simultaneously) can increase earnings 20–30%.`,
        };
      },
    },
  ],
  relatedSlugs: ["doordash-dasher-pay-calculator", "instacart-shopper-pay-calculator", "uber-driver-net-earnings-calculator"],
  faq: [
    {
      question: "Which food delivery app pays the most?",
      answer:
        "Earnings vary by market. Generally: Instacart pays most in suburban markets ($15–$22/hr net) due to higher tips. DoorDash pays most in urban markets due to volume ($12–$18/hr net). Uber Eats often has promotional boosts. Most top earners use 2–3 apps simultaneously.",
    },
    {
      question: "What is the best food delivery app to work for?",
      answer:
        "For flexibility: DoorDash (no schedule required). For earnings: Instacart (higher tips, batch orders). For consistency: Amazon Flex (guaranteed block pay). Many drivers 'multi-app' — accepting orders from multiple platforms to minimize wait time between deliveries.",
    },
    {
      question: "How many deliveries per hour is good?",
      answer:
        "2+ deliveries per hour is good; 3+ is excellent. Factors: restaurant proximity, order volume, map familiarity, and traffic. Deliveries under 3 miles earn the best return. Rejecting orders under $1/mile significantly improves hourly rate.",
    },
  ],
  formula: "Net Hourly = (Base Pay + Tips) × Deliveries/hr − Vehicle Costs/hr − 28% Tax",
};
