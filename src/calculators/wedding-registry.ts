import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingRegistryCalculator: CalculatorDefinition = {
  slug: "wedding-registry",
  title: "Wedding Registry Estimator",
  description: "Free wedding registry estimator. Plan your gift registry with the right number of items across different price ranges based on your guest list.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wedding registry", "gift registry", "wedding gifts", "registry planning", "gift list"],
  variants: [
    {
      id: "standard",
      name: "Registry Planning",
      fields: [
        { name: "guestCount", label: "Number of Gift-Giving Guests", type: "number", placeholder: "e.g. 120" },
        { name: "avgGift", label: "Average Gift Budget ($)", type: "number", placeholder: "e.g. 100" },
        { name: "groupGiftPercent", label: "Group Gift Givers (%)", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const guestCount = (inputs.guestCount as number) || 0;
        const avgGift = (inputs.avgGift as number) || 100;
        const groupGiftPercent = (inputs.groupGiftPercent as number) || 20;
        if (guestCount <= 0) return null;
        const totalItems = Math.ceil(guestCount * 1.5);
        const budgetItems = Math.ceil(totalItems * 0.3);
        const midItems = Math.ceil(totalItems * 0.4);
        const premiumItems = Math.ceil(totalItems * 0.2);
        const groupItems = Math.ceil(totalItems * 0.1);
        const estimatedGifts = guestCount * avgGift;
        const groupGifts = Math.ceil(guestCount * (groupGiftPercent / 100) / 3);
        return {
          primary: { label: "Total Registry Items", value: formatNumber(totalItems) },
          details: [
            { label: "Budget Items (under $50)", value: formatNumber(budgetItems) },
            { label: "Mid-Range ($50-$150)", value: formatNumber(midItems) },
            { label: "Premium ($150-$300)", value: formatNumber(premiumItems) },
            { label: "Group Gift Items ($300+)", value: formatNumber(groupItems) },
            { label: "Estimated Total Gifts", value: "$" + formatNumber(estimatedGifts, 2) },
            { label: "Expected Group Gifts", value: formatNumber(groupGifts) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wedding-guest-list", "wedding-invitation", "honeymoon-budget"],
  faq: [
    { question: "How many items should be on a wedding registry?", answer: "Register for 1.5-2 times the number of gift-giving guests. For 100 guests, aim for 150-200 items across various price points." },
    { question: "What price ranges should I include?", answer: "Include 30% budget items (under $50), 40% mid-range ($50-$150), 20% premium ($150-$300), and 10% big-ticket group gift items ($300+)." },
  ],
  formula: "Total Items = Gift-Giving Guests x 1.5",
};
