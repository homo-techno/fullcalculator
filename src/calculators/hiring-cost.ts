import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hiringCostCalculator: CalculatorDefinition = {
  slug: "hiring-cost-calculator",
  title: "Cost Per Hire Calculator",
  description: "Free cost per hire calculator. Calculate the total cost of hiring including job postings, recruiter fees, interviews, background checks, and onboarding expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["cost per hire calculator", "hiring cost calculator", "recruitment cost", "hiring budget calculator", "talent acquisition cost"],
  variants: [
    {
      id: "perHire",
      name: "Cost Per Hire",
      description: "Calculate the total cost to hire one employee",
      fields: [
        { name: "jobPostingCost", label: "Job Posting / Advertising", type: "number", placeholder: "e.g. 500", prefix: "$", defaultValue: 0 },
        { name: "recruiterFee", label: "Recruiter / Agency Fee", type: "number", placeholder: "e.g. 5000", prefix: "$", defaultValue: 0 },
        { name: "interviewHours", label: "Total Interview Hours (all staff)", type: "number", placeholder: "e.g. 15", suffix: "hours" },
        { name: "interviewerRate", label: "Avg Hourly Rate of Interviewers", type: "number", placeholder: "e.g. 60", prefix: "$", defaultValue: 60 },
        { name: "backgroundCheck", label: "Background Check / Screening", type: "number", placeholder: "e.g. 200", prefix: "$", defaultValue: 200 },
        { name: "onboardingCost", label: "Onboarding / Equipment Cost", type: "number", placeholder: "e.g. 2000", prefix: "$", defaultValue: 0 },
        { name: "relocation", label: "Relocation (if applicable)", type: "number", placeholder: "e.g. 0", prefix: "$", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const posting = (inputs.jobPostingCost as number) || 0;
        const recruiter = (inputs.recruiterFee as number) || 0;
        const intHrs = (inputs.interviewHours as number) || 0;
        const intRate = (inputs.interviewerRate as number) || 60;
        const bgCheck = (inputs.backgroundCheck as number) || 0;
        const onboard = (inputs.onboardingCost as number) || 0;
        const reloc = (inputs.relocation as number) || 0;

        const interviewCost = intHrs * intRate;
        const externalCosts = posting + recruiter + bgCheck + reloc;
        const internalCosts = interviewCost + onboard;
        const total = externalCosts + internalCosts;

        if (total === 0) return null;

        return {
          primary: { label: "Total Cost Per Hire", value: `$${formatNumber(total)}` },
          details: [
            { label: "External costs", value: `$${formatNumber(externalCosts)}` },
            { label: "Internal costs", value: `$${formatNumber(internalCosts)}` },
            { label: "Job posting / advertising", value: `$${formatNumber(posting)}` },
            { label: "Recruiter / agency fee", value: `$${formatNumber(recruiter)}` },
            { label: "Interview time cost", value: `$${formatNumber(interviewCost)}` },
            { label: "Background check", value: `$${formatNumber(bgCheck)}` },
            { label: "Onboarding / equipment", value: `$${formatNumber(onboard)}` },
            { label: "Relocation", value: `$${formatNumber(reloc)}` },
          ],
        };
      },
    },
    {
      id: "annual",
      name: "Annual Hiring Budget",
      description: "Estimate annual hiring budget",
      fields: [
        { name: "plannedHires", label: "Planned Hires This Year", type: "number", placeholder: "e.g. 20" },
        { name: "avgCostPerHire", label: "Average Cost Per Hire", type: "number", placeholder: "e.g. 4500", prefix: "$" },
        { name: "recruiterSalary", label: "In-House Recruiter Salary (annual)", type: "number", placeholder: "e.g. 65000", prefix: "$", defaultValue: 0 },
        { name: "numRecruiters", label: "Number of Recruiters", type: "number", placeholder: "e.g. 1", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const hires = inputs.plannedHires as number;
        const avgCost = inputs.avgCostPerHire as number;
        const recruiterSalary = (inputs.recruiterSalary as number) || 0;
        const numRecruiters = (inputs.numRecruiters as number) || 0;
        if (!hires || !avgCost) return null;

        const directCosts = hires * avgCost;
        const recruiterCosts = recruiterSalary * numRecruiters;
        const totalBudget = directCosts + recruiterCosts;
        const costPerHireWithRecruiter = totalBudget / hires;

        return {
          primary: { label: "Annual Hiring Budget", value: `$${formatNumber(totalBudget)}` },
          details: [
            { label: "Direct hiring costs", value: `$${formatNumber(directCosts)}` },
            { label: "Recruiter team cost", value: `$${formatNumber(recruiterCosts)}` },
            { label: "True cost per hire", value: `$${formatNumber(costPerHireWithRecruiter)}` },
            { label: "Monthly hiring budget", value: `$${formatNumber(totalBudget / 12)}` },
            { label: "Hires per recruiter", value: numRecruiters > 0 ? formatNumber(hires / numRecruiters, 1) : "N/A" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["turnover-cost-calculator", "salary-calculator", "training-roi-calculator"],
  faq: [
    { question: "What is the average cost per hire?", answer: "According to SHRM, the average cost per hire in the US is approximately $4,700. However, this varies widely: entry-level positions may cost $1,000-3,000, while executive hires can cost $15,000-50,000+ depending on the use of executive search firms." },
    { question: "How can I reduce cost per hire?", answer: "Strategies include building an employee referral program, strengthening your employer brand, using social media recruiting, maintaining a talent pipeline, improving your careers page, and reducing time-to-fill by streamlining the interview process." },
  ],
  formula: "Cost Per Hire = (External Costs + Internal Costs) / Number of Hires | External = Posting + Recruiter + Background + Relocation",
};
