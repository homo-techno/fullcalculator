import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const amazonFlexPayCalculator: CalculatorDefinition = {
  slug: "amazon-flex-pay-calculator",
  title: "Amazon Flex Pay Calculator",
  description:
    "Calculate true Amazon Flex driver earnings per hour after fuel, vehicle depreciation, and self-employment taxes. Is Amazon Flex worth it?",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Amazon Flex pay calculator",
    "Amazon Flex earnings per hour",
    "Amazon Flex net income",
    "how much does Amazon Flex pay",
    "Amazon Flex driver profit",
  ],
  variants: [
    {
      id: "block",
      name: "Per-Block Earnings",
      description: "Calculate net income for an Amazon Flex block",
      fields: [
        {
          name: "blockPay",
          label: "Block Pay",
          type: "number",
          placeholder: "e.g. 72",
          prefix: "$",
        },
        {
          name: "blockHours",
          label: "Block Duration",
          type: "number",
          placeholder: "e.g. 4",
          suffix: "hours",
        },
        {
          name: "milesPerBlock",
          label: "Miles Driven per Block",
          type: "number",
          placeholder: "e.g. 60",
          suffix: "miles",
        },
        {
          name: "deliveryType",
          label: "Delivery Type",
          type: "select",
          options: [
            { label: "Amazon.com packages", value: "packages" },
            { label: "Amazon Fresh/Whole Foods", value: "grocery" },
            { label: "Amazon Logistics (Prime Now)", value: "prime" },
          ],
          defaultValue: "packages",
        },
      ],
      calculate: (inputs) => {
        const blockPay = parseFloat(inputs.blockPay as string) || 0;
        const blockHours = parseFloat(inputs.blockHours as string) || 4;
        const miles = parseFloat(inputs.milesPerBlock as string) || 0;

        const costPerMile = 0.22;
        const vehicleCost = miles * costPerMile;
        const grossHourly = blockHours > 0 ? blockPay / blockHours : 0;
        const netPreTax = blockPay - vehicleCost;
        const netAfterTax = netPreTax * 0.70;
        const netHourly = blockHours > 0 ? netAfterTax / blockHours : 0;

        return {
          primary: { label: "Net Hourly Rate", value: `$${formatNumber(netHourly, 2)}/hr` },
          details: [
            { label: "Block pay", value: `$${formatNumber(blockPay, 2)}` },
            { label: "Block duration", value: `${blockHours} hours` },
            { label: "Gross hourly rate", value: `$${formatNumber(grossHourly, 2)}/hr` },
            { label: "Vehicle costs", value: `-$${formatNumber(vehicleCost, 2)}` },
            { label: "Net before tax", value: `$${formatNumber(netPreTax, 2)}` },
            { label: "Net after tax (~30%)", value: `$${formatNumber(netAfterTax, 2)}` },
            { label: "Net hourly rate", value: `$${formatNumber(netHourly, 2)}/hr` },
          ],
          note: "Amazon Flex pays $18–$25/hr block rate. Actual hourly is often higher if you complete routes faster than the block time. Unused block time is yours to keep.",
        };
      },
    },
  ],
  relatedSlugs: ["doordash-dasher-pay-calculator", "uber-driver-net-earnings-calculator", "gig-worker-quarterly-tax-calculator"],
  faq: [
    {
      question: "How much does Amazon Flex actually pay?",
      answer:
        "Amazon Flex base pay is $18–$25 per hour of block time, depending on market and delivery type. If you complete a 4-hour block in 3 hours, you still earn the full block pay — making efficient drivers earn $24–$33/hr effective gross rate.",
    },
    {
      question: "How do I get more Amazon Flex blocks?",
      answer:
        "Blocks are released on the app randomly, often 1–3 days in advance. Enable notifications and check the app frequently. 'Instant Offers' appear in the app for same-day blocks. High acceptance rates improve your standing.",
    },
    {
      question: "Is Amazon Flex better than DoorDash or Uber?",
      answer:
        "Amazon Flex is generally better per hour ($18–$25 block rate vs $15–$20 for rideshare). However, block availability varies by market. DoorDash and Uber offer more scheduling flexibility. Many gig workers use Amazon Flex for anchor blocks and fill with DoorDash.",
    },
  ],
  formula: "Net Hourly = (Block Pay − Vehicle Costs) ÷ Block Hours × 0.70 (after tax)",
};
