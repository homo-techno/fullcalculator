import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const travelChecklistCalculator: CalculatorDefinition = {
  slug: "travel-checklist-calculator",
  title: "Travel Checklist Calculator",
  description:
    "Free travel checklist calculator. Get a customized pre-trip checklist with task timing based on your trip type and departure date.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "travel checklist",
    "trip checklist",
    "travel preparation",
    "pre-trip checklist",
    "travel planning",
  ],
  variants: [
    {
      id: "timeline",
      name: "Pre-Trip Timeline",
      description: "Get a timeline of tasks before departure",
      fields: [
        {
          name: "weeksUntilTrip",
          label: "Weeks Until Trip",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "tripType",
          label: "Trip Type",
          type: "select",
          options: [
            { label: "Domestic vacation", value: "domestic" },
            { label: "International vacation", value: "international" },
            { label: "Business trip", value: "business" },
            { label: "Adventure / Backpacking", value: "adventure" },
            { label: "Cruise", value: "cruise" },
            { label: "Family with kids", value: "family" },
          ],
          defaultValue: "international",
        },
        {
          name: "duration",
          label: "Trip Duration",
          type: "select",
          options: [
            { label: "Weekend (1-3 days)", value: "weekend" },
            { label: "Short (4-7 days)", value: "short" },
            { label: "Medium (1-2 weeks)", value: "medium" },
            { label: "Long (2-4 weeks)", value: "long" },
            { label: "Extended (1+ months)", value: "extended" },
          ],
          defaultValue: "short",
        },
      ],
      calculate: (inputs) => {
        const weeksUntilTrip = inputs.weeksUntilTrip as number;
        const tripType = inputs.tripType as string;
        const duration = inputs.duration as string;
        if (!weeksUntilTrip || weeksUntilTrip <= 0) return null;

        let totalTasks = 10;
        const tasksByTimeframe: { timeframe: string; tasks: string[] }[] = [];

        if (weeksUntilTrip >= 8) {
          const eightWeekTasks = ["Check passport validity"];
          if (tripType === "international") eightWeekTasks.push("Research visa requirements", "Schedule travel vaccines");
          if (tripType === "cruise") eightWeekTasks.push("Book shore excursions");
          if (tripType === "adventure") eightWeekTasks.push("Research gear needed", "Book permits");
          tasksByTimeframe.push({ timeframe: "8+ weeks out", tasks: eightWeekTasks });
          totalTasks += eightWeekTasks.length;
        }

        if (weeksUntilTrip >= 4) {
          const fourWeekTasks = ["Book accommodation", "Purchase travel insurance"];
          if (tripType !== "domestic") fourWeekTasks.push("Notify bank of travel dates");
          if (duration === "long" || duration === "extended") fourWeekTasks.push("Arrange mail hold", "Set up pet/house sitter");
          if (tripType === "family") fourWeekTasks.push("Arrange childcare items", "Pack kids' entertainment");
          tasksByTimeframe.push({ timeframe: "4-8 weeks out", tasks: fourWeekTasks });
          totalTasks += fourWeekTasks.length;
        }

        if (weeksUntilTrip >= 2) {
          const twoWeekTasks = ["Start packing list", "Confirm reservations", "Download offline maps"];
          if (tripType === "international") twoWeekTasks.push("Get currency exchanged", "Copy important documents");
          if (tripType === "business") twoWeekTasks.push("Confirm meeting schedules", "Prepare presentations");
          tasksByTimeframe.push({ timeframe: "2-4 weeks out", tasks: twoWeekTasks });
          totalTasks += twoWeekTasks.length;
        }

        const lastWeekTasks = ["Pack bags", "Charge electronics", "Check weather forecast", "Print/download boarding passes"];
        if (tripType === "international") lastWeekTasks.push("Check-in online 24h before");
        if (duration !== "weekend") lastWeekTasks.push("Set email auto-reply");
        tasksByTimeframe.push({ timeframe: "Last week", tasks: lastWeekTasks });
        totalTasks += lastWeekTasks.length;

        const dayOfTasks = ["Lock house, set alarms", "Water plants", "Confirm airport transport"];
        tasksByTimeframe.push({ timeframe: "Day of departure", tasks: dayOfTasks });
        totalTasks += dayOfTasks.length;

        const completedPossible = tasksByTimeframe.reduce((acc, tf) => acc + tf.tasks.length, 0);

        const detailItems = tasksByTimeframe.flatMap((tf) => [
          { label: `--- ${tf.timeframe} ---`, value: `${tf.tasks.length} tasks` },
          ...tf.tasks.map((task) => ({ label: task, value: weeksUntilTrip >= parseInt(tf.timeframe) ? "Due soon" : "Pending" })),
        ]);

        return {
          primary: {
            label: "Checklist Items",
            value: `${completedPossible} tasks to complete`,
          },
          details: detailItems.slice(0, 15),
          note: `You have ${weeksUntilTrip} weeks until your trip. ${weeksUntilTrip < 4 && tripType === "international" ? "Time is tight for international travel prep! Prioritize passport, visa, and vaccines." : "You have a good amount of time to prepare. Start with the earliest tasks and work forward."}`,
        };
      },
    },
    {
      id: "essentials",
      name: "Essential Documents Checklist",
      description: "Verify you have all essential travel documents",
      fields: [
        {
          name: "tripType",
          label: "Trip Type",
          type: "select",
          options: [
            { label: "Domestic (within country)", value: "domestic" },
            { label: "International", value: "international" },
          ],
          defaultValue: "international",
        },
        {
          name: "hasPassport",
          label: "Valid Passport?",
          type: "select",
          options: [
            { label: "Yes, valid 6+ months", value: "yes" },
            { label: "Yes, but expires within 6 months", value: "expiring" },
            { label: "No / Expired", value: "no" },
          ],
          defaultValue: "yes",
        },
        {
          name: "hasInsurance",
          label: "Travel Insurance?",
          type: "select",
          options: [
            { label: "Yes, purchased", value: "yes" },
            { label: "No, not purchased", value: "no" },
          ],
          defaultValue: "no",
        },
        {
          name: "hasVisa",
          label: "Visa Required?",
          type: "select",
          options: [
            { label: "No visa needed", value: "none" },
            { label: "Visa obtained", value: "yes" },
            { label: "Visa needed, not yet obtained", value: "needed" },
          ],
          defaultValue: "none",
        },
      ],
      calculate: (inputs) => {
        const tripType = inputs.tripType as string;
        const hasPassport = inputs.hasPassport as string;
        const hasInsurance = inputs.hasInsurance as string;
        const hasVisa = inputs.hasVisa as string;

        let readyItems = 0;
        let totalItems = 0;
        const issues: string[] = [];

        totalItems++;
        if (hasPassport === "yes") readyItems++;
        else if (hasPassport === "expiring") issues.push("Passport expires within 6 months - many countries will deny entry");
        else issues.push("URGENT: No valid passport - apply immediately");

        if (tripType === "international") {
          totalItems++;
          if (hasVisa === "yes" || hasVisa === "none") readyItems++;
          else issues.push("Visa required but not obtained - apply now");
        }

        totalItems++;
        if (hasInsurance === "yes") readyItems++;
        else issues.push("No travel insurance - strongly recommended");

        const essentialDocs = tripType === "international"
          ? ["Passport", "Visa (if required)", "Travel insurance", "Flight tickets", "Hotel confirmations", "Travel itinerary", "Emergency contacts", "Copies of documents", "Vaccination records"]
          : ["ID/Driver's license", "Flight/booking confirmations", "Travel insurance", "Emergency contacts"];

        const readinessPercent = (readyItems / totalItems) * 100;

        return {
          primary: {
            label: "Document Readiness",
            value: `${readyItems}/${totalItems} verified (${formatNumber(readinessPercent, 0)}%)`,
          },
          details: [
            { label: "Passport status", value: hasPassport === "yes" ? "Valid" : hasPassport === "expiring" ? "Expiring soon!" : "Not valid" },
            ...(tripType === "international" ? [{ label: "Visa status", value: hasVisa === "yes" ? "Obtained" : hasVisa === "none" ? "Not required" : "NEEDED" }] : []),
            { label: "Travel insurance", value: hasInsurance === "yes" ? "Purchased" : "Not purchased" },
            { label: "Essential documents", value: essentialDocs.join(", ") },
            { label: "Issues found", value: issues.length > 0 ? issues.join("; ") : "None - all good!" },
          ],
          note: issues.length > 0
            ? `Action needed: ${issues.join(". ")}.`
            : "All checked items are in order. Make sure to bring printed and digital copies of all important documents.",
        };
      },
    },
  ],
  relatedSlugs: ["passport-expiry-calculator", "travel-packing-calculator", "travel-insurance-calculator"],
  faq: [
    {
      question: "What is the most important thing to check before international travel?",
      answer:
        "Check your passport validity first - many countries require at least 6 months validity beyond your travel dates. Then verify visa requirements, ensure you have travel insurance, and check vaccination requirements. These items have the longest lead times if action is needed.",
    },
    {
      question: "How early should I start preparing for a trip?",
      answer:
        "For international trips, start 8-12 weeks before departure. This allows time for passport renewal (6-11 weeks), visa applications (2-8 weeks), and vaccinations (some need 4-6 weeks to become effective). Domestic trips need 2-4 weeks of preparation.",
    },
    {
      question: "What documents should I always carry when traveling internationally?",
      answer:
        "Always carry: valid passport, visa (if required), travel insurance details, flight tickets, hotel confirmations, emergency contact numbers, copies of all documents (separate from originals), and any required vaccination certificates. Keep digital copies in email and cloud storage.",
    },
  ],
  formula:
    "Checklist items are generated based on trip type (domestic/international/adventure/cruise), duration, and weeks until departure. Tasks are organized by timeframe priority.",
};
