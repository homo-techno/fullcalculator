import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const filmCrewSizeEstimatorCalculator: CalculatorDefinition = {
  slug: "film-crew-size-estimator",
  title: "Film Crew Size Estimator",
  description: "Estimate the ideal crew size and key positions needed based on project type, budget level, and production complexity.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["film crew size","production crew calculator","video crew","crew positions needed"],
  variants: [{
    id: "standard",
    name: "Film Crew Size Estimator",
    description: "Estimate the ideal crew size and key positions needed based on project type, budget level, and production complexity.",
    fields: [
      { name: "projectType", label: "Project Type", type: "select", options: [{ value: "1", label: "Social Media / YouTube" }, { value: "2", label: "Corporate Video" }, { value: "3", label: "Music Video" }, { value: "4", label: "Short Film" }, { value: "5", label: "Feature Film" }], defaultValue: "3" },
      { name: "budgetLevel", label: "Budget Level", type: "select", options: [{ value: "1", label: "Micro (< $5K)" }, { value: "2", label: "Low ($5K-$25K)" }, { value: "3", label: "Mid ($25K-$100K)" }, { value: "4", label: "High ($100K+)" }], defaultValue: "2" },
      { name: "shootDays", label: "Shooting Days", type: "number", min: 1, max: 60, defaultValue: 3 },
      { name: "locations", label: "Number of Locations", type: "number", min: 1, max: 20, defaultValue: 2 },
    ],
    calculate: (inputs) => {
    const project = parseInt(inputs.projectType as string);
    const budget = parseInt(inputs.budgetLevel as string);
    const shootDays = inputs.shootDays as number;
    const locations = inputs.locations as number;
    const baseCrews = [[0,0,0,0,0,0],[0,1,3,5,8,15],[0,2,5,8,12,20],[0,3,8,12,18,30],[0,5,12,18,25,50]];
    const baseCrew = baseCrews[budget][project];
    const locationAdj = locations > 3 ? Math.ceil((locations - 3) * 0.5) : 0;
    const totalCrew = baseCrew + locationAdj;
    const dayRateAvg = budget === 1 ? 150 : budget === 2 ? 300 : budget === 3 ? 500 : 750;
    const crewBudget = totalCrew * dayRateAvg * shootDays;
    const keyPositions = totalCrew <= 3 ? "Director, DP, Sound" : totalCrew <= 8 ? "Director, DP, AC, Gaffer, Sound, PA" : totalCrew <= 15 ? "Director, AD, DP, AC, Gaffer, Grip, Sound, HMU, PA x2" : "Full department heads + support crew";
    return {
      primary: { label: "Recommended Crew Size", value: formatNumber(totalCrew) + " people" },
      details: [
        { label: "Key Positions", value: keyPositions },
        { label: "Estimated Crew Budget", value: "$" + formatNumber(crewBudget) },
        { label: "Avg Day Rate", value: "$" + formatNumber(dayRateAvg) + "/person" },
        { label: "Total Crew Days", value: formatNumber(totalCrew * shootDays) }
      ]
    };
  },
  }],
  relatedSlugs: ["film-budget-estimator","lighting-setup-cost-calculator"],
  faq: [
    { question: "What is the minimum crew for a professional video?", answer: "A skeleton crew of 2-3 people (director/DP, sound, and PA) can produce quality content. Music videos and short films typically need 5-12 people." },
    { question: "What positions should I hire first?", answer: "After the director, prioritize a director of photography, sound recordist, and one production assistant. These cover the most critical production needs." },
    { question: "How much should I budget for crew?", answer: "Crew typically represents 40-60% of production budget. Day rates vary widely: $150-300 for PAs, $500-1500 for department heads." },
  ],
  formula: "Base Crew = Project Type x Budget Matrix
Location Adjustment = (Locations - 3) x 0.5 if > 3 locations
Crew Budget = Total Crew x Avg Day Rate x Shoot Days",
};
