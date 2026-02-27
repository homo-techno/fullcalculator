import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bloodDonationEligibilityCalculator: CalculatorDefinition = {
  slug: "blood-donation-eligibility-calculator",
  title: "Blood Donation Eligibility Checker",
  description:
    "Check if you are eligible to donate blood based on weight, recent donations, travel, medications, and health conditions. Covers whole blood, platelets, and plasma.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "blood donation eligibility",
    "can I donate blood",
    "blood donation requirements",
    "blood donor eligibility",
    "platelet donation eligibility",
    "plasma donation eligibility",
  ],
  variants: [
    {
      id: "wholeBlood",
      name: "Whole Blood Donation",
      description: "Check eligibility for standard whole blood donation",
      fields: [
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "years",
          min: 14,
          max: 100,
        },
        {
          name: "weight",
          label: "Weight",
          type: "number",
          placeholder: "e.g. 150",
          suffix: "lbs",
          min: 50,
          max: 500,
        },
        {
          name: "daysSinceLastDonation",
          label: "Days Since Last Blood Donation",
          type: "number",
          placeholder: "e.g. 60 (0 if never)",
          suffix: "days",
          min: 0,
          max: 9999,
          defaultValue: 0,
        },
        {
          name: "recentSurgery",
          label: "Surgery or Tattoo in Last 3 Months",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
          defaultValue: "no",
        },
        {
          name: "recentIllness",
          label: "Currently Sick / Antibiotics",
          type: "select",
          options: [
            { label: "No -- feeling healthy", value: "no" },
            { label: "Yes -- currently ill or on antibiotics", value: "yes" },
          ],
          defaultValue: "no",
        },
        {
          name: "travelRisk",
          label: "Recent International Travel (malaria-risk area)",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes -- within last 3 months", value: "yes" },
          ],
          defaultValue: "no",
        },
      ],
      calculate: (inputs) => {
        const age = parseFloat(inputs.age as string);
        const weight = parseFloat(inputs.weight as string);
        const daysSince = parseFloat(inputs.daysSinceLastDonation as string);
        const recentSurgery = inputs.recentSurgery as string;
        const recentIllness = inputs.recentIllness as string;
        const travelRisk = inputs.travelRisk as string;
        if (!age || !weight) return null;

        const issues: string[] = [];

        // Age check (most states 17+, some 16 with parental consent)
        if (age < 17) issues.push("Must be 17+ (16 with parental consent in some states)");
        if (age > 76) issues.push("Age may require physician clearance after 76");

        // Weight check
        if (weight < 110) issues.push("Must weigh at least 110 lbs (50 kg)");

        // Donation interval (56 days / 8 weeks for whole blood)
        if (daysSince > 0 && daysSince < 56) {
          issues.push(`Must wait 56 days between donations (${formatNumber(56 - daysSince, 0)} days remaining)`);
        }

        if (recentSurgery === "yes") issues.push("Recent surgery or tattoo may require 3-month deferral");
        if (recentIllness === "yes") issues.push("Must be symptom-free and off antibiotics for 10+ days");
        if (travelRisk === "yes") issues.push("Malaria-risk travel requires 3-month deferral");

        const eligible = issues.length === 0;
        const nextEligibleDays = daysSince > 0 && daysSince < 56 ? 56 - daysSince : 0;

        // Estimated blood volume
        const weightKg = weight * 0.4536;
        const bloodVolume = weightKg * 70; // ~70 mL/kg
        const donationVolume = 470; // ~1 pint
        const percentDonated = (donationVolume / bloodVolume) * 100;

        return {
          primary: { label: "Eligibility Status", value: eligible ? "Likely Eligible" : "May Not Be Eligible" },
          details: [
            ...(issues.length > 0 ? issues.map((issue, i) => ({ label: `Issue ${i + 1}`, value: issue })) : [{ label: "Status", value: "No disqualifying factors found" }]),
            { label: "Donation Volume", value: `~${formatNumber(donationVolume, 0)} mL (1 pint)` },
            { label: "% of Blood Volume", value: `${formatNumber(percentDonated, 1)}%` },
            { label: "Recovery Time", value: "Red cells replenish in ~4-6 weeks" },
            { label: "Min Wait Between Donations", value: "56 days (8 weeks)" },
          ],
          note: "This is a preliminary screening tool only. Final eligibility is determined at the donation center through a confidential questionnaire and mini-physical. Some medications, medical conditions, and travel history may affect eligibility. Contact your local blood center for specific questions.",
        };
      },
    },
    {
      id: "platelet",
      name: "Platelet / Plasma Donation",
      description: "Check eligibility for platelet or plasma donation",
      fields: [
        {
          name: "donationType",
          label: "Donation Type",
          type: "select",
          options: [
            { label: "Platelets (apheresis)", value: "platelets" },
            { label: "Plasma (AB plasma)", value: "plasma" },
            { label: "Double red cells", value: "double_red" },
          ],
          defaultValue: "platelets",
        },
        {
          name: "daysSinceLastDonation",
          label: "Days Since Last Donation",
          type: "number",
          placeholder: "e.g. 14",
          suffix: "days",
          min: 0,
          max: 9999,
          defaultValue: 0,
        },
        {
          name: "donationsThisYear",
          label: "Donations This Calendar Year",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
          max: 50,
          defaultValue: 0,
        },
        {
          name: "takingAspirin",
          label: "Aspirin/NSAIDs in Last 48 Hours",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
          defaultValue: "no",
        },
      ],
      calculate: (inputs) => {
        const type = inputs.donationType as string;
        const daysSince = parseFloat(inputs.daysSinceLastDonation as string);
        const donationsYear = parseFloat(inputs.donationsThisYear as string);
        const aspirin = inputs.takingAspirin as string;

        const intervals: Record<string, number> = { platelets: 7, plasma: 28, double_red: 112 };
        const maxPerYear: Record<string, number> = { platelets: 24, plasma: 13, double_red: 3 };
        const durations: Record<string, string> = { platelets: "1.5-2.5 hours", plasma: "1-1.5 hours", double_red: "1.5 hours" };

        const requiredInterval = intervals[type] || 7;
        const yearlyMax = maxPerYear[type] || 24;

        const issues: string[] = [];
        if (daysSince > 0 && daysSince < requiredInterval) {
          issues.push(`Must wait ${requiredInterval} days between donations (${formatNumber(requiredInterval - daysSince, 0)} remaining)`);
        }
        if (donationsYear >= yearlyMax) {
          issues.push(`Reached maximum ${yearlyMax} donations per year`);
        }
        if (aspirin === "yes" && type === "platelets") {
          issues.push("Must be aspirin/NSAID-free for 48 hours before platelet donation");
        }

        const eligible = issues.length === 0;

        return {
          primary: { label: "Eligibility", value: eligible ? "Likely Eligible" : "May Need to Wait" },
          details: [
            ...(issues.length > 0 ? issues.map((issue, i) => ({ label: `Issue ${i + 1}`, value: issue })) : [{ label: "Status", value: "No issues found" }]),
            { label: "Donation Type", value: type.charAt(0).toUpperCase() + type.slice(1) },
            { label: "Min Interval", value: `${formatNumber(requiredInterval, 0)} days` },
            { label: "Max Per Year", value: formatNumber(yearlyMax, 0) },
            { label: "Donation Time", value: durations[type] || "1-2 hours" },
            { label: "Donations This Year", value: `${formatNumber(donationsYear, 0)} / ${formatNumber(yearlyMax, 0)}` },
          ],
          note: "Platelet donors can give more frequently (every 7 days, up to 24x/year). Double red cell donation removes twice the red cells but requires longer recovery (112 days). All donors must meet basic health and weight requirements.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "heart-rate-calculator", "blood-pressure-calculator"],
  faq: [
    {
      question: "How often can I donate blood?",
      answer:
        "Whole blood: every 56 days (8 weeks), up to 6 times per year. Platelets: every 7 days, up to 24 times per year. Plasma: every 28 days, up to 13 times per year. Double red cells: every 112 days (16 weeks), up to 3 times per year.",
    },
    {
      question: "What are the basic requirements to donate blood?",
      answer:
        "You must be at least 17 years old (16 with parental consent in some states), weigh at least 110 lbs, be in general good health, and not have donated whole blood in the last 56 days. A mini-physical (temperature, blood pressure, hemoglobin check) is performed at the donation site.",
    },
    {
      question: "What medications prevent blood donation?",
      answer:
        "Most medications do not prevent donation. Notable exceptions: blood thinners (warfarin requires 7-day wait after stopping), aspirin/NSAIDs (48-hour wait for platelet donation only), antibiotics (wait until infection is resolved), and certain acne medications (isotretinoin/Accutane requires 1-month wait).",
    },
  ],
  formula:
    "Whole Blood Interval = 56 days | Platelet Interval = 7 days | Plasma Interval = 28 days | Double Red Interval = 112 days",
};
