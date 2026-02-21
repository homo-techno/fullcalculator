import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const spiceConversionCalculator: CalculatorDefinition = {
  slug: "spice-conversion-calculator",
  title: "Fresh to Dried Spice Conversion Calculator",
  description:
    "Free fresh to dried spice conversion calculator. Convert between fresh herbs, dried herbs, and ground spices for accurate recipe substitutions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "fresh to dried herbs",
    "herb conversion",
    "dried to fresh herbs",
    "spice conversion",
    "herb substitute",
    "fresh herb equivalent",
  ],
  variants: [
    {
      id: "fresh-to-dried",
      name: "Fresh to Dried",
      description: "Convert fresh herbs to dried or ground",
      fields: [
        {
          name: "amount",
          label: "Fresh Herb Amount (tablespoons)",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "herb",
          label: "Herb / Spice",
          type: "select",
          options: [
            { label: "Basil", value: "basil" },
            { label: "Cilantro", value: "cilantro" },
            { label: "Dill", value: "dill" },
            { label: "Oregano", value: "oregano" },
            { label: "Parsley", value: "parsley" },
            { label: "Rosemary", value: "rosemary" },
            { label: "Sage", value: "sage" },
            { label: "Thyme", value: "thyme" },
            { label: "Mint", value: "mint" },
            { label: "Tarragon", value: "tarragon" },
            { label: "Chives", value: "chives" },
            { label: "Ginger (grated)", value: "ginger" },
            { label: "Garlic (cloves)", value: "garlic" },
          ],
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const herb = inputs.herb as string;
        if (!amount || !herb) return null;

        // Conversion ratios: fresh tbsp to dried tsp
        // Standard rule: 1 tbsp fresh = 1 tsp dried (3:1 ratio)
        // Some herbs deviate from standard
        const ratios: Record<string, { driedRatio: number; groundRatio: number; notes: string }> = {
          basil: { driedRatio: 3, groundRatio: 6, notes: "Dried basil has a different flavor profile than fresh. Add dried basil earlier in cooking." },
          cilantro: { driedRatio: 3, groundRatio: 0, notes: "Dried cilantro is a poor substitute for fresh. Consider using cilantro paste or cumin + parsley instead." },
          dill: { driedRatio: 3, groundRatio: 0, notes: "Dried dill weed works well as a substitute. Dill seed has a different, more intense flavor." },
          oregano: { driedRatio: 3, groundRatio: 6, notes: "Dried oregano is actually more concentrated and flavorful than fresh for many Italian dishes." },
          parsley: { driedRatio: 3, groundRatio: 0, notes: "Dried parsley is very mild. Consider using more than the standard ratio or fresh flat-leaf parsley." },
          rosemary: { driedRatio: 3, groundRatio: 4, notes: "Dried rosemary is quite potent. Crush it before adding to release more flavor." },
          sage: { driedRatio: 3, groundRatio: 6, notes: "Rubbed sage (fluffy) is lighter than ground sage. Use 2x the ground amount for rubbed." },
          thyme: { driedRatio: 3, groundRatio: 4, notes: "Dried thyme is an excellent substitute for fresh. One of the best herbs for drying." },
          mint: { driedRatio: 3, groundRatio: 0, notes: "Dried mint works well in teas and Middle Eastern dishes but lacks the brightness of fresh." },
          tarragon: { driedRatio: 3, groundRatio: 0, notes: "Dried tarragon is reasonably close to fresh. Good for sauces and vinaigrettes." },
          chives: { driedRatio: 3, groundRatio: 0, notes: "Freeze-dried chives are a better substitute than regular dried. Use as garnish." },
          ginger: { driedRatio: 4, groundRatio: 8, notes: "1 tbsp fresh grated ginger = 1/4 tsp ground ginger. The flavor is quite different." },
          garlic: { driedRatio: 0, groundRatio: 0, notes: "1 fresh clove = 1/8 tsp garlic powder = 1/2 tsp minced dried garlic." },
        };

        const data = ratios[herb];
        if (!data) return null;

        const herbNames: Record<string, string> = {
          basil: "Basil", cilantro: "Cilantro", dill: "Dill", oregano: "Oregano",
          parsley: "Parsley", rosemary: "Rosemary", sage: "Sage", thyme: "Thyme",
          mint: "Mint", tarragon: "Tarragon", chives: "Chives", ginger: "Ginger",
          garlic: "Garlic",
        };

        let driedAmount: string;
        let groundAmount: string;

        if (herb === "garlic") {
          // Special case: amount is in cloves
          const garPowder = amount * 0.125;
          const garDried = amount * 0.5;
          driedAmount = formatNumber(garDried, 1) + " tsp minced dried garlic";
          groundAmount = formatNumber(garPowder, 2) + " tsp garlic powder";
        } else {
          const dried = amount / data.driedRatio;
          driedAmount = formatNumber(dried, 2) + " tsp dried " + herbNames[herb].toLowerCase();
          if (data.groundRatio > 0) {
            const ground = amount / data.groundRatio;
            groundAmount = formatNumber(ground, 2) + " tsp ground " + herbNames[herb].toLowerCase();
          } else {
            groundAmount = "N/A (ground form not common)";
          }
        }

        const details = [
          { label: "Fresh Amount", value: amount + (herb === "garlic" ? " clove(s)" : " tbsp fresh " + herbNames[herb].toLowerCase()) },
          { label: "Dried Equivalent", value: driedAmount },
          { label: "Ground Equivalent", value: groundAmount },
          { label: "Standard Ratio", value: herb === "garlic" ? "1 clove = 1/8 tsp powder" : "3 parts fresh = 1 part dried" },
          { label: "Notes", value: data.notes },
        ];

        return {
          primary: {
            label: "Dried Equivalent",
            value: driedAmount,
          },
          details,
        };
      },
    },
    {
      id: "dried-to-fresh",
      name: "Dried to Fresh",
      description: "Convert dried herbs back to fresh amounts",
      fields: [
        {
          name: "amount",
          label: "Dried Herb Amount (teaspoons)",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "herb",
          label: "Herb / Spice",
          type: "select",
          options: [
            { label: "Basil", value: "basil" },
            { label: "Cilantro", value: "cilantro" },
            { label: "Dill", value: "dill" },
            { label: "Oregano", value: "oregano" },
            { label: "Parsley", value: "parsley" },
            { label: "Rosemary", value: "rosemary" },
            { label: "Sage", value: "sage" },
            { label: "Thyme", value: "thyme" },
            { label: "Mint", value: "mint" },
            { label: "Tarragon", value: "tarragon" },
          ],
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const herb = inputs.herb as string;
        if (!amount || !herb) return null;

        // Dried to fresh: multiply by 3 (reverse of fresh to dried)
        const freshTbsp = amount * 3;
        const freshTsp = freshTbsp * 3;

        const herbNames: Record<string, string> = {
          basil: "Basil", cilantro: "Cilantro", dill: "Dill", oregano: "Oregano",
          parsley: "Parsley", rosemary: "Rosemary", sage: "Sage", thyme: "Thyme",
          mint: "Mint", tarragon: "Tarragon",
        };

        return {
          primary: {
            label: "Fresh Equivalent",
            value: formatNumber(freshTbsp, 1) + " tbsp fresh " + (herbNames[herb] || herb).toLowerCase(),
          },
          details: [
            { label: "Dried Amount", value: amount + " tsp" },
            { label: "Fresh Equivalent (tbsp)", value: formatNumber(freshTbsp, 1) + " tbsp" },
            { label: "Fresh Equivalent (tsp)", value: formatNumber(freshTsp, 1) + " tsp" },
            { label: "Conversion Ratio", value: "1 tsp dried = 3 tsp (1 tbsp) fresh" },
          ],
          note: "Add fresh herbs near the end of cooking to preserve their flavor. Dried herbs can be added earlier.",
        };
      },
    },
  ],
  relatedSlugs: ["baking-conversion-calculator", "cooking-converter"],
  faq: [
    {
      question: "What is the general rule for fresh to dried herb conversion?",
      answer:
        "The standard ratio is 3:1 - use 3 times as much fresh herb as dried. So 1 tablespoon of fresh herbs equals 1 teaspoon of dried herbs. This works for most herbs like basil, oregano, thyme, and rosemary.",
    },
    {
      question: "When should I add dried vs. fresh herbs?",
      answer:
        "Add dried herbs early in cooking (with the onions/aromatics) to allow their flavor to develop and soften. Add fresh herbs near the end of cooking or as a garnish to preserve their bright, fresh flavor.",
    },
    {
      question: "Which dried herbs are better than fresh?",
      answer:
        "Oregano, thyme, and rosemary are excellent dried - some cooks prefer them. Bay leaves are almost always used dried. Herbs like basil, cilantro, and parsley are significantly better fresh, as drying changes their flavor profile substantially.",
    },
  ],
  formula:
    "Standard Ratio: 1 tbsp fresh = 1 tsp dried = 1/2 tsp ground. Fresh to Dried: divide by 3. Dried to Fresh: multiply by 3. Exceptions: Fresh ginger 1 tbsp = 1/4 tsp ground. Fresh garlic 1 clove = 1/8 tsp powder.",
};
