import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const receptionTimelineCalculator: CalculatorDefinition = {
  slug: "reception-timeline",
  title: "Reception Timeline Calculator",
  description: "Free reception timeline calculator. Plan the perfect schedule for your wedding reception including cocktail hour, dinner, toasts, and dancing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["reception timeline", "wedding schedule", "reception schedule", "wedding timeline", "event timeline"],
  variants: [
    {
      id: "standard",
      name: "Standard Reception",
      fields: [
        { name: "cocktailHour", label: "Cocktail Hour (min)", type: "number", placeholder: "e.g. 60" },
        { name: "guestSeating", label: "Guest Seating Time (min)", type: "number", placeholder: "e.g. 15" },
        { name: "introductions", label: "Introductions (min)", type: "number", placeholder: "e.g. 10" },
        { name: "firstDance", label: "First Dance (min)", type: "number", placeholder: "e.g. 5" },
        { name: "dinnerService", label: "Dinner Service (min)", type: "number", placeholder: "e.g. 75" },
        { name: "toasts", label: "Toasts/Speeches (min)", type: "number", placeholder: "e.g. 20" },
        { name: "parentDances", label: "Parent Dances (min)", type: "number", placeholder: "e.g. 10" },
        { name: "cakeCutting", label: "Cake Cutting (min)", type: "number", placeholder: "e.g. 10" },
        { name: "bouquetToss", label: "Bouquet/Garter Toss (min)", type: "number", placeholder: "e.g. 10" },
        { name: "openDancing", label: "Open Dancing (min)", type: "number", placeholder: "e.g. 120" },
        { name: "lastDance", label: "Last Dance & Send-off (min)", type: "number", placeholder: "e.g. 15" },
      ],
      calculate: (inputs) => {
        const cocktailHour = (inputs.cocktailHour as number) || 60;
        const guestSeating = (inputs.guestSeating as number) || 15;
        const introductions = (inputs.introductions as number) || 10;
        const firstDance = (inputs.firstDance as number) || 5;
        const dinnerService = (inputs.dinnerService as number) || 75;
        const toasts = (inputs.toasts as number) || 20;
        const parentDances = (inputs.parentDances as number) || 10;
        const cakeCutting = (inputs.cakeCutting as number) || 10;
        const bouquetToss = (inputs.bouquetToss as number) || 10;
        const openDancing = (inputs.openDancing as number) || 120;
        const lastDance = (inputs.lastDance as number) || 15;
        const totalMinutes = cocktailHour + guestSeating + introductions + firstDance + dinnerService + toasts + parentDances + cakeCutting + bouquetToss + openDancing + lastDance;
        if (totalMinutes <= 0) return null;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return {
          primary: { label: "Total Reception Time", value: formatNumber(hours) + "h " + formatNumber(minutes) + "m" },
          details: [
            { label: "Cocktail Hour", value: formatNumber(cocktailHour) + " min" },
            { label: "Seating + Introductions", value: formatNumber(guestSeating + introductions) + " min" },
            { label: "First Dance", value: formatNumber(firstDance) + " min" },
            { label: "Dinner Service", value: formatNumber(dinnerService) + " min" },
            { label: "Toasts/Speeches", value: formatNumber(toasts) + " min" },
            { label: "Parent Dances", value: formatNumber(parentDances) + " min" },
            { label: "Cake Cutting + Toss", value: formatNumber(cakeCutting + bouquetToss) + " min" },
            { label: "Open Dancing", value: formatNumber(openDancing) + " min" },
            { label: "Last Dance & Send-off", value: formatNumber(lastDance) + " min" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wedding-dj-timeline", "wedding-photo-timeline", "wedding-toast-length"],
  faq: [
    { question: "How long should a wedding reception last?", answer: "Most wedding receptions last 4-5 hours, including cocktail hour. A typical timeline is 1 hour cocktails, 1.5 hours dinner, and 2 hours dancing." },
    { question: "When should toasts happen?", answer: "Toasts are typically given during or just after dinner service. Keep total toast time to 15-20 minutes to maintain energy." },
  ],
  formula: "Total Time = Sum of all reception segments",
};
