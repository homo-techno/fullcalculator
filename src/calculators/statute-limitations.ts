import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const statuteLimitationsCalculator: CalculatorDefinition = {
  slug: "statute-limitations",
  title: "Statute of Limitations Calculator",
  description: "Free online statute of limitations calculator. Determine filing deadlines by case type and state for civil and criminal matters.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["statute of limitations", "filing deadline", "legal deadline", "time limit", "lawsuit deadline", "civil statute", "claim deadline"],
  variants: [
    {
      id: "civil",
      name: "Civil Cases",
      fields: [
        {
          name: "caseType",
          label: "Case Type",
          type: "select",
          options: [
            { label: "Personal Injury", value: "personalInjury" },
            { label: "Medical Malpractice", value: "medicalMalpractice" },
            { label: "Breach of Written Contract", value: "writtenContract" },
            { label: "Breach of Oral Contract", value: "oralContract" },
            { label: "Property Damage", value: "propertyDamage" },
            { label: "Fraud", value: "fraud" },
            { label: "Defamation", value: "defamation" },
            { label: "Wrongful Death", value: "wrongfulDeath" },
          ],
        },
        {
          name: "state",
          label: "State",
          type: "select",
          options: [
            { label: "California", value: "CA" },
            { label: "Texas", value: "TX" },
            { label: "New York", value: "NY" },
            { label: "Florida", value: "FL" },
            { label: "Illinois", value: "IL" },
            { label: "Pennsylvania", value: "PA" },
            { label: "Ohio", value: "OH" },
            { label: "Georgia", value: "GA" },
            { label: "North Carolina", value: "NC" },
            { label: "Michigan", value: "MI" },
          ],
        },
        {
          name: "daysSinceIncident",
          label: "Days Since Incident",
          type: "number",
          placeholder: "e.g. 365",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const caseType = inputs.caseType as string;
        const state = inputs.state as string;
        const daysSinceIncident = parseFloat(inputs.daysSinceIncident as string) || 0;

        const limitationsYears: Record<string, Record<string, number>> = {
          personalInjury: { CA: 2, TX: 2, NY: 3, FL: 4, IL: 2, PA: 2, OH: 2, GA: 2, NC: 3, MI: 3 },
          medicalMalpractice: { CA: 3, TX: 2, NY: 2.5, FL: 2, IL: 2, PA: 2, OH: 1, GA: 2, NC: 3, MI: 2 },
          writtenContract: { CA: 4, TX: 4, NY: 6, FL: 5, IL: 10, PA: 4, OH: 8, GA: 6, NC: 3, MI: 6 },
          oralContract: { CA: 2, TX: 4, NY: 6, FL: 4, IL: 5, PA: 4, OH: 6, GA: 4, NC: 3, MI: 6 },
          propertyDamage: { CA: 3, TX: 2, NY: 3, FL: 4, IL: 5, PA: 2, OH: 2, GA: 4, NC: 3, MI: 3 },
          fraud: { CA: 3, TX: 4, NY: 6, FL: 4, IL: 5, PA: 2, OH: 4, GA: 4, NC: 3, MI: 6 },
          defamation: { CA: 1, TX: 1, NY: 1, FL: 2, IL: 1, PA: 1, OH: 1, GA: 1, NC: 1, MI: 1 },
          wrongfulDeath: { CA: 2, TX: 2, NY: 2, FL: 2, IL: 2, PA: 2, OH: 2, GA: 2, NC: 2, MI: 3 },
        };

        const years = limitationsYears[caseType]?.[state] || 2;
        const totalDays = years * 365;
        const daysRemaining = totalDays - daysSinceIncident;
        const percentUsed = (daysSinceIncident / totalDays) * 100;

        return {
          primary: { label: "Days Remaining to File", value: daysRemaining > 0 ? formatNumber(daysRemaining, 0) + " days" : "EXPIRED" },
          details: [
            { label: "Statute of Limitations", value: formatNumber(years, 1) + " years" },
            { label: "Total Days Allowed", value: formatNumber(totalDays, 0) },
            { label: "Days Elapsed", value: formatNumber(daysSinceIncident, 0) },
            { label: "Time Used", value: formatNumber(Math.min(percentUsed, 100), 1) + "%" },
          ],
          note: daysRemaining <= 90 && daysRemaining > 0
            ? "WARNING: Deadline is approaching soon. Consult an attorney immediately."
            : daysRemaining <= 0
              ? "The statute of limitations may have expired. Some exceptions (tolling) may apply - consult an attorney."
              : "Deadlines may be extended by tolling provisions. Always consult a local attorney.",
        };
      },
    },
  ],
  relatedSlugs: ["personal-injury-settlement", "legal-fee-calc", "wrongful-termination"],
  faq: [
    {
      question: "What is a statute of limitations?",
      answer: "A statute of limitations is a law that sets the maximum time after an event within which legal proceedings may be initiated. Once the deadline passes, you generally cannot file a lawsuit.",
    },
    {
      question: "Can the statute of limitations be extended?",
      answer: "Yes, through 'tolling' provisions. Common reasons include the plaintiff being a minor, the defendant leaving the state, the injury not being immediately discovered (discovery rule), or the plaintiff being mentally incapacitated.",
    },
    {
      question: "Does the statute of limitations apply to all crimes?",
      answer: "Most crimes have a statute of limitations, but serious crimes like murder typically have no limitation period. Federal crimes generally have a 5-year statute of limitations unless otherwise specified.",
    },
  ],
  formula: "Days Remaining = (Statute Years x 365) - Days Since Incident",
};
