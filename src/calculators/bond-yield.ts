import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bondYieldCalculator: CalculatorDefinition = {
  slug: "bond-yield-calculator",
  title: "Bond Yield Calculator",
  description: "Free bond yield calculator. Calculate current yield, yield to maturity, and bond price from coupon rate and face value.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bond yield calculator", "yield to maturity", "current yield", "bond calculator", "coupon rate"],
  variants: [
    {
      id: "currentYield",
      name: "Current Yield",
      fields: [
        { name: "coupon", label: "Annual Coupon ($)", type: "number", prefix: "$", placeholder: "e.g. 50" },
        { name: "price", label: "Current Market Price ($)", type: "number", prefix: "$", placeholder: "e.g. 950" },
        { name: "face", label: "Face Value ($)", type: "number", prefix: "$", placeholder: "e.g. 1000", defaultValue: 1000 },
      ],
      calculate: (inputs) => {
        const coupon = inputs.coupon as number, price = inputs.price as number;
        const face = (inputs.face as number) || 1000;
        if (!coupon || !price) return null;
        const currentYield = (coupon / price) * 100;
        const couponRate = (coupon / face) * 100;
        return {
          primary: { label: "Current Yield", value: `${formatNumber(currentYield, 3)}%` },
          details: [
            { label: "Coupon rate", value: `${formatNumber(couponRate, 2)}%` },
            { label: "Annual coupon", value: `$${formatNumber(coupon, 2)}` },
            { label: "Price vs face", value: price > face ? "Premium" : price < face ? "Discount" : "Par" },
          ],
        };
      },
    },
    {
      id: "ytm",
      name: "Approx. Yield to Maturity",
      fields: [
        { name: "face", label: "Face Value ($)", type: "number", prefix: "$", placeholder: "e.g. 1000", defaultValue: 1000 },
        { name: "coupon", label: "Annual Coupon ($)", type: "number", prefix: "$", placeholder: "e.g. 50" },
        { name: "price", label: "Current Price ($)", type: "number", prefix: "$", placeholder: "e.g. 950" },
        { name: "years", label: "Years to Maturity", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const face = (inputs.face as number) || 1000, coupon = inputs.coupon as number;
        const price = inputs.price as number, years = inputs.years as number;
        if (!coupon || !price || !years) return null;
        const ytm = (coupon + (face - price) / years) / ((face + price) / 2) * 100;
        return {
          primary: { label: "Approx. YTM", value: `${formatNumber(ytm, 3)}%` },
          details: [
            { label: "Current yield", value: `${formatNumber((coupon / price) * 100, 3)}%` },
            { label: "Capital gain/loss", value: `$${formatNumber(face - price, 2)}` },
            { label: "Annual cap gain", value: `$${formatNumber((face - price) / years, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["investment-calculator", "compound-interest-calculator", "stock-return-calculator"],
  faq: [{ question: "What is bond yield?", answer: "Current Yield = Annual Coupon / Market Price. Yield to Maturity (YTM) also accounts for capital gain/loss at maturity. Approximate YTM = (Coupon + (Face-Price)/Years) / ((Face+Price)/2)." }],
  formula: "Current Yield = Coupon/Price | YTM ≈ (C + (F-P)/n) / ((F+P)/2)",
};
