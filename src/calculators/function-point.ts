import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const functionPointCalculator: CalculatorDefinition = {
  slug: "function-point-calculator",
  title: "Function Point Calculator",
  description: "Free function point calculator. Estimate software size and effort using function point analysis. Calculate unadjusted and adjusted function points.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["function point calculator", "function point analysis", "software estimation", "FPA calculator", "software sizing"],
  variants: [
    {
      id: "fp-calculation",
      name: "Function Point Calculation",
      description: "Calculate function points from transaction and data functions",
      fields: [
        { name: "eiLow", label: "External Inputs (Low complexity)", type: "number", placeholder: "e.g. 5", min: 0, defaultValue: 0 },
        { name: "eiAvg", label: "External Inputs (Average)", type: "number", placeholder: "e.g. 3", min: 0, defaultValue: 3 },
        { name: "eiHigh", label: "External Inputs (High)", type: "number", placeholder: "e.g. 1", min: 0, defaultValue: 1 },
        { name: "eoLow", label: "External Outputs (Low)", type: "number", placeholder: "e.g. 3", min: 0, defaultValue: 0 },
        { name: "eoAvg", label: "External Outputs (Average)", type: "number", placeholder: "e.g. 2", min: 0, defaultValue: 2 },
        { name: "eoHigh", label: "External Outputs (High)", type: "number", placeholder: "e.g. 1", min: 0, defaultValue: 1 },
        { name: "eqLow", label: "External Queries (Low)", type: "number", placeholder: "e.g. 2", min: 0, defaultValue: 0 },
        { name: "eqAvg", label: "External Queries (Average)", type: "number", placeholder: "e.g. 3", min: 0, defaultValue: 3 },
        { name: "eqHigh", label: "External Queries (High)", type: "number", placeholder: "e.g. 0", min: 0, defaultValue: 0 },
        { name: "ilfLow", label: "Internal Logical Files (Low)", type: "number", placeholder: "e.g. 2", min: 0, defaultValue: 0 },
        { name: "ilfAvg", label: "Internal Logical Files (Avg)", type: "number", placeholder: "e.g. 3", min: 0, defaultValue: 3 },
        { name: "ilfHigh", label: "Internal Logical Files (High)", type: "number", placeholder: "e.g. 1", min: 0, defaultValue: 1 },
        { name: "eifLow", label: "External Interface Files (Low)", type: "number", placeholder: "e.g. 1", min: 0, defaultValue: 0 },
        { name: "eifAvg", label: "External Interface Files (Avg)", type: "number", placeholder: "e.g. 1", min: 0, defaultValue: 1 },
        { name: "eifHigh", label: "External Interface Files (High)", type: "number", placeholder: "e.g. 0", min: 0, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        // IFPUG weights
        const eiPoints = (inputs.eiLow as number || 0) * 3 + (inputs.eiAvg as number || 0) * 4 + (inputs.eiHigh as number || 0) * 6;
        const eoPoints = (inputs.eoLow as number || 0) * 4 + (inputs.eoAvg as number || 0) * 5 + (inputs.eoHigh as number || 0) * 7;
        const eqPoints = (inputs.eqLow as number || 0) * 3 + (inputs.eqAvg as number || 0) * 4 + (inputs.eqHigh as number || 0) * 6;
        const ilfPoints = (inputs.ilfLow as number || 0) * 7 + (inputs.ilfAvg as number || 0) * 10 + (inputs.ilfHigh as number || 0) * 15;
        const eifPoints = (inputs.eifLow as number || 0) * 5 + (inputs.eifAvg as number || 0) * 7 + (inputs.eifHigh as number || 0) * 10;

        const ufp = eiPoints + eoPoints + eqPoints + ilfPoints + eifPoints;

        if (ufp === 0) return null;

        // Typical adjustment factor (1.0 = no adjustment)
        const vaf = 1.0;
        const afp = ufp * vaf;

        // Effort estimates (industry averages)
        const hoursPerFP = 10; // typical for new development
        const effortHours = afp * hoursPerFP;
        const effortMonths = effortHours / 160; // 160 hours per person-month

        // Lines of code estimates by language
        const locJava = afp * 53;
        const locPython = afp * 32;
        const locJS = afp * 47;
        const locCSharp = afp * 54;

        return {
          primary: { label: "Unadjusted Function Points", value: formatNumber(ufp, 0) },
          details: [
            { label: "External Inputs (EI)", value: formatNumber(eiPoints, 0) },
            { label: "External Outputs (EO)", value: formatNumber(eoPoints, 0) },
            { label: "External Queries (EQ)", value: formatNumber(eqPoints, 0) },
            { label: "Internal Logical Files (ILF)", value: formatNumber(ilfPoints, 0) },
            { label: "External Interface Files (EIF)", value: formatNumber(eifPoints, 0) },
            { label: "Unadjusted FP (UFP)", value: formatNumber(ufp, 0) },
            { label: "Estimated Effort", value: `${formatNumber(effortHours, 0)} hours (~${formatNumber(effortMonths, 1)} person-months)` },
            { label: "Est. LOC (Java)", value: formatNumber(locJava, 0) },
            { label: "Est. LOC (Python)", value: formatNumber(locPython, 0) },
            { label: "Est. LOC (JavaScript)", value: formatNumber(locJS, 0) },
          ],
        };
      },
    },
    {
      id: "fp-to-effort",
      name: "FP to Effort Conversion",
      description: "Convert function points to development effort",
      fields: [
        { name: "functionPoints", label: "Function Points", type: "number", placeholder: "e.g. 200", min: 1 },
        { name: "productivity", label: "Team Productivity", type: "select", options: [
          { label: "Low (15 hrs/FP - new domain)", value: "15" },
          { label: "Average (10 hrs/FP - typical)", value: "10" },
          { label: "High (7 hrs/FP - experienced)", value: "7" },
          { label: "Very High (5 hrs/FP - expert)", value: "5" },
        ], defaultValue: "10" },
        { name: "teamSize", label: "Team Size", type: "number", placeholder: "e.g. 5", min: 1, defaultValue: 5 },
      ],
      calculate: (inputs) => {
        const fp = inputs.functionPoints as number;
        const hoursPerFP = parseFloat(inputs.productivity as string) || 10;
        const teamSize = (inputs.teamSize as number) || 5;
        if (!fp) return null;

        const totalHours = fp * hoursPerFP;
        const personMonths = totalHours / 160;
        const calendarMonths = personMonths / teamSize;
        const cost50 = totalHours * 50; // $50/hr
        const cost100 = totalHours * 100; // $100/hr
        const cost150 = totalHours * 150; // $150/hr

        return {
          primary: { label: "Estimated Duration", value: `${formatNumber(calendarMonths, 1)} months (${teamSize} devs)` },
          details: [
            { label: "Function Points", value: formatNumber(fp, 0) },
            { label: "Productivity", value: `${hoursPerFP} hrs/FP` },
            { label: "Total Effort", value: `${formatNumber(totalHours, 0)} hours` },
            { label: "Person-Months", value: formatNumber(personMonths, 1) },
            { label: "Calendar Months", value: `${formatNumber(calendarMonths, 1)} (with ${teamSize} devs)` },
            { label: "Cost ($50/hr)", value: `$${formatNumber(cost50, 0)}` },
            { label: "Cost ($100/hr)", value: `$${formatNumber(cost100, 0)}` },
            { label: "Cost ($150/hr)", value: `$${formatNumber(cost150, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sprint-capacity-calculator", "code-review-time-estimator", "cloud-cost-calculator"],
  faq: [
    { question: "What are function points?", answer: "Function points measure software size based on functionality delivered to users, independent of technology. They count five types: External Inputs (data entry), External Outputs (reports), External Queries (lookups), Internal Logical Files (data stores), and External Interface Files (shared data). Each is weighted by complexity (low/average/high)." },
    { question: "How accurate is function point estimation?", answer: "Function point estimation is typically within 20-25% accuracy for experienced estimators. It is more reliable than lines-of-code estimation because it is independent of programming language. Accuracy improves with historical calibration data from your own organization." },
  ],
  formula: "UFP = Sum(Count x Weight) for all function types | Effort = UFP x Hours/FP | Duration = Effort / Team Size",
};
