import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const onlineCoursePricingCalculator: CalculatorDefinition = {
  slug: "online-course-pricing-calculator",
  title: "Online Course Pricing Calculator",
  description:
    "Calculate optimal pricing for your online course. Estimate revenue from different price points, conversion rates, and audience sizes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "online course pricing calculator",
    "how to price an online course",
    "course revenue estimator",
    "Udemy vs Teachable vs Kajabi pricing",
    "online course income calculator",
  ],
  variants: [
    {
      id: "launch",
      name: "Course Launch Revenue",
      description: "Estimate income from a course launch",
      fields: [
        {
          name: "audienceSize",
          label: "Email List / Audience Size",
          type: "number",
          placeholder: "e.g. 2000",
        },
        {
          name: "coursePrice",
          label: "Course Price",
          type: "number",
          placeholder: "e.g. 297",
          prefix: "$",
        },
        {
          name: "conversionRate",
          label: "Expected Conversion Rate",
          type: "number",
          placeholder: "e.g. 2",
          suffix: "%",
          defaultValue: 2,
        },
        {
          name: "platform",
          label: "Platform",
          type: "select",
          options: [
            { label: "Teachable (5–10% fee)", value: "teachable" },
            { label: "Kajabi ($150/mo, 0% fee)", value: "kajabi" },
            { label: "Gumroad (10% fee)", value: "gumroad" },
            { label: "Udemy (37–50% fee)", value: "udemy" },
            { label: "Direct / Stripe (3% fee)", value: "direct" },
          ],
          defaultValue: "teachable",
        },
      ],
      calculate: (inputs) => {
        const audience = parseFloat(inputs.audienceSize as string) || 0;
        const price = parseFloat(inputs.coursePrice as string) || 0;
        const conversion = parseFloat(inputs.conversionRate as string) || 2;
        const platform = inputs.platform as string;

        const feeRates: Record<string, number> = {
          teachable: 0.07, kajabi: 0.03, gumroad: 0.10, udemy: 0.50, direct: 0.03,
        };
        const fee = feeRates[platform] || 0.07;

        const sales = Math.floor(audience * (conversion / 100));
        const gross = sales * price;
        const net = gross * (1 - fee);
        const perSale = price * (1 - fee);

        return {
          primary: { label: "Net Revenue (Launch)", value: `$${formatNumber(net, 2)}` },
          details: [
            { label: "Expected sales", value: formatNumber(sales) },
            { label: "Gross revenue", value: `$${formatNumber(gross, 2)}` },
            { label: "Platform fee", value: `${fee * 100}% (-$${formatNumber(gross * fee, 2)})` },
            { label: "Net revenue", value: `$${formatNumber(net, 2)}` },
            { label: "Net per sale", value: `$${formatNumber(perSale, 2)}` },
            { label: "Break-even students", value: `${Math.ceil(500 / perSale)} (to cover $500 costs)` },
          ],
          note: "Average course conversion rate is 1–3% of warm list. Cold traffic (ads) is 0.5–1%. A $997 course to 2,000 subscribers at 2% = ~$38,000 net.",
        };
      },
    },
  ],
  relatedSlugs: ["membership-site-revenue-calculator", "substack-revenue-calculator", "content-creator-hourly-rate-calculator"],
  faq: [
    {
      question: "How do I price my online course?",
      answer:
        "Price based on transformation value, not hours of content. A course that helps someone get a job ($50k salary) can charge $500–$2,000. Starter courses: $97–$297. Mid-tier: $297–$997. Premium/coaching hybrid: $997–$5,000+.",
    },
    {
      question: "What's the best platform for selling online courses?",
      answer:
        "Teachable and Thinkific are best for beginners (free tier available). Kajabi ($149/mo) is best for serious creators (built-in email, pages, no fees). Udemy gives you their marketplace traffic but takes 50% and controls pricing.",
    },
    {
      question: "How many students do successful courses have?",
      answer:
        "A successful niche course might have 100–1,000 students at $200–$1,000 each. A blockbuster course (Udemy) might have 10,000+ students at $15–$30 each. Revenue is often similar — small niche courses often outperform volume plays.",
    },
  ],
  formula: "Net Revenue = (Audience × Conversion%) × Price × (1 − Platform Fee)",
};
