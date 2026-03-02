import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const customsDutyCalculator: CalculatorDefinition = {
  slug: "customs-duty-calculator",
  title: "Customs Duty Calculator",
  description: "Estimate import customs duty for goods.",
  category: "Finance",
  categorySlug: "$",
  icon: "DollarSign",
  keywords: ["customs","duty","import","tariff","trade"],
  variants: [{
    id: "standard",
    name: "Customs Duty",
    description: "Estimate import customs duty for goods.",
    fields: [
      { name: "goodsValue", label: "Value of Goods ($)", type: "number", min: 1, max: 10000000, defaultValue: 10000 },
      { name: "dutyRate", label: "Duty Rate (%)", type: "number", min: 0, max: 100, defaultValue: 5 },
      { name: "freightCost", label: "Freight Cost ($)", type: "number", min: 0, max: 500000, defaultValue: 1500 },
      { name: "insuranceCost", label: "Insurance Cost ($)", type: "number", min: 0, max: 100000, defaultValue: 200 },
    ],
    calculate: (inputs) => {
    const goodsValue = inputs.goodsValue as number;
    const dutyRate = inputs.dutyRate as number;
    const freightCost = inputs.freightCost as number;
    const insuranceCost = inputs.insuranceCost as number;
    const cifValue = goodsValue + freightCost + insuranceCost;
    const dutyAmount = cifValue * (dutyRate / 100);
    const totalLandedCost = cifValue + dutyAmount;
    const effectiveDutyPercent = (dutyAmount / goodsValue) * 100;
    return {
      primary: { label: "Customs Duty", value: "$" + formatNumber(dutyAmount) },
      details: [
        { label: "CIF Value", value: "$" + formatNumber(cifValue) },
        { label: "Total After Duty", value: "$" + formatNumber(totalLandedCost) },
        { label: "Effective Duty on Goods", value: formatNumber(effectiveDutyPercent) + "%" },
        { label: "Duty Rate Applied", value: formatNumber(dutyRate) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["landed-cost-calculator","cbm-calculator","container-weight-calculator"],
  faq: [
    { question: "What is CIF value?", answer: "CIF stands for Cost, Insurance, and Freight and is used as the duty basis." },
    { question: "How do I find the duty rate?", answer: "Look up the Harmonized Tariff Schedule for your product classification." },
  ],
  formula: "Duty = (Goods Value + Freight + Insurance) x Duty Rate",
};
