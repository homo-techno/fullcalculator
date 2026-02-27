import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const passportRenewalTimeCalculator: CalculatorDefinition = {
  slug: "passport-renewal-time",
  title: "Passport Renewal Processing Time Estimator",
  description:
    "Estimate passport renewal processing times and costs based on service type. Calculate when to apply based on your travel date, including expedited and emergency options.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "passport",
    "renewal",
    "processing time",
    "expedited",
    "travel",
    "State Department",
    "application",
    "emergency passport",
    "passport card",
  ],
  variants: [
    {
      slug: "processing-estimate",
      title: "Processing Time & Cost",
      fields: [
        {
          name: "serviceType",
          label: "Service Type",
          type: "select",
          options: [
            { label: "Routine Processing", value: "routine" },
            { label: "Expedited Processing", value: "expedited" },
            { label: "Expedited + 1-2 Day Delivery", value: "expedited_fast" },
            { label: "Emergency (Agency Appointment)", value: "emergency" },
          ],
        },
        {
          name: "applicationType",
          label: "Application Type",
          type: "select",
          options: [
            { label: "Adult Renewal (by mail)", value: "adult_renewal" },
            { label: "Adult New/Expired >5 yrs (in person)", value: "adult_new" },
            { label: "Child (under 16, in person)", value: "child" },
            { label: "Passport Card Only", value: "card" },
          ],
        },
      ],
      calculate(inputs) {
        const service = inputs.serviceType as string;
        const appType = inputs.applicationType as string;

        const baseFee: Record<string, number> = {
          adult_renewal: 130,
          adult_new: 165,
          child: 135,
          card: 65,
        };

        const processingTimes: Record<string, { weeks: string; extraFee: number }> = {
          routine: { weeks: "8-13", extraFee: 0 },
          expedited: { weeks: "5-7", extraFee: 60 },
          expedited_fast: { weeks: "5-7", extraFee: 60 + 19.53 },
          emergency: { weeks: "0-1", extraFee: 60 },
        };

        const fee = baseFee[appType];
        const processing = processingTimes[service];
        const executionFee = appType === "adult_new" || appType === "child" ? 35 : 0;
        const photoFee = 15;
        const totalCost = fee + processing.extraFee + executionFee + photoFee;

        const recommendApplyWeeks = service === "routine" ? 16 : service === "emergency" ? 1 : 10;

        return {
          results: [
            { label: "Processing Time", value: `${processing.weeks} weeks` },
            { label: "Application Fee", value: `$${formatNumber(fee)}` },
            { label: "Expedite Fee", value: `$${formatNumber(processing.extraFee)}` },
            { label: "Execution Fee (if in person)", value: `$${formatNumber(executionFee)}` },
            { label: "Photo (estimated)", value: `$${formatNumber(photoFee)}` },
            { label: "Total Estimated Cost", value: `$${formatNumber(totalCost)}` },
            { label: "Apply at Least", value: `${formatNumber(recommendApplyWeeks)} weeks before travel` },
          ],
        };
      },
    },
    {
      slug: "travel-deadline",
      title: "Apply by Travel Date",
      fields: [
        {
          name: "weeksUntilTravel",
          label: "Weeks Until Travel",
          type: "number",
        },
        {
          name: "destinationRequirement",
          label: "Destination Passport Validity Requirement",
          type: "select",
          options: [
            { label: "Valid on arrival date (most countries)", value: "0" },
            { label: "3 months beyond travel (some EU)", value: "3" },
            { label: "6 months beyond travel (many Asian/S. American)", value: "6" },
          ],
        },
      ],
      calculate(inputs) {
        const weeks = parseFloat(inputs.weeksUntilTravel as string);
        const extraMonths = parseFloat(inputs.destinationRequirement as string);
        if (isNaN(weeks)) return { error: "Please enter weeks until travel." };

        const effectiveWeeks = weeks - extraMonths * 4.33;

        let recommendation: string;
        let serviceNeeded: string;
        let estimatedCost: number;

        if (effectiveWeeks >= 13) {
          serviceNeeded = "Routine Processing";
          recommendation = "You have plenty of time - apply with routine processing";
          estimatedCost = 130;
        } else if (effectiveWeeks >= 7) {
          serviceNeeded = "Expedited Processing";
          recommendation = "Apply now with expedited processing";
          estimatedCost = 190;
        } else if (effectiveWeeks >= 3) {
          serviceNeeded = "Expedited + Fast Delivery";
          recommendation = "Apply immediately with expedited + 1-2 day delivery";
          estimatedCost = 210;
        } else if (effectiveWeeks >= 1) {
          serviceNeeded = "Emergency Appointment";
          recommendation = "Book emergency appointment at passport agency ASAP";
          estimatedCost = 190;
        } else {
          serviceNeeded = "Emergency - may not be possible";
          recommendation = "Contact passport agency immediately or consider postponing travel";
          estimatedCost = 190;
        }

        return {
          results: [
            { label: "Weeks Until Travel", value: formatNumber(weeks) },
            { label: "Validity Buffer Needed", value: `${formatNumber(extraMonths)} months` },
            { label: "Effective Time Available", value: `${formatNumber(effectiveWeeks)} weeks` },
            { label: "Service Type Needed", value: serviceNeeded },
            { label: "Estimated Cost", value: `$${formatNumber(estimatedCost)}` },
            { label: "Recommendation", value: recommendation },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["global-entry-roi", "moving-timeline", "student-loan-forgiveness"],
  faq: [
    {
      question: "How long does passport renewal take?",
      answer:
        "Routine processing takes 8-13 weeks. Expedited processing takes 5-7 weeks for an additional $60 fee. Emergency service at a passport agency can provide same-day or next-day service with proof of imminent travel (within 14 days). Processing times can vary seasonally.",
    },
    {
      question: "Can I renew my passport by mail?",
      answer:
        "You can renew by mail if your most recent passport is undamaged, was issued within the last 15 years, was issued when you were age 16 or older, and is in your current name (or you can document a legal name change). Otherwise, you must apply in person.",
    },
    {
      question: "How early should I renew my passport before traveling?",
      answer:
        "Apply at least 4-6 months before your travel date. Many countries require 3-6 months validity beyond your travel dates. During peak season (January-May), processing times are longer, so apply even earlier.",
    },
  ],
  formula:
    "Total Cost = Application Fee + Expedite Fee + Execution Fee + Photo | Routine: 8-13 weeks | Expedited: 5-7 weeks (+$60) | Emergency: 0-1 week (appointment required)",
};
