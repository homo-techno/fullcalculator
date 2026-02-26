import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const couponSavingsCalculator: CalculatorDefinition = {
  slug: "coupon-savings-calculator",
  title: "Coupon Savings Calculator",
  description:
    "Free coupon savings calculator. Calculate total savings from coupons, discount stacking, and see your effective savings rate on purchases.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "coupon savings calculator",
    "coupon calculator",
    "discount stacking calculator",
    "how much do coupons save",
    "coupon percentage savings",
  ],
  variants: [
    {
      id: "single-coupon",
      name: "Single Coupon Savings",
      description: "Calculate savings from a coupon or promo code",
      fields: [
        {
          name: "originalPrice",
          label: "Original Price",
          type: "number",
          placeholder: "e.g. 75",
          prefix: "$",
          min: 0.5,
          max: 10000,
          step: 0.5,
        },
        {
          name: "couponType",
          label: "Coupon Type",
          type: "select",
          options: [
            { label: "Percentage Off (%)", value: "percent" },
            { label: "Dollar Amount Off ($)", value: "dollar" },
            { label: "Buy One Get One (BOGO)", value: "bogo" },
          ],
          defaultValue: "percent",
        },
        {
          name: "couponValue",
          label: "Coupon Value (% or $ amount)",
          type: "number",
          placeholder: "e.g. 20",
          min: 0.5,
          max: 100,
          step: 0.5,
          defaultValue: 20,
        },
        {
          name: "taxRate",
          label: "Sales Tax Rate",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "%",
          min: 0,
          max: 15,
          step: 0.25,
          defaultValue: 8,
        },
      ],
      calculate: (inputs) => {
        const original = parseFloat(inputs.originalPrice as string);
        const couponType = inputs.couponType as string;
        const couponValue = parseFloat(inputs.couponValue as string);
        const taxRate = parseFloat(inputs.taxRate as string);
        if (!original || !couponValue) return null;

        let discount: number;
        if (couponType === "percent") {
          discount = original * (couponValue / 100);
        } else if (couponType === "dollar") {
          discount = Math.min(couponValue, original);
        } else {
          // BOGO: save 50% (second item free)
          discount = original * 0.5;
        }

        const afterCoupon = original - discount;
        const tax = afterCoupon * ((taxRate || 0) / 100);
        const finalPrice = afterCoupon + tax;
        const originalWithTax = original + original * ((taxRate || 0) / 100);
        const totalSavings = originalWithTax - finalPrice;
        const savingsPercent = (totalSavings / originalWithTax) * 100;

        return {
          primary: { label: "You Save", value: `$${formatNumber(totalSavings)}` },
          details: [
            { label: "Final Price (with tax)", value: `$${formatNumber(finalPrice)}` },
            { label: "Original Price (with tax)", value: `$${formatNumber(originalWithTax)}` },
            { label: "Coupon Discount", value: `$${formatNumber(discount)}` },
            { label: "Tax Saved Too", value: `$${formatNumber(discount * (taxRate || 0) / 100)}` },
            { label: "Total Savings %", value: `${formatNumber(savingsPercent, 1)}%` },
          ],
          note: "Remember: coupons also save you tax on the discounted amount, so your total savings are slightly more than just the coupon value.",
        };
      },
    },
    {
      id: "yearly-savings",
      name: "Yearly Coupon Savings",
      description: "Estimate annual savings from regular couponing",
      fields: [
        {
          name: "weeklyGrocery",
          label: "Weekly Grocery Spending",
          type: "number",
          placeholder: "e.g. 150",
          prefix: "$",
          min: 20,
          max: 500,
          step: 10,
          defaultValue: 150,
        },
        {
          name: "avgSavingsPercent",
          label: "Average Coupon Savings",
          type: "select",
          options: [
            { label: "Casual (5%)", value: "5" },
            { label: "Regular (10%)", value: "10" },
            { label: "Dedicated (20%)", value: "20" },
            { label: "Extreme Couponer (30%+)", value: "30" },
          ],
          defaultValue: "10",
        },
        {
          name: "timePerWeek",
          label: "Time Spent Couponing (min/week)",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "min",
          min: 5,
          max: 300,
          step: 5,
          defaultValue: 30,
        },
      ],
      calculate: (inputs) => {
        const weeklyGrocery = parseFloat(inputs.weeklyGrocery as string);
        const savingsPct = parseFloat(inputs.avgSavingsPercent as string);
        const timeMin = parseFloat(inputs.timePerWeek as string);
        if (!weeklyGrocery || !savingsPct) return null;

        const weeklySavings = weeklyGrocery * (savingsPct / 100);
        const monthlySavings = weeklySavings * 4.33;
        const yearlySavings = weeklySavings * 52;
        const hourlyRate = weeklySavings / ((timeMin || 30) / 60);

        return {
          primary: { label: "Yearly Savings", value: `$${formatNumber(yearlySavings)}` },
          details: [
            { label: "Weekly Savings", value: `$${formatNumber(weeklySavings)}` },
            { label: "Monthly Savings", value: `$${formatNumber(monthlySavings)}` },
            { label: "Effective Hourly Rate", value: `$${formatNumber(hourlyRate)}/hr` },
            { label: "5-Year Savings", value: `$${formatNumber(yearlySavings * 5)}` },
            { label: "Time Investment", value: `${formatNumber(timeMin || 30, 0)} min/week` },
          ],
          note: `Your couponing effort effectively earns you $${formatNumber(hourlyRate)}/hour. That is ${hourlyRate > 25 ? "excellent" : hourlyRate > 15 ? "good" : "decent"} return on your time.`,
        };
      },
    },
  ],
  relatedSlugs: ["discount-calculator", "garage-sale-price-calculator"],
  faq: [
    {
      question: "How much can you save with coupons?",
      answer:
        "Casual couponers save 5-10% on groceries, while dedicated couponers save 20-30%. Extreme couponers can save 50-70% but spend significant time. The average US household can save $500-$1,500 per year with moderate couponing effort.",
    },
    {
      question: "Is couponing worth the time?",
      answer:
        "It depends on your savings rate and time investment. If you save $15/week spending 30 minutes, that is equivalent to earning $30/hour. Digital coupons and cashback apps have made couponing faster and more accessible.",
    },
  ],
  formula:
    "Savings = Original Price x (Coupon % / 100) | Yearly = Weekly Savings x 52 | Effective Hourly Rate = Weekly Savings / (Time in Hours)",
};
