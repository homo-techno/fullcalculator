import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const termLifeCostCalculator: CalculatorDefinition = {
  slug: "term-life-cost-calculator",
  title: "Term Life Insurance Cost Calculator",
  description: "Free term life insurance cost estimator. Estimate monthly premiums for term life insurance based on age, health, coverage amount, and term length.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["term life insurance cost", "life insurance premium calculator", "term life quote", "life insurance rate calculator", "term life insurance price"],
  variants: [
    {
      id: "term-life-estimate",
      name: "Term Life Premium Estimator",
      description: "Estimate monthly term life insurance premiums based on key rating factors",
      fields: [
        { name: "age", label: "Current Age", type: "number", placeholder: "e.g. 35", min: 18, max: 75 },
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ], defaultValue: "male" },
        { name: "health", label: "Health Class", type: "select", options: [
          { label: "Preferred Plus (excellent)", value: "preferred-plus" },
          { label: "Preferred (very good)", value: "preferred" },
          { label: "Standard Plus (good)", value: "standard-plus" },
          { label: "Standard (average)", value: "standard" },
          { label: "Substandard (health issues)", value: "substandard" },
        ], defaultValue: "standard" },
        { name: "smoker", label: "Tobacco Use", type: "select", options: [
          { label: "Non-smoker", value: "no" },
          { label: "Smoker", value: "yes" },
        ], defaultValue: "no" },
        { name: "coverage", label: "Coverage Amount", type: "select", options: [
          { label: "$100,000", value: "100000" },
          { label: "$250,000", value: "250000" },
          { label: "$500,000", value: "500000" },
          { label: "$750,000", value: "750000" },
          { label: "$1,000,000", value: "1000000" },
          { label: "$2,000,000", value: "2000000" },
        ], defaultValue: "500000" },
        { name: "term", label: "Term Length", type: "select", options: [
          { label: "10 Years", value: "10" },
          { label: "15 Years", value: "15" },
          { label: "20 Years", value: "20" },
          { label: "25 Years", value: "25" },
          { label: "30 Years", value: "30" },
        ], defaultValue: "20" },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const gender = inputs.gender as string;
        const health = inputs.health as string;
        const smoker = inputs.smoker as string;
        const coverage = parseInt(inputs.coverage as string);
        const term = parseInt(inputs.term as string);

        if (!age || !coverage) return null;

        // Base rate per $1,000 of coverage (annual) for 30-year-old male standard
        let baseRate = 0.15;

        // Age factor (exponential increase)
        const ageFactor = Math.pow(1.05, age - 30);

        // Gender factor
        const genderFactor = gender === "female" ? 0.75 : 1.0;

        // Health class factor
        const healthFactors: Record<string, number> = {
          "preferred-plus": 0.6,
          "preferred": 0.75,
          "standard-plus": 0.9,
          "standard": 1.0,
          "substandard": 1.75,
        };
        const healthFactor = healthFactors[health] || 1.0;

        // Smoker factor
        const smokerFactor = smoker === "yes" ? 2.5 : 1.0;

        // Term length factor
        const termFactors: Record<number, number> = { 10: 0.75, 15: 0.85, 20: 1.0, 25: 1.15, 30: 1.35 };
        const termFactor = termFactors[term] || 1.0;

        const annualRate = baseRate * ageFactor * genderFactor * healthFactor * smokerFactor * termFactor;
        const annualPremium = (coverage / 1000) * annualRate;
        const monthlyPremium = annualPremium / 12;
        const totalPremiums = annualPremium * term;
        const costPerThousand = annualRate;

        return {
          primary: { label: "Estimated Monthly Premium", value: `$${formatNumber(monthlyPremium)}` },
          details: [
            { label: "Annual premium", value: `$${formatNumber(annualPremium)}` },
            { label: "Coverage amount", value: `$${formatNumber(coverage)}` },
            { label: "Term length", value: `${term} years` },
            { label: "Health class", value: health.replace("-", " ") },
            { label: "Cost per $1,000 coverage/year", value: `$${formatNumber(costPerThousand, 2)}` },
            { label: "Total premiums over term", value: `$${formatNumber(totalPremiums)}` },
            { label: "Daily cost", value: `$${formatNumber(monthlyPremium / 30.44, 2)}` },
          ],
          note: "This is a rough estimate for educational purposes. Actual premiums depend on detailed underwriting, including medical history, family health history, lifestyle, and the specific insurer. Get quotes from multiple companies for accurate pricing.",
        };
      },
    },
  ],
  relatedSlugs: ["life-insurance-need-calculator", "auto-insurance-estimate-calculator", "health-insurance-subsidy-calculator"],
  faq: [
    { question: "How much does term life insurance cost?", answer: "A healthy 30-year-old male can typically get a 20-year, $500,000 term policy for $20-$30/month. Costs increase significantly with age, health issues, and tobacco use. Women typically pay 15-25% less than men for the same coverage." },
    { question: "What affects term life insurance rates?", answer: "Key factors include: age (biggest factor), health classification, tobacco use (can double or triple premiums), gender, coverage amount, term length, family medical history, driving record, and dangerous hobbies. A medical exam is usually required for the best rates." },
    { question: "Should I get 10, 20, or 30-year term?", answer: "Choose a term that covers your period of greatest financial responsibility. If you have young children, a 20-30 year term covers them until independence. If you're close to paying off your mortgage, a 10-15 year term may suffice. Longer terms cost more per month but lock in the rate." },
  ],
  formula: "Estimated Premium = (Coverage / 1,000) × Base Rate × Age Factor × Gender Factor × Health Factor × Smoker Factor × Term Factor. Base rate and factors are industry averages for estimation.",
};
