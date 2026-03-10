import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sideHustleComparisonCalculator: CalculatorDefinition = {
  slug: "side-hustle-comparison-calculator",
  title: "Side Hustle Comparison Calculator",
  description:
    "Compare net hourly earnings across popular side hustles: rideshare, delivery, freelancing, tutoring, and more. Find the best side hustle for your skills.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "side hustle comparison calculator",
    "best side hustle hourly rate",
    "side hustle income calculator",
    "part-time income comparison",
    "gig economy income by type",
  ],
  variants: [
    {
      id: "compare",
      name: "Side Hustle Earnings Comparison",
      description: "Compare net hourly earnings across side hustle types",
      fields: [
        {
          name: "hoursPerWeek",
          label: "Hours Available per Week",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "hours",
          defaultValue: 10,
        },
        {
          name: "primarySkill",
          label: "Your Strongest Skill",
          type: "select",
          options: [
            { label: "Driving / Vehicle", value: "driving" },
            { label: "Tech / Programming", value: "tech" },
            { label: "Writing / Content", value: "writing" },
            { label: "Teaching / Tutoring", value: "tutoring" },
            { label: "Design / Creative", value: "design" },
            { label: "Physical / Handyman", value: "physical" },
            { label: "Business / Finance", value: "business" },
            { label: "No special skills (general)", value: "general" },
          ],
          defaultValue: "general",
        },
        {
          name: "experienceLevel",
          label: "Experience Level",
          type: "select",
          options: [
            { label: "Beginner (0–1 year)", value: "beginner" },
            { label: "Intermediate (1–3 years)", value: "intermediate" },
            { label: "Expert (3+ years)", value: "expert" },
          ],
          defaultValue: "beginner",
        },
        {
          name: "location",
          label: "Market Size",
          type: "select",
          options: [
            { label: "Major city (NYC, LA, Chicago)", value: "major" },
            { label: "Mid-size city (Atlanta, Denver)", value: "mid" },
            { label: "Small city / suburban", value: "small" },
            { label: "Rural", value: "rural" },
          ],
          defaultValue: "mid",
        },
      ],
      calculate: (inputs) => {
        const hours = parseFloat(inputs.hoursPerWeek as string) || 10;
        const skill = inputs.primarySkill as string;
        const experience = inputs.experienceLevel as string;
        const location = inputs.location as string;

        const expMult: Record<string, number> = { beginner: 1.0, intermediate: 1.5, expert: 2.2 };
        const locMult: Record<string, number> = { major: 1.3, mid: 1.0, small: 0.85, rural: 0.70 };
        const em = expMult[experience] || 1.0;
        const lm = locMult[location] || 1.0;

        // Base net hourly rates by skill (after taxes and expenses)
        const hustles: Record<string, { name: string; baseNet: number; scalability: string }[]> = {
          driving: [
            { name: "Uber/Lyft", baseNet: 12, scalability: "Low" },
            { name: "DoorDash/Delivery", baseNet: 10, scalability: "Low" },
            { name: "Amazon Flex", baseNet: 14, scalability: "Medium" },
          ],
          tech: [
            { name: "Freelance Dev (Upwork)", baseNet: 35 * em, scalability: "High" },
            { name: "Tech Support (Fiverr)", baseNet: 20 * em, scalability: "Medium" },
            { name: "IT Help (TaskRabbit)", baseNet: 28 * em, scalability: "Medium" },
          ],
          writing: [
            { name: "Content Writing (Upwork)", baseNet: 18 * em, scalability: "High" },
            { name: "Copywriting", baseNet: 28 * em, scalability: "High" },
            { name: "Newsletter/Substack", baseNet: 5 * em, scalability: "Very High" },
          ],
          tutoring: [
            { name: "Online Tutoring (Wyzant)", baseNet: 25 * em, scalability: "Medium" },
            { name: "Test Prep (SAT/ACT)", baseNet: 35 * em, scalability: "Medium" },
            { name: "Language Teaching (iTalki)", baseNet: 15 * em, scalability: "Medium" },
          ],
          design: [
            { name: "Graphic Design (Fiverr)", baseNet: 20 * em, scalability: "High" },
            { name: "Logo Design (99designs)", baseNet: 30 * em, scalability: "Medium" },
            { name: "Video Editing", baseNet: 25 * em, scalability: "High" },
          ],
          physical: [
            { name: "TaskRabbit (Handyman)", baseNet: 25 * em, scalability: "Low" },
            { name: "Moving Help", baseNet: 18, scalability: "Low" },
            { name: "Cleaning (Handy)", baseNet: 15, scalability: "Low" },
          ],
          business: [
            { name: "Bookkeeping (freelance)", baseNet: 30 * em, scalability: "High" },
            { name: "Virtual Assistant", baseNet: 18 * em, scalability: "High" },
            { name: "Social Media Mgmt", baseNet: 22 * em, scalability: "High" },
          ],
          general: [
            { name: "DoorDash/Delivery", baseNet: 10, scalability: "Low" },
            { name: "Uber/Lyft", baseNet: 12, scalability: "Low" },
            { name: "Amazon Flex", baseNet: 14, scalability: "Medium" },
          ],
        };

        const options = hustles[skill] || hustles.general;
        const rankedOptions = options.map(h => ({
          ...h,
          adjustedNet: h.baseNet * lm,
          weeklyNet: h.baseNet * lm * hours * 0.9,
          monthlyNet: h.baseNet * lm * hours * 0.9 * 4.33,
        })).sort((a, b) => b.adjustedNet - a.adjustedNet);

        const best = rankedOptions[0];

        return {
          primary: { label: `Best Option: ${best.name}`, value: `$${formatNumber(best.adjustedNet, 2)}/hr net` },
          details: rankedOptions.flatMap(h => [
            { label: h.name, value: `$${formatNumber(h.adjustedNet, 2)}/hr | $${formatNumber(h.monthlyNet, 0)}/mo | Scale: ${h.scalability}` },
          ]).concat([
            { label: "Hours per week", value: `${hours} hrs` },
            { label: "Best option monthly", value: `$${formatNumber(best.monthlyNet, 0)}` },
            { label: "Annual at best rate", value: `$${formatNumber(best.monthlyNet * 12, 0)}` },
          ]),
          note: `Based on your skill (${skill}) in a ${location} market. Rates shown are estimated net after platform fees and taxes. Scalability = income growth potential over time.`,
        };
      },
    },
  ],
  relatedSlugs: ["gig-worker-hourly-rate-calculator", "gig-vs-w2-calculator", "side-hustle-comparison-calculator"],
  faq: [
    {
      question: "What side hustle makes the most money per hour?",
      answer:
        "Skilled freelancing (software development, copywriting, consulting) typically earns the highest net hourly rate ($30–$100+/hr). Rideshare and delivery earn $10–$14/hr net — among the lowest. The gap widens with experience: a beginner developer earns 2x more than driving; an expert earns 5–8x more.",
    },
    {
      question: "What is the best side hustle for beginners?",
      answer:
        "Best beginner side hustles with no experience required: rideshare/delivery ($12–$15/hr), TaskRabbit physical tasks ($15–$20/hr), or online surveys ($5–$12/hr). The fastest path to higher earnings: learn a skill (web dev, copywriting, bookkeeping) and start freelancing within 3–6 months.",
    },
    {
      question: "How many hours per week should I side hustle?",
      answer:
        "Most successful side hustlers work 10–20 hours per week. Under 5 hours rarely generates meaningful income. Over 30 hours risks burnout alongside full-time work. 10–15 hours/week is the sweet spot — enough to earn $500–$2,000/month without sacrificing sleep and personal time.",
    },
  ],
  formula: "Net Monthly = Hourly Rate × (1 − Platform Fee%) × (1 − Tax%) × Weekly Hours × 4.33",
};
