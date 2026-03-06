import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const djVsBandCostCalculator: CalculatorDefinition = {
  slug: "dj-vs-band-cost-calculator",
  title: "DJ vs Band Cost Calculator",
  description: "Compare the cost of hiring a DJ versus a live band for your wedding or event based on hours, size of band, and equipment needs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["DJ cost","wedding band cost","live music pricing","wedding entertainment cost"],
  variants: [{
    id: "standard",
    name: "DJ vs Band Cost",
    description: "Compare the cost of hiring a DJ versus a live band for your wedding or event based on hours, size of band, and equipment needs.",
    fields: [
      { name: "eventHours", label: "Entertainment Hours", type: "number", min: 1, max: 10, defaultValue: 5 },
      { name: "djHourlyRate", label: "DJ Hourly Rate ($)", type: "number", min: 50, max: 500, defaultValue: 150 },
      { name: "bandMembers", label: "Number of Band Members", type: "number", min: 2, max: 12, defaultValue: 5 },
      { name: "bandMemberRate", label: "Band Member Hourly Rate ($)", type: "number", min: 50, max: 400, defaultValue: 125 },
      { name: "soundSystemNeeded", label: "Sound System Rental", type: "select", options: [{ value: "0", label: "Included" }, { value: "500", label: "Basic ($500)" }, { value: "1200", label: "Premium ($1200)" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
    const hours = inputs.eventHours as number;
    const djRate = inputs.djHourlyRate as number;
    const bandMembers = inputs.bandMembers as number;
    const bandRate = inputs.bandMemberRate as number;
    const soundCost = parseFloat(inputs.soundSystemNeeded as unknown as string);
    const djTotal = (hours * djRate) + soundCost;
    const bandTotal = (hours * bandRate * bandMembers) + soundCost;
    const savings = bandTotal - djTotal;
    return {
      primary: { label: "DJ Total Cost", value: "$" + formatNumber(Math.round(djTotal)) },
      details: [
        { label: "Band Total Cost", value: "$" + formatNumber(Math.round(bandTotal)) },
        { label: "Savings with DJ", value: "$" + formatNumber(Math.round(savings)) },
        { label: "DJ Hourly Cost", value: "$" + formatNumber(djRate) + "/hr" },
        { label: "Band Hourly Cost", value: "$" + formatNumber(bandRate * bandMembers) + "/hr" },
        { label: "Sound System Add-on", value: "$" + formatNumber(soundCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-budget-calculator","event-catering-calculator","reception-venue-cost-calculator"],
  faq: [
    { question: "Is a DJ cheaper than a band for a wedding?", answer: "Yes, DJs typically cost $500 to $1,500 for a wedding, while a live band ranges from $2,000 to $10,000 or more depending on size and talent level." },
    { question: "How many hours of music do you need at a wedding?", answer: "Most weddings need 4 to 5 hours of music: about 1 hour for cocktails and dinner, and 3 to 4 hours for dancing." },
    { question: "Can you have both a DJ and a band?", answer: "Yes, some couples hire a band for the reception and a DJ for cocktail hour or late-night dancing, though this increases the total cost." },
  ],
  formula: "DJ Total = (Hours x DJ Rate) + Sound System; Band Total = (Hours x Band Member Rate x Members) + Sound System; Savings = Band Total - DJ Total",
};
