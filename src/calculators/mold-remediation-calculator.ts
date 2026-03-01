import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const moldRemediationCalculator: CalculatorDefinition = {
  slug: "mold-remediation-calculator",
  title: "Mold Remediation Calculator",
  description: "Estimate mold removal costs based on affected area, mold type, and location in the home.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["mold remediation cost", "mold removal calculator", "mold cleanup estimate"],
  variants: [{
    id: "standard",
    name: "Mold Remediation",
    description: "Estimate mold removal costs based on affected area, mold type, and location in the home",
    fields: [
      { name: "affectedArea", label: "Affected Area", type: "number", suffix: "sq ft", min: 1, max: 5000, defaultValue: 100 },
      { name: "moldSeverity", label: "Mold Severity", type: "select", options: [{value:"minor",label:"Minor (Surface Only)"},{value:"moderate",label:"Moderate (Into Materials)"},{value:"severe",label:"Severe (Structural Damage)"}], defaultValue: "moderate" },
      { name: "location", label: "Location in Home", type: "select", options: [{value:"bathroom",label:"Bathroom"},{value:"basement",label:"Basement"},{value:"attic",label:"Attic"},{value:"hvac",label:"HVAC/Ductwork"},{value:"crawl",label:"Crawl Space"}], defaultValue: "basement" },
      { name: "testingNeeded", label: "Professional Testing", type: "select", options: [{value:"no",label:"Not Needed"},{value:"yes",label:"Testing Required ($300-600)"}], defaultValue: "yes" },
    ],
    calculate: (inputs) => {
      const area = inputs.affectedArea as number;
      const severity = inputs.moldSeverity as string;
      const location = inputs.location as string;
      const testing = inputs.testingNeeded as string;
      if (!area || area <= 0) return null;
      const costPerSqFt: Record<string, number> = { minor: 10, moderate: 25, severe: 50 };
      const locationMod: Record<string, number> = { bathroom: 1.0, basement: 1.1, attic: 1.3, hvac: 1.5, crawl: 1.4 };
      const baseCost = area * (costPerSqFt[severity] || 25) * (locationMod[location] || 1.1);
      const testCost = testing === "yes" ? 450 : 0;
      const total = baseCost + testCost;
      const timeline = area <= 50 ? "1-2 days" : area <= 200 ? "2-4 days" : "1-2 weeks";
      return {
        primary: { label: "Estimated Remediation Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Remediation Work", value: "$" + formatNumber(Math.round(baseCost)) },
          { label: "Testing Cost", value: "$" + formatNumber(testCost) },
          { label: "Estimated Timeline", value: timeline },
        ],
      };
    },
  }],
  relatedSlugs: ["radon-mitigation-calculator", "home-energy-score-calculator"],
  faq: [
    { question: "How much does mold remediation cost?", answer: "Mold remediation costs range from $500 to $6,000 for typical projects. Small areas (under 10 sq ft) may cost $500 to $1,500, while large projects can exceed $10,000." },
    { question: "Can I remove mold myself?", answer: "Small areas of mold (under 10 square feet) on hard surfaces can often be cleaned with detergent and water. Larger areas or mold in porous materials should be handled by professionals." },
  ],
  formula: "Cost = Affected Area x Cost per Sq Ft x Location Modifier + Testing Cost",
};
