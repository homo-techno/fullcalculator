import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingDressAlterationCostCalculator: CalculatorDefinition = {
  slug: "wedding-dress-alteration-cost-calculator",
  title: "Wedding Dress Alteration Cost Calculator",
  description: "Estimate wedding dress alteration costs based on the type of alterations needed including hemming, bustle, bodice, and adding details.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["wedding dress alterations","bridal gown fitting","dress tailoring cost","wedding dress hemming"],
  variants: [{
    id: "standard",
    name: "Wedding Dress Alteration Cost",
    description: "Estimate wedding dress alteration costs based on the type of alterations needed including hemming, bustle, bodice, and adding details.",
    fields: [
      { name: "hemming", label: "Hemming Needed", type: "select", options: [{ value: "0", label: "None" }, { value: "100", label: "Simple Hem ($100)" }, { value: "250", label: "Multi-Layer Hem ($250)" }, { value: "400", label: "Lace/Beaded Hem ($400)" }], defaultValue: "100" },
      { name: "bustleType", label: "Bustle Type", type: "select", options: [{ value: "0", label: "None" }, { value: "75", label: "Simple Bustle ($75)" }, { value: "150", label: "French Bustle ($150)" }, { value: "250", label: "Multi-Point Bustle ($250)" }], defaultValue: "75" },
      { name: "bodiceWork", label: "Bodice Alterations", type: "select", options: [{ value: "0", label: "None" }, { value: "75", label: "Take In/Let Out ($75)" }, { value: "150", label: "Restructure ($150)" }, { value: "250", label: "Add Boning/Cups ($250)" }], defaultValue: "75" },
      { name: "strapAdjust", label: "Strap/Sleeve Work", type: "select", options: [{ value: "0", label: "None" }, { value: "50", label: "Shorten Straps ($50)" }, { value: "150", label: "Add Sleeves ($150)" }, { value: "200", label: "Cap to Long Sleeve ($200)" }], defaultValue: "0" },
      { name: "pressing", label: "Professional Pressing", type: "select", options: [{ value: "0", label: "Not Needed" }, { value: "75", label: "Standard ($75)" }, { value: "150", label: "Full Steaming ($150)" }], defaultValue: "75" },
    ],
    calculate: (inputs) => {
    const hem = parseFloat(inputs.hemming as unknown as string);
    const bustle = parseFloat(inputs.bustleType as unknown as string);
    const bodice = parseFloat(inputs.bodiceWork as unknown as string);
    const straps = parseFloat(inputs.strapAdjust as unknown as string);
    const pressing = parseFloat(inputs.pressing as unknown as string);
    const total = hem + bustle + bodice + straps + pressing;
    const items = [];
    if (hem > 0) items.push("Hemming");
    if (bustle > 0) items.push("Bustle");
    if (bodice > 0) items.push("Bodice");
    if (straps > 0) items.push("Straps/Sleeves");
    if (pressing > 0) items.push("Pressing");
    return {
      primary: { label: "Total Alteration Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Hemming", value: "$" + formatNumber(hem) },
        { label: "Bustle", value: "$" + formatNumber(bustle) },
        { label: "Bodice Work", value: "$" + formatNumber(bodice) },
        { label: "Strap/Sleeve Work", value: "$" + formatNumber(straps) },
        { label: "Professional Pressing", value: "$" + formatNumber(pressing) },
        { label: "Number of Services", value: formatNumber(items.length) }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","bridesmaid-dress-budget-calculator","bridal-shower-cost-calculator"],
  faq: [
    { question: "How much do wedding dress alterations cost?", answer: "Wedding dress alterations typically cost $200 to $800 total. Simple adjustments start at $50, while extensive work like adding sleeves or restructuring the bodice can exceed $500." },
    { question: "When should you start dress alterations?", answer: "Begin alterations 2-3 months before the wedding. Plan for 2-3 fitting appointments spaced 2-3 weeks apart." },
    { question: "Do all wedding dresses need alterations?", answer: "Nearly all wedding dresses need some alteration for a perfect fit. Even off-the-rack dresses typically need hemming and minor adjustments." },
  ],
  formula: "Total = Hemming + Bustle + Bodice + StrapWork + Pressing",
};
