import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vinylRecordValueCalculator: CalculatorDefinition = {
  slug: "vinyl-record-value-calculator",
  title: "Vinyl Record Collection Value Estimator",
  description: "Free online vinyl record collection value estimator. Calculate the estimated value of your vinyl record collection based on condition, rarity, and pressing details.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["vinyl record value calculator", "record collection value", "vinyl record worth", "record grading calculator", "vinyl collection estimator"],
  variants: [
    {
      id: "single",
      name: "Single Record Value",
      description: "Estimate value of a single vinyl record based on condition and pressing",
      fields: [
        { name: "baseValue", label: "Base/Median Value ($)", type: "number", placeholder: "e.g. 25" },
        { name: "condition", label: "Record Condition (Goldmine Grade)", type: "select", options: [
          { label: "Mint (M) - 150%", value: "1.5" },
          { label: "Near Mint (NM) - 100%", value: "1.0" },
          { label: "Very Good Plus (VG+) - 50%", value: "0.5" },
          { label: "Very Good (VG) - 25%", value: "0.25" },
          { label: "Good Plus (G+) - 10%", value: "0.10" },
          { label: "Good (G) - 5%", value: "0.05" },
        ], defaultValue: "1.0" },
        { name: "coverCondition", label: "Cover Condition", type: "select", options: [
          { label: "Mint (M)", value: "1.0" },
          { label: "Near Mint (NM)", value: "0.95" },
          { label: "Very Good Plus (VG+)", value: "0.85" },
          { label: "Very Good (VG)", value: "0.70" },
          { label: "Good (G)", value: "0.50" },
          { label: "No Cover", value: "0.30" },
        ], defaultValue: "0.95" },
        { name: "pressing", label: "Pressing Type", type: "select", options: [
          { label: "Original first pressing", value: "1.5" },
          { label: "Early pressing", value: "1.2" },
          { label: "Standard repress", value: "1.0" },
          { label: "Modern reissue", value: "0.8" },
          { label: "Limited edition / colored vinyl", value: "1.4" },
          { label: "Promo / DJ copy", value: "1.3" },
        ], defaultValue: "1.0" },
      ],
      calculate: (inputs) => {
        const baseValue = parseFloat(inputs.baseValue as string) || 0;
        const condition = parseFloat(inputs.condition as string) || 1.0;
        const coverCond = parseFloat(inputs.coverCondition as string) || 0.95;
        const pressing = parseFloat(inputs.pressing as string) || 1.0;
        if (!baseValue) return null;

        const recordValue = baseValue * condition;
        const withCover = recordValue * coverCond;
        const finalValue = withCover * pressing;

        return {
          primary: { label: "Estimated Value", value: `$${formatNumber(finalValue, 2)}` },
          details: [
            { label: "Base/median value", value: `$${formatNumber(baseValue, 2)}` },
            { label: "Condition multiplier", value: `${condition}x` },
            { label: "Cover condition factor", value: `${coverCond}x` },
            { label: "Pressing factor", value: `${pressing}x` },
            { label: "Value after condition", value: `$${formatNumber(recordValue, 2)}` },
          ],
          note: "Actual market value depends on supply, demand, and specific pressing details. Check Discogs marketplace for recent sales data.",
        };
      },
    },
    {
      id: "collection",
      name: "Collection Value",
      description: "Estimate total collection value from summary counts",
      fields: [
        { name: "totalRecords", label: "Total Records in Collection", type: "number", placeholder: "e.g. 200" },
        { name: "avgValue", label: "Average Value per Record ($)", type: "number", placeholder: "e.g. 15" },
        { name: "premiumCount", label: "Number of Premium/Rare Records", type: "number", placeholder: "e.g. 10", defaultValue: 0 },
        { name: "premiumAvg", label: "Average Value of Premium Records ($)", type: "number", placeholder: "e.g. 75", defaultValue: 75 },
        { name: "avgCondition", label: "Average Collection Condition", type: "select", options: [
          { label: "Mostly Near Mint", value: "1.0" },
          { label: "Mostly VG+", value: "0.75" },
          { label: "Mostly VG", value: "0.50" },
          { label: "Mixed conditions", value: "0.60" },
        ], defaultValue: "0.75" },
      ],
      calculate: (inputs) => {
        const totalRecords = parseFloat(inputs.totalRecords as string) || 0;
        const avgValue = parseFloat(inputs.avgValue as string) || 0;
        const premiumCount = parseFloat(inputs.premiumCount as string) || 0;
        const premiumAvg = parseFloat(inputs.premiumAvg as string) || 75;
        const condFactor = parseFloat(inputs.avgCondition as string) || 0.75;
        if (!totalRecords || !avgValue) return null;

        const standardCount = totalRecords - premiumCount;
        const standardValue = standardCount * avgValue * condFactor;
        const premiumValue = premiumCount * premiumAvg * condFactor;
        const totalValue = standardValue + premiumValue;
        const insuranceValue = totalValue * 1.2;

        return {
          primary: { label: "Estimated Collection Value", value: `$${formatNumber(totalValue, 0)}` },
          details: [
            { label: "Standard records value", value: `$${formatNumber(standardValue, 0)} (${formatNumber(standardCount, 0)} records)` },
            { label: "Premium records value", value: `$${formatNumber(premiumValue, 0)} (${formatNumber(premiumCount, 0)} records)` },
            { label: "Condition factor", value: `${condFactor}x` },
            { label: "Average per record", value: `$${formatNumber(totalValue / totalRecords, 2)}` },
            { label: "Insurance value (120%)", value: `$${formatNumber(insuranceValue, 0)}` },
          ],
          note: "For insurance purposes, consider getting high-value records individually appraised. This is a rough estimate.",
        };
      },
    },
  ],
  relatedSlugs: ["roi-calculator", "investment-calculator"],
  faq: [
    { question: "How do I determine my record's condition?", answer: "Use the Goldmine grading standard: Mint (M) is unplayed and perfect. Near Mint (NM) has minimal signs of handling. VG+ has light surface marks but plays well. VG has audible surface noise. Good has significant wear." },
    { question: "What makes a vinyl record valuable?", answer: "Key factors include: original pressing vs. reissue, condition of both record and cover, rarity, artist popularity, and special features (colored vinyl, inserts, etc.). First pressings in mint condition command the highest prices." },
    { question: "Where can I look up record values?", answer: "Discogs.com is the most comprehensive database for vinyl pricing, showing actual sale prices. Popsike.com tracks auction results. Always check multiple recent sales rather than listing prices." },
  ],
  formula: "Value = Base Value × Condition Factor × Cover Factor × Pressing Factor",
};
