import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paSystemSizeCalculator: CalculatorDefinition = {
  slug: "pa-system-size-calculator",
  title: "PA System Size Calculator",
  description: "Determine the appropriate PA system wattage for your venue based on audience size and space.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["PA system size", "PA wattage", "sound system sizing"],
  variants: [{
    id: "standard",
    name: "PA System Size",
    description: "Determine the appropriate PA system wattage for your venue based on audience size and space",
    fields: [
      { name: "audienceSize", label: "Audience Size", type: "number", min: 10, max: 100000, defaultValue: 200 },
      { name: "venueType", label: "Venue Type", type: "select", options: [{value:"indoor",label:"Indoor"},{value:"outdoor",label:"Outdoor"},{value:"tent",label:"Tent/Covered"}], defaultValue: "indoor" },
      { name: "eventType", label: "Event Type", type: "select", options: [{value:"speech",label:"Speech/Presentation"},{value:"acoustic",label:"Acoustic Music"},{value:"band",label:"Live Band"},{value:"dj",label:"DJ/Dance"}], defaultValue: "band" },
    ],
    calculate: (inputs) => {
      const audience = inputs.audienceSize as number;
      const venue = inputs.venueType as string;
      const event = inputs.eventType as string;
      if (!audience || audience <= 0) return null;
      const wattsPerPerson: Record<string, number> = { speech: 2, acoustic: 5, band: 8, dj: 12 };
      const venueMult: Record<string, number> = { indoor: 1.0, outdoor: 2.5, tent: 1.5 };
      const baseWatts = audience * (wattsPerPerson[event] || 8);
      const totalWatts = Math.round(baseWatts * (venueMult[venue] || 1.0));
      const speakers = Math.ceil(totalWatts / 500);
      const subs = event === "dj" || event === "band" ? Math.ceil(speakers / 2) : 0;
      return {
        primary: { label: "Recommended Wattage", value: formatNumber(totalWatts) + " W" },
        details: [
          { label: "Speakers Needed", value: String(speakers) + " (500W each)" },
          { label: "Subwoofers Needed", value: String(subs) },
          { label: "Audience Size", value: formatNumber(audience) },
        ],
      };
    },
  }],
  relatedSlugs: ["audio-room-treatment-calculator", "band-booking-calculator"],
  faq: [
    { question: "How many watts do I need for a PA system?", answer: "For a live band indoors, plan about 8 watts per person. For outdoor events, multiply by 2.5 to account for sound dispersion." },
    { question: "Do I need subwoofers for a PA system?", answer: "Subwoofers are recommended for live bands and DJ events to reproduce bass frequencies. Speech and acoustic events generally do not need them." },
  ],
  formula: "Wattage = Audience Size x Watts per Person x Venue Multiplier",
};
