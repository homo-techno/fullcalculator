import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const viralCoefficientCalculator: CalculatorDefinition = {
  slug: "viral-coefficient",
  title: "Viral Coefficient Calculator",
  description: "Free viral coefficient calculator. Calculate how viral your product or campaign is by measuring how many new users each existing user brings in.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["viral coefficient", "k-factor", "viral growth", "referral rate", "viral marketing", "growth hacking"],
  variants: [
    {
      id: "basic",
      name: "Basic Viral Coefficient",
      fields: [
        { name: "invitesSent", label: "Avg Invites Sent per User", type: "number", placeholder: "e.g. 5" },
        { name: "conversionRate", label: "Invite Conversion Rate (%)", type: "number", placeholder: "e.g. 15" },
      ],
      calculate: (inputs) => {
        const invites = inputs.invitesSent as number;
        const convRate = inputs.conversionRate as number;
        if (!invites || !convRate) return null;
        const kFactor = invites * (convRate / 100);
        const isViral = kFactor > 1;
        const assessment = kFactor > 1 ? "Viral Growth" : kFactor > 0.5 ? "Good Referral Rate" : "Low Referral Rate";
        return {
          primary: { label: "Viral Coefficient (K-Factor)", value: formatNumber(kFactor, 2) },
          details: [
            { label: "Avg Invites per User", value: formatNumber(invites, 1) },
            { label: "Invite Conversion Rate", value: `${formatNumber(convRate, 1)}%` },
            { label: "Achieving Viral Growth?", value: isViral ? "Yes (K > 1)" : "No (K < 1)" },
            { label: "Assessment", value: assessment },
          ],
        };
      },
    },
    {
      id: "projection",
      name: "Growth Projection",
      fields: [
        { name: "initialUsers", label: "Initial Users", type: "number", placeholder: "e.g. 1000" },
        { name: "invitesSent", label: "Avg Invites per User", type: "number", placeholder: "e.g. 5" },
        { name: "conversionRate", label: "Invite Conversion Rate (%)", type: "number", placeholder: "e.g. 20" },
        { name: "cycles", label: "Number of Viral Cycles", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const initial = inputs.initialUsers as number;
        const invites = inputs.invitesSent as number;
        const convRate = inputs.conversionRate as number;
        const cycles = inputs.cycles as number;
        if (!initial || !invites || !convRate || !cycles) return null;
        const kFactor = invites * (convRate / 100);
        let totalUsers = initial;
        let newUsers = initial;
        for (let i = 0; i < cycles; i++) {
          newUsers = newUsers * kFactor;
          totalUsers += newUsers;
        }
        const growthMultiple = totalUsers / initial;
        return {
          primary: { label: "Projected Total Users", value: formatNumber(Math.round(totalUsers), 0) },
          details: [
            { label: "K-Factor", value: formatNumber(kFactor, 2) },
            { label: "Initial Users", value: formatNumber(initial, 0) },
            { label: "Growth Multiple", value: `${formatNumber(growthMultiple, 1)}x` },
            { label: "Users Added via Virality", value: formatNumber(Math.round(totalUsers - initial), 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["engagement-rate", "customer-acquisition-cost", "retention-rate"],
  faq: [
    { question: "What is the viral coefficient?", answer: "The viral coefficient (K-factor) measures how many new users each existing user generates through referrals. K = invitations sent x conversion rate. A K-factor above 1 means viral growth where each user brings in more than one new user." },
    { question: "What is a good viral coefficient?", answer: "A K-factor above 1.0 indicates true viral growth. Values between 0.5-1.0 show strong referral activity but not self-sustaining growth. Most products have K-factors well below 1.0." },
  ],
  formula: "K-Factor = Avg Invites per User x Invite Conversion Rate",
};
