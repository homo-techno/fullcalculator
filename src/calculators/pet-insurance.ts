import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petInsuranceCalculator: CalculatorDefinition = {
  slug: "pet-insurance-calculator",
  title: "Pet Insurance Cost Estimator",
  description:
    "Free pet insurance cost calculator. Estimate monthly premiums and compare plans based on pet type, breed, age, and coverage level.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pet insurance calculator",
    "pet insurance cost",
    "dog insurance calculator",
    "cat insurance cost",
    "pet insurance estimator",
  ],
  variants: [
    {
      id: "insuranceEstimate",
      name: "Monthly Premium Estimate",
      fields: [
        {
          name: "petType",
          label: "Pet Type",
          type: "select",
          options: [
            { label: "Dog", value: "dog" },
            { label: "Cat", value: "cat" },
          ],
        },
        {
          name: "petAge",
          label: "Pet Age (years)",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
          max: 20,
        },
        {
          name: "breedRisk",
          label: "Breed Health Risk",
          type: "select",
          options: [
            { label: "Low Risk (mixed breed, healthy breeds)", value: "low" },
            { label: "Medium Risk (most purebreds)", value: "medium" },
            { label: "High Risk (Bulldog, German Shepherd, Persian)", value: "high" },
          ],
        },
        {
          name: "coverage",
          label: "Coverage Level",
          type: "select",
          options: [
            { label: "Accident Only", value: "accident" },
            { label: "Accident + Illness", value: "accident_illness" },
            { label: "Comprehensive (inc. wellness)", value: "comprehensive" },
          ],
        },
        {
          name: "deductible",
          label: "Annual Deductible",
          type: "select",
          options: [
            { label: "$100", value: "100" },
            { label: "$250", value: "250" },
            { label: "$500", value: "500" },
            { label: "$1,000", value: "1000" },
          ],
        },
        {
          name: "reimbursement",
          label: "Reimbursement Rate",
          type: "select",
          options: [
            { label: "70%", value: "70" },
            { label: "80%", value: "80" },
            { label: "90%", value: "90" },
          ],
        },
      ],
      calculate: (inputs) => {
        const petType = (inputs.petType as string) || "dog";
        const petAge = inputs.petAge as number;
        const breedRisk = (inputs.breedRisk as string) || "medium";
        const coverage = (inputs.coverage as string) || "accident_illness";
        const deductible = parseInt((inputs.deductible as string) || "250");
        const reimbursement = parseInt((inputs.reimbursement as string) || "80");
        if (petAge === undefined || petAge < 0) return null;

        // Base monthly premium estimates (2024 averages)
        const basePremiums: Record<string, Record<string, number>> = {
          dog: { accident: 20, accident_illness: 50, comprehensive: 75 },
          cat: { accident: 12, accident_illness: 30, comprehensive: 50 },
        };

        let monthlyPremium = basePremiums[petType]?.[coverage] || 50;

        // Age factor (premiums increase with age)
        if (petAge <= 1) monthlyPremium *= 0.85;
        else if (petAge <= 4) monthlyPremium *= 1.0;
        else if (petAge <= 7) monthlyPremium *= 1.3;
        else if (petAge <= 10) monthlyPremium *= 1.7;
        else monthlyPremium *= 2.2;

        // Breed risk factor
        const breedFactors: Record<string, number> = { low: 0.85, medium: 1.0, high: 1.35 };
        monthlyPremium *= breedFactors[breedRisk] || 1.0;

        // Deductible adjustment (higher deductible = lower premium)
        const deductibleFactors: Record<number, number> = { 100: 1.2, 250: 1.0, 500: 0.85, 1000: 0.7 };
        monthlyPremium *= deductibleFactors[deductible] || 1.0;

        // Reimbursement adjustment (higher reimbursement = higher premium)
        const reimbFactors: Record<number, number> = { 70: 0.85, 80: 1.0, 90: 1.2 };
        monthlyPremium *= reimbFactors[reimbursement] || 1.0;

        const annualPremium = monthlyPremium * 12;
        const lifetimeCost = annualPremium * (petType === "dog" ? 12 : 15); // avg lifespan

        // Break-even analysis
        const breakEvenClaim = (annualPremium + deductible) / (reimbursement / 100);

        return {
          primary: {
            label: "Estimated Monthly Premium",
            value: "$" + formatNumber(monthlyPremium, 0) + "/month",
          },
          details: [
            { label: "Annual Premium", value: "$" + formatNumber(annualPremium, 0) + "/year" },
            { label: "Annual Deductible", value: "$" + formatNumber(deductible, 0) },
            { label: "Reimbursement Rate", value: reimbursement + "%" },
            { label: "Break-Even Vet Bill", value: "$" + formatNumber(breakEvenClaim, 0) + "/year to break even" },
            {
              label: "Coverage Type",
              value: coverage === "accident" ? "Accident Only" : coverage === "accident_illness" ? "Accident + Illness" : "Comprehensive",
            },
            { label: "Lifetime Cost Est.", value: "$" + formatNumber(lifetimeCost, 0) },
            {
              label: "Example Payout",
              value: "A $3,000 vet bill would cost you: $" +
                formatNumber(deductible + (3000 - deductible) * (1 - reimbursement / 100), 0) +
                " (you pay) + $" +
                formatNumber((3000 - deductible) * (reimbursement / 100), 0) +
                " (insurance pays)",
            },
          ],
          note: "Actual premiums vary by provider, location, and specific breed. Get quotes from multiple providers for accurate pricing.",
        };
      },
    },
  ],
  relatedSlugs: ["pet-travel-cost-calculator", "dog-calorie-calculator", "cat-calorie-calculator"],
  faq: [
    {
      question: "How much does pet insurance cost?",
      answer:
        "Average pet insurance costs $30-55 per month for dogs and $15-35 per month for cats for accident and illness coverage. Premiums vary significantly based on breed, age, location, coverage level, deductible, and reimbursement rate. Puppies and kittens generally have the lowest premiums.",
    },
    {
      question: "Is pet insurance worth it?",
      answer:
        "Pet insurance is most valuable for unexpected major expenses. Emergency surgery can cost $3,000-10,000+, cancer treatment $5,000-20,000+, and chronic conditions can cost thousands over a pet's lifetime. Insurance is generally worth it if you couldn't afford a $3,000+ unexpected vet bill or have a breed prone to health issues.",
    },
    {
      question: "What does pet insurance not cover?",
      answer:
        "Most pet insurance excludes pre-existing conditions, elective procedures (cosmetic surgery, tail docking), breeding costs, and preventive care (unless you have a wellness add-on). Dental disease, hip dysplasia, and breed-specific conditions may have waiting periods of 6-12 months.",
    },
  ],
  formula:
    "Estimated premium = base rate x age factor x breed risk factor x deductible factor x reimbursement factor. Break-even = (annual premium + deductible) / reimbursement rate. Your cost on a claim = deductible + (bill - deductible) x (1 - reimbursement %).",
};
