import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const passportExpiryCalculator: CalculatorDefinition = {
  slug: "passport-expiry-calculator",
  title: "Passport Expiry & Renewal Calculator",
  description:
    "Free passport expiry calculator. Check if your passport is valid for travel, calculate months until expiration, and determine when to renew.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "passport expiry",
    "passport renewal",
    "passport validity",
    "passport expiration date",
    "travel document",
  ],
  variants: [
    {
      id: "expiry",
      name: "Check Passport Validity",
      description: "Check if your passport meets the 6-month validity rule",
      fields: [
        {
          name: "expiryYear",
          label: "Passport Expiry Year",
          type: "number",
          placeholder: "e.g. 2027",
        },
        {
          name: "expiryMonth",
          label: "Passport Expiry Month",
          type: "select",
          options: [
            { label: "January", value: "1" },
            { label: "February", value: "2" },
            { label: "March", value: "3" },
            { label: "April", value: "4" },
            { label: "May", value: "5" },
            { label: "June", value: "6" },
            { label: "July", value: "7" },
            { label: "August", value: "8" },
            { label: "September", value: "9" },
            { label: "October", value: "10" },
            { label: "November", value: "11" },
            { label: "December", value: "12" },
          ],
          defaultValue: "6",
        },
        {
          name: "travelYear",
          label: "Travel Year",
          type: "number",
          placeholder: "e.g. 2026",
        },
        {
          name: "travelMonth",
          label: "Travel Month",
          type: "select",
          options: [
            { label: "January", value: "1" },
            { label: "February", value: "2" },
            { label: "March", value: "3" },
            { label: "April", value: "4" },
            { label: "May", value: "5" },
            { label: "June", value: "6" },
            { label: "July", value: "7" },
            { label: "August", value: "8" },
            { label: "September", value: "9" },
            { label: "October", value: "10" },
            { label: "November", value: "11" },
            { label: "December", value: "12" },
          ],
          defaultValue: "1",
        },
      ],
      calculate: (inputs) => {
        const expiryYear = inputs.expiryYear as number;
        const expiryMonth = parseInt(inputs.expiryMonth as string);
        const travelYear = inputs.travelYear as number;
        const travelMonth = parseInt(inputs.travelMonth as string);
        if (!expiryYear || !travelYear) return null;

        const monthsUntilExpiry = (expiryYear - travelYear) * 12 + (expiryMonth - travelMonth);
        const meetsRule = monthsUntilExpiry >= 6;
        const meetsThreeMonth = monthsUntilExpiry >= 3;
        const isExpired = monthsUntilExpiry <= 0;
        const renewByMonth = expiryMonth - 6 <= 0 ? expiryMonth + 6 : expiryMonth - 6;
        const renewByYear = expiryMonth - 6 <= 0 ? expiryYear - 1 : expiryYear;

        return {
          primary: {
            label: isExpired ? "Passport Expired" : meetsRule ? "Valid for Travel" : "May Not Be Accepted",
            value: isExpired
              ? "Renew immediately"
              : `${formatNumber(monthsUntilExpiry, 0)} months until expiry`,
          },
          details: [
            { label: "Passport expires", value: `${expiryMonth}/${expiryYear}` },
            { label: "Travel date", value: `${travelMonth}/${travelYear}` },
            { label: "Months until expiry at travel", value: `${formatNumber(monthsUntilExpiry, 0)}` },
            { label: "6-month rule", value: meetsRule ? "Passes" : "Fails" },
            { label: "3-month rule", value: meetsThreeMonth ? "Passes" : "Fails" },
            { label: "Renew by (for 6-month rule)", value: `${renewByMonth}/${renewByYear}` },
          ],
          note: isExpired
            ? "Your passport will be expired at travel time. Apply for renewal immediately."
            : meetsRule
            ? "Your passport meets the common 6-month validity requirement for most countries."
            : meetsThreeMonth
            ? "Your passport meets the 3-month rule (EU/Schengen) but NOT the 6-month rule required by many Asian and Middle Eastern countries."
            : "Your passport has insufficient validity. Most countries require 3-6 months of validity beyond your travel dates.",
        };
      },
    },
    {
      id: "renewal",
      name: "Renewal Timeline",
      description: "Estimate passport renewal processing time",
      fields: [
        {
          name: "service",
          label: "Processing Type",
          type: "select",
          options: [
            { label: "Routine (8-11 weeks)", value: "routine" },
            { label: "Expedited (5-7 weeks)", value: "expedited" },
            { label: "Urgent/Emergency (2-3 weeks)", value: "urgent" },
            { label: "Same Day (agency visit)", value: "sameday" },
          ],
          defaultValue: "routine",
        },
        {
          name: "weeksUntilTravel",
          label: "Weeks Until Travel",
          type: "number",
          placeholder: "e.g. 12",
        },
      ],
      calculate: (inputs) => {
        const service = inputs.service as string;
        const weeksUntilTravel = inputs.weeksUntilTravel as number;
        if (!weeksUntilTravel || weeksUntilTravel <= 0) return null;

        const processingWeeks: Record<string, [number, number]> = {
          routine: [8, 11],
          expedited: [5, 7],
          urgent: [2, 3],
          sameday: [0, 0],
        };

        const fees: Record<string, number> = {
          routine: 130,
          expedited: 190,
          urgent: 190,
          sameday: 190,
        };

        const [minWeeks, maxWeeks] = processingWeeks[service] || [8, 11];
        const fee = fees[service] || 130;
        const willArrive = weeksUntilTravel >= maxWeeks;
        const bufferWeeks = weeksUntilTravel - maxWeeks;

        return {
          primary: {
            label: willArrive ? "Should Arrive in Time" : "May Not Arrive in Time",
            value: `${minWeeks}-${maxWeeks} weeks processing`,
          },
          details: [
            { label: "Processing time", value: `${minWeeks}-${maxWeeks} weeks` },
            { label: "Weeks until travel", value: `${formatNumber(weeksUntilTravel, 0)}` },
            { label: "Buffer", value: `${formatNumber(bufferWeeks, 0)} weeks` },
            { label: "Estimated fee", value: `$${formatNumber(fee, 0)}` },
          ],
          note: willArrive
            ? `With ${formatNumber(bufferWeeks, 0)} weeks of buffer, your passport should arrive before your trip.`
            : "Consider upgrading to expedited or urgent processing to ensure your passport arrives in time.",
        };
      },
    },
  ],
  relatedSlugs: ["visa-duration-calculator", "travel-checklist-calculator"],
  faq: [
    {
      question: "What is the 6-month passport validity rule?",
      answer:
        "Many countries require your passport to be valid for at least 6 months beyond your planned travel dates. This includes popular destinations like China, Thailand, Indonesia, and UAE. Always check the specific entry requirements for your destination.",
    },
    {
      question: "How long does a US passport renewal take?",
      answer:
        "Routine processing takes 8-11 weeks, and expedited processing takes 5-7 weeks (for an additional $60 fee). For urgent travel within 2 weeks, you can make an appointment at a passport agency. Processing times may vary during peak travel seasons.",
    },
    {
      question: "When should I renew my passport?",
      answer:
        "Renew your passport at least 9 months before it expires if you plan to travel internationally. This ensures you meet the 6-month validity rule and allows time for processing. Some countries also require blank visa pages.",
    },
  ],
  formula:
    "Months Until Expiry = (Expiry Year - Travel Year) x 12 + (Expiry Month - Travel Month); Valid if >= 6 months (most countries) or >= 3 months (EU/Schengen).",
};
