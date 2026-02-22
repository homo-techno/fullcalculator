import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingPhotoTimelineCalculator: CalculatorDefinition = {
  slug: "wedding-photo-timeline",
  title: "Wedding Photo Timeline Calculator",
  description: "Free wedding photo timeline calculator. Plan how much time to allocate for each photo session during your wedding day.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wedding photography", "photo timeline", "wedding schedule", "photographer", "wedding portraits"],
  variants: [
    {
      id: "standard",
      name: "Standard Photo Timeline",
      fields: [
        { name: "bridalPartySize", label: "Bridal Party Size (total)", type: "number", placeholder: "e.g. 10" },
        { name: "familyGroupings", label: "Family Groupings", type: "number", placeholder: "e.g. 8" },
        { name: "firstLook", label: "First Look?", type: "select", options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ] },
        { name: "locations", label: "Number of Photo Locations", type: "number", placeholder: "e.g. 2" },
        { name: "travelTime", label: "Travel Between Locations (min)", type: "number", placeholder: "e.g. 15" },
      ],
      calculate: (inputs) => {
        const bridalPartySize = (inputs.bridalPartySize as number) || 0;
        const familyGroupings = (inputs.familyGroupings as number) || 0;
        const firstLook = (inputs.firstLook as string) || "no";
        const locations = (inputs.locations as number) || 1;
        const travelTime = (inputs.travelTime as number) || 0;
        const gettingReadyMin = 30;
        const firstLookMin = firstLook === "yes" ? 20 : 0;
        const couplePortraits = 30;
        const bridalPartyMin = Math.max(15, bridalPartySize * 3);
        const familyMin = familyGroupings * 5;
        const detailShots = 15;
        const travelTotal = Math.max(0, (locations - 1)) * travelTime;
        const bufferTime = 15;
        const totalMinutes = gettingReadyMin + firstLookMin + couplePortraits + bridalPartyMin + familyMin + detailShots + travelTotal + bufferTime;
        if (totalMinutes <= 0) return null;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return {
          primary: { label: "Total Photo Time", value: formatNumber(hours) + "h " + formatNumber(minutes) + "m" },
          details: [
            { label: "Getting Ready Shots", value: formatNumber(gettingReadyMin) + " min" },
            { label: "First Look", value: firstLookMin > 0 ? formatNumber(firstLookMin) + " min" : "N/A" },
            { label: "Couple Portraits", value: formatNumber(couplePortraits) + " min" },
            { label: "Bridal Party Photos", value: formatNumber(bridalPartyMin) + " min" },
            { label: "Family Formal Photos", value: formatNumber(familyMin) + " min" },
            { label: "Detail Shots", value: formatNumber(detailShots) + " min" },
            { label: "Travel Time", value: formatNumber(travelTotal) + " min" },
            { label: "Buffer Time", value: formatNumber(bufferTime) + " min" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wedding-guest-list", "reception-timeline", "wedding-dj-timeline"],
  faq: [
    { question: "How long should wedding photos take?", answer: "Most wedding photo sessions take 2-3 hours total, including getting ready shots, couple portraits, bridal party photos, and family formals." },
    { question: "Should we do a first look?", answer: "A first look adds about 20 minutes to your timeline but can save time later by allowing you to do most photos before the ceremony, reducing stress during cocktail hour." },
  ],
  formula: "Total Time = Getting Ready + First Look + Portraits + Party Photos + Family Photos + Details + Travel + Buffer",
};
