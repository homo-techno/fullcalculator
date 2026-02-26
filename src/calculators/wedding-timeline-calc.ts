import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingTimelineCalculator: CalculatorDefinition = {
  slug: "wedding-timeline-calculator",
  title: "Wedding Day Timeline Planner",
  description:
    "Free wedding day timeline calculator. Plan your wedding day schedule from getting ready to the last dance, based on ceremony time, guest count, and event style.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "wedding timeline",
    "wedding day schedule",
    "wedding planner calculator",
    "wedding timeline template",
    "reception timeline",
  ],
  variants: [
    {
      id: "full-day",
      name: "Full Day Timeline",
      description: "Generate a complete wedding day timeline",
      fields: [
        {
          name: "ceremonyHour",
          label: "Ceremony Start Time (24h)",
          type: "number",
          placeholder: "e.g. 14 for 2 PM",
          min: 8,
          max: 20,
          step: 1,
          defaultValue: 14,
        },
        {
          name: "guestCount",
          label: "Guest Count",
          type: "select",
          options: [
            { label: "Small (under 50)", value: "small" },
            { label: "Medium (50-150)", value: "medium" },
            { label: "Large (150-250)", value: "large" },
            { label: "Extra Large (250+)", value: "xlarge" },
          ],
          defaultValue: "medium",
        },
        {
          name: "cocktailHour",
          label: "Include Cocktail Hour?",
          type: "select",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
          defaultValue: "yes",
        },
      ],
      calculate: (inputs) => {
        const ceremonyHour = parseFloat(inputs.ceremonyHour as string);
        const guestCount = inputs.guestCount as string;
        const cocktailHour = inputs.cocktailHour as string;
        if (isNaN(ceremonyHour)) return null;

        // Ceremony duration based on guest count
        const ceremonyMin = guestCount === "small" ? 20 : guestCount === "medium" ? 30 : 40;
        const photoMin = guestCount === "xlarge" ? 90 : guestCount === "large" ? 75 : 60;
        const cocktailMin = cocktailHour === "yes" ? 60 : 0;
        const dinnerMin = guestCount === "xlarge" ? 90 : guestCount === "large" ? 75 : 60;
        const dancingMin = 180;

        // Getting ready starts 4-5 hours before ceremony
        const readyHours = guestCount === "xlarge" || guestCount === "large" ? 5 : 4;
        const readyStart = ceremonyHour - readyHours;

        const formatTime = (h: number) => {
          const hr = Math.floor(h) % 24;
          const min = Math.round((h % 1) * 60);
          const period = hr >= 12 ? "PM" : "AM";
          const display = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
          return `${display}:${min < 10 ? "0" : ""}${min} ${period}`;
        };

        const ceremonyEnd = ceremonyHour + ceremonyMin / 60;
        const photoEnd = ceremonyEnd + photoMin / 60;
        const cocktailEnd = photoEnd + cocktailMin / 60;
        const dinnerEnd = cocktailEnd + dinnerMin / 60;
        const eventEnd = dinnerEnd + dancingMin / 60;

        const totalHours = eventEnd - readyStart;

        return {
          primary: { label: "Total Event Duration", value: `${formatNumber(totalHours, 1)} hours` },
          details: [
            { label: "Getting Ready", value: formatTime(readyStart) },
            { label: "Ceremony Start", value: formatTime(ceremonyHour) },
            { label: "Ceremony End", value: formatTime(ceremonyEnd) },
            { label: "Photos", value: `${formatTime(ceremonyEnd)} - ${formatTime(photoEnd)}` },
            { label: cocktailHour === "yes" ? "Cocktail Hour" : "Guest Transition", value: cocktailHour === "yes" ? `${formatTime(photoEnd)} - ${formatTime(cocktailEnd)}` : "N/A" },
            { label: "Dinner/Reception", value: `${formatTime(cocktailEnd)} - ${formatTime(dinnerEnd)}` },
            { label: "Dancing & Celebration", value: `${formatTime(dinnerEnd)} - ${formatTime(eventEnd)}` },
            { label: "Event End", value: formatTime(eventEnd) },
          ],
          note: "This is a general timeline. Adjust based on your venue requirements, sunset time for photos, and vendor availability.",
        };
      },
    },
    {
      id: "budget-time",
      name: "Vendor Time Estimates",
      description: "Estimate how long you need each vendor",
      fields: [
        {
          name: "guestCount",
          label: "Guest Count",
          type: "number",
          placeholder: "e.g. 120",
          min: 10,
          max: 500,
          step: 10,
          defaultValue: 120,
        },
        {
          name: "photoStyle",
          label: "Photography Style",
          type: "select",
          options: [
            { label: "Minimal (ceremony + portraits)", value: "minimal" },
            { label: "Standard (6-8 hours)", value: "standard" },
            { label: "Full Day (10+ hours)", value: "full" },
          ],
          defaultValue: "standard",
        },
      ],
      calculate: (inputs) => {
        const guests = parseFloat(inputs.guestCount as string);
        const photoStyle = inputs.photoStyle as string;
        if (!guests) return null;

        const photoHours = photoStyle === "minimal" ? 4 : photoStyle === "standard" ? 8 : 10;
        const djHours = guests < 100 ? 5 : guests < 200 ? 6 : 8;
        const floristSetup = guests < 100 ? 2 : 3;
        const cateringHours = guests < 100 ? 5 : guests < 200 ? 6 : 8;
        const videoHours = photoHours;
        const coordinatorHours = photoHours + 2;

        return {
          primary: { label: "Photographer Hours", value: `${formatNumber(photoHours, 0)} hours` },
          details: [
            { label: "DJ / Band", value: `${formatNumber(djHours, 0)} hours` },
            { label: "Videographer", value: `${formatNumber(videoHours, 0)} hours` },
            { label: "Caterer (incl setup)", value: `${formatNumber(cateringHours, 0)} hours` },
            { label: "Florist Setup", value: `${formatNumber(floristSetup, 0)} hours` },
            { label: "Coordinator", value: `${formatNumber(coordinatorHours, 0)} hours` },
            { label: "Guest Count", value: formatNumber(guests, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gift-budget-calculator", "birthday-party-cost-calculator"],
  faq: [
    {
      question: "How long should a wedding ceremony be?",
      answer:
        "Most wedding ceremonies last 20-40 minutes. Religious ceremonies tend to be 30-60 minutes, while civil ceremonies can be as short as 15-20 minutes. Plan extra time for processional, readings, and any special rituals.",
    },
    {
      question: "How much time should I allow for wedding photos?",
      answer:
        "Plan at least 60-90 minutes for formal photos after the ceremony. If you want first-look photos before the ceremony, add another 30-45 minutes. Golden hour (1 hour before sunset) is ideal for romantic couple portraits.",
    },
  ],
  formula:
    "Total Duration = Getting Ready (4-5h) + Ceremony (20-40min) + Photos (60-90min) + Cocktails (60min) + Dinner (60-90min) + Dancing (3h)",
};
