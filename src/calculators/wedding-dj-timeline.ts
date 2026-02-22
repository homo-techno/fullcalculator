import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingDjTimelineCalculator: CalculatorDefinition = {
  slug: "wedding-dj-timeline",
  title: "Wedding DJ/Music Timeline",
  description: "Free wedding DJ and music timeline calculator. Plan your reception music schedule including ceremony, cocktail hour, dinner, and dancing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wedding DJ", "music timeline", "reception music", "wedding playlist", "dance schedule"],
  variants: [
    {
      id: "fullReception",
      name: "Full Reception Timeline",
      fields: [
        { name: "ceremonyMusic", label: "Ceremony Music (min)", type: "number", placeholder: "e.g. 30" },
        { name: "cocktailHour", label: "Cocktail Hour (min)", type: "number", placeholder: "e.g. 60" },
        { name: "dinnerMusic", label: "Dinner Music (min)", type: "number", placeholder: "e.g. 90" },
        { name: "specialDances", label: "Special Dances Count", type: "number", placeholder: "e.g. 4" },
        { name: "dancingTime", label: "Open Dancing (min)", type: "number", placeholder: "e.g. 120" },
        { name: "toastsTime", label: "Toasts/Speeches (min)", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const ceremonyMusic = (inputs.ceremonyMusic as number) || 30;
        const cocktailHour = (inputs.cocktailHour as number) || 60;
        const dinnerMusic = (inputs.dinnerMusic as number) || 90;
        const specialDances = (inputs.specialDances as number) || 4;
        const dancingTime = (inputs.dancingTime as number) || 120;
        const toastsTime = (inputs.toastsTime as number) || 20;
        const specialDancesMin = specialDances * 4;
        const totalMinutes = ceremonyMusic + cocktailHour + dinnerMusic + specialDancesMin + dancingTime + toastsTime;
        if (totalMinutes <= 0) return null;
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMin = totalMinutes % 60;
        const ceremonySongs = Math.ceil(ceremonyMusic / 4);
        const cocktailSongs = Math.ceil(cocktailHour / 3.5);
        const dinnerSongs = Math.ceil(dinnerMusic / 4);
        const danceSongs = Math.ceil(dancingTime / 3.5);
        const totalSongs = ceremonySongs + cocktailSongs + dinnerSongs + danceSongs + specialDances;
        return {
          primary: { label: "Total Music Time", value: formatNumber(totalHours) + "h " + formatNumber(remainingMin) + "m" },
          details: [
            { label: "Ceremony Music", value: formatNumber(ceremonyMusic) + " min (" + formatNumber(ceremonySongs) + " songs)" },
            { label: "Cocktail Hour", value: formatNumber(cocktailHour) + " min (" + formatNumber(cocktailSongs) + " songs)" },
            { label: "Dinner Music", value: formatNumber(dinnerMusic) + " min (" + formatNumber(dinnerSongs) + " songs)" },
            { label: "Special Dances", value: formatNumber(specialDancesMin) + " min (" + formatNumber(specialDances) + " dances)" },
            { label: "Open Dancing", value: formatNumber(dancingTime) + " min (" + formatNumber(danceSongs) + " songs)" },
            { label: "Toasts/Speeches", value: formatNumber(toastsTime) + " min" },
            { label: "Total Songs Needed", value: formatNumber(totalSongs) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["reception-timeline", "wedding-photo-timeline", "wedding-toast-length"],
  faq: [
    { question: "How long should a wedding DJ play?", answer: "A typical wedding DJ plays for 4-6 hours, covering cocktail hour through the last dance. Ceremony music may be separate." },
    { question: "How many songs should be on a wedding playlist?", answer: "Plan for approximately 15-20 songs per hour. A 5-hour reception needs about 75-100 songs, plus specialty songs." },
  ],
  formula: "Total Time = Ceremony + Cocktail + Dinner + Special Dances + Dancing + Toasts",
};
