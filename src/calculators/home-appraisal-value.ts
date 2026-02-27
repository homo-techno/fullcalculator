import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeAppraisalValueCalculator: CalculatorDefinition = {
  slug: "home-appraisal-value",
  title: "Home Appraisal Value Estimator",
  description:
    "Estimate your home's appraised value using comparable sales data and adjustment factors. Useful for pre-listing preparation, refinancing, and property tax appeals.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "home appraisal",
    "property value",
    "home value",
    "comparable sales",
    "CMA",
    "real estate",
    "refinance",
    "property tax",
    "appraisal",
  ],
  variants: [
    {
      slug: "comp-based",
      title: "Comparable Sales Approach",
      fields: [
        {
          name: "comp1Price",
          label: "Comparable Sale #1 Price ($)",
          type: "number",
        },
        {
          name: "comp2Price",
          label: "Comparable Sale #2 Price ($)",
          type: "number",
        },
        {
          name: "comp3Price",
          label: "Comparable Sale #3 Price ($)",
          type: "number",
        },
        {
          name: "sqftAdjustment",
          label: "Size Adjustment (+/- $)",
          type: "number",
        },
        {
          name: "conditionAdjustment",
          label: "Condition Adjustment (+/- $)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const comp1 = parseFloat(inputs.comp1Price as string);
        const comp2 = parseFloat(inputs.comp2Price as string);
        const comp3 = parseFloat(inputs.comp3Price as string);
        const sqftAdj = parseFloat(inputs.sqftAdjustment as string) || 0;
        const condAdj = parseFloat(inputs.conditionAdjustment as string) || 0;
        if (isNaN(comp1) || isNaN(comp2) || isNaN(comp3))
          return { error: "Please enter at least three comparable sale prices." };

        const avgComp = (comp1 + comp2 + comp3) / 3;
        const adjustedValue = avgComp + sqftAdj + condAdj;
        const lowRange = adjustedValue * 0.95;
        const highRange = adjustedValue * 1.05;

        return {
          results: [
            { label: "Average Comparable Price", value: `$${formatNumber(avgComp)}` },
            { label: "Size Adjustment", value: `$${formatNumber(sqftAdj)}` },
            { label: "Condition Adjustment", value: `$${formatNumber(condAdj)}` },
            { label: "Estimated Value", value: `$${formatNumber(adjustedValue)}` },
            { label: "Likely Range (low)", value: `$${formatNumber(lowRange)}` },
            { label: "Likely Range (high)", value: `$${formatNumber(highRange)}` },
          ],
        };
      },
    },
    {
      slug: "price-per-sqft",
      title: "Price per Square Foot Method",
      fields: [
        {
          name: "pricePerSqft",
          label: "Area Price per Sq Ft ($)",
          type: "number",
        },
        {
          name: "sqft",
          label: "Home Size (sq ft)",
          type: "number",
        },
        {
          name: "homeAge",
          label: "Home Age Category",
          type: "select",
          options: [
            { label: "New Construction (0-5 yrs)", value: "1.1" },
            { label: "Recent (5-15 yrs)", value: "1.0" },
            { label: "Established (15-30 yrs)", value: "0.95" },
            { label: "Older (30-50 yrs)", value: "0.9" },
            { label: "Vintage (50+ yrs)", value: "0.85" },
          ],
        },
        {
          name: "lot",
          label: "Lot Size Factor",
          type: "select",
          options: [
            { label: "Below Average Lot", value: "0.95" },
            { label: "Average Lot", value: "1.0" },
            { label: "Above Average Lot", value: "1.05" },
            { label: "Premium Lot (corner, view, etc.)", value: "1.12" },
          ],
        },
      ],
      calculate(inputs) {
        const ppsf = parseFloat(inputs.pricePerSqft as string);
        const sqft = parseFloat(inputs.sqft as string);
        const ageFactor = parseFloat(inputs.homeAge as string);
        const lotFactor = parseFloat(inputs.lot as string);
        if (isNaN(ppsf) || isNaN(sqft) || isNaN(ageFactor) || isNaN(lotFactor))
          return { error: "Please enter all values." };

        const baseValue = ppsf * sqft;
        const adjustedValue = baseValue * ageFactor * lotFactor;
        const lowRange = adjustedValue * 0.93;
        const highRange = adjustedValue * 1.07;
        const effectivePpsf = adjustedValue / sqft;

        return {
          results: [
            { label: "Base Value", value: `$${formatNumber(baseValue)}` },
            { label: "Age Adjustment Factor", value: formatNumber(ageFactor) },
            { label: "Lot Adjustment Factor", value: formatNumber(lotFactor) },
            { label: "Estimated Value", value: `$${formatNumber(adjustedValue)}` },
            { label: "Effective $/sq ft", value: `$${formatNumber(effectivePpsf)}` },
            { label: "Likely Range", value: `$${formatNumber(lowRange)} - $${formatNumber(highRange)}` },
          ],
        };
      },
    },
    {
      slug: "renovation-impact",
      title: "Renovation ROI Impact",
      fields: [
        {
          name: "currentValue",
          label: "Current Home Value ($)",
          type: "number",
        },
        {
          name: "renovationType",
          label: "Renovation Type",
          type: "select",
          options: [
            { label: "Kitchen Remodel (minor)", value: "0.81" },
            { label: "Kitchen Remodel (major)", value: "0.59" },
            { label: "Bathroom Remodel", value: "0.70" },
            { label: "Deck Addition", value: "0.72" },
            { label: "Roof Replacement", value: "0.68" },
            { label: "Window Replacement", value: "0.69" },
          ],
        },
        {
          name: "renovationCost",
          label: "Renovation Cost ($)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const currentValue = parseFloat(inputs.currentValue as string);
        const roi = parseFloat(inputs.renovationType as string);
        const cost = parseFloat(inputs.renovationCost as string);
        if (isNaN(currentValue) || isNaN(roi) || isNaN(cost))
          return { error: "Please enter all values." };

        const valueAdded = cost * roi;
        const newValue = currentValue + valueAdded;
        const netReturn = valueAdded - cost;
        const roiPercent = ((valueAdded - cost) / cost) * 100;

        return {
          results: [
            { label: "Current Home Value", value: `$${formatNumber(currentValue)}` },
            { label: "Renovation Cost", value: `$${formatNumber(cost)}` },
            { label: "Value Added to Home", value: `$${formatNumber(valueAdded)}` },
            { label: "New Estimated Value", value: `$${formatNumber(newValue)}` },
            { label: "Net Return", value: `$${formatNumber(netReturn)}` },
            { label: "ROI (%)", value: `${formatNumber(roiPercent)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rent-to-income", "hoa-fee-comparison", "adu-cost"],
  faq: [
    {
      question: "How accurate are online home value estimates?",
      answer:
        "Online estimates (like Zillow Zestimate) typically have a median error rate of 2-7% for on-market homes and 5-14% for off-market homes. A professional appraisal is more accurate as it considers property condition, upgrades, and local market factors that algorithms miss.",
    },
    {
      question: "What factors most affect home appraisal value?",
      answer:
        "The biggest factors are location, comparable recent sales, home size (square footage), number of bedrooms and bathrooms, lot size, age and condition, and recent upgrades. Curb appeal, neighborhood trends, and school district also play significant roles.",
    },
    {
      question: "How can I increase my home's appraised value?",
      answer:
        "Focus on kitchen and bathroom updates, curb appeal improvements, fixing deferred maintenance, adding functional square footage, and ensuring the home is clean and well-presented. Provide the appraiser with a list of all upgrades and improvements with costs.",
    },
  ],
  formula:
    "Comparable Approach: Value = Avg(Comp1, Comp2, Comp3) + Adjustments | Sq Ft Method: Value = Price/SqFt x SqFt x Age Factor x Lot Factor | Renovation Impact: New Value = Current + (Cost x ROI Factor)",
};
