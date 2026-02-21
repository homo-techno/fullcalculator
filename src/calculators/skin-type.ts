import type { CalculatorDefinition } from "./types";

export const skinTypeCalculator: CalculatorDefinition = {
  slug: "skin-type-calculator",
  title: "Skin Type Calculator",
  description: "Free skin type calculator. Determine your skin type based on simple observations to find the best skincare routine for you.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["skin type calculator", "what is my skin type", "skin type quiz", "skin type test", "oily dry combination skin"],
  variants: [
    {
      id: "assessment",
      name: "Skin Type Assessment",
      description: "Answer questions about your skin to determine your type",
      fields: [
        { name: "oiliness", label: "How does your face feel by midday (no products)?", type: "select", options: [
          { label: "Very oily and shiny all over", value: "4" },
          { label: "Oily in T-zone only (forehead, nose, chin)", value: "3" },
          { label: "Comfortable, neither oily nor dry", value: "2" },
          { label: "Tight, dry, or flaky", value: "1" },
        ], defaultValue: "2" },
        { name: "pores", label: "How would you describe your pores?", type: "select", options: [
          { label: "Large and visible all over", value: "4" },
          { label: "Visible in T-zone, small elsewhere", value: "3" },
          { label: "Small and barely visible", value: "2" },
          { label: "Very small, almost invisible", value: "1" },
        ], defaultValue: "2" },
        { name: "afterWash", label: "How does your skin feel after cleansing?", type: "select", options: [
          { label: "Oily again within an hour", value: "4" },
          { label: "Comfortable for a few hours", value: "3" },
          { label: "Comfortable but slightly dry", value: "2" },
          { label: "Very tight and dry", value: "1" },
        ], defaultValue: "2" },
        { name: "sensitivity", label: "Does your skin react to new products?", type: "select", options: [
          { label: "Rarely, very tolerant", value: "1" },
          { label: "Occasionally, mild reactions", value: "2" },
          { label: "Often, redness or irritation", value: "3" },
          { label: "Almost always, very reactive", value: "4" },
        ], defaultValue: "1" },
        { name: "breakouts", label: "How often do you experience breakouts?", type: "select", options: [
          { label: "Frequently, all over", value: "4" },
          { label: "Sometimes, mostly T-zone", value: "3" },
          { label: "Rarely", value: "2" },
          { label: "Almost never", value: "1" },
        ], defaultValue: "2" },
      ],
      calculate: (inputs) => {
        const oiliness = parseInt(inputs.oiliness as string);
        const pores = parseInt(inputs.pores as string);
        const afterWash = parseInt(inputs.afterWash as string);
        const sensitivity = parseInt(inputs.sensitivity as string);
        const breakouts = parseInt(inputs.breakouts as string);

        const oilScore = oiliness + pores + afterWash + breakouts;
        const sensScore = sensitivity;

        let skinType: string;
        let description: string;
        let tips: string;

        if (oilScore >= 14) {
          skinType = "Oily";
          description = "Your skin produces excess sebum, leading to shine and enlarged pores.";
          tips = "Use oil-free, non-comedogenic products. Gel cleansers, niacinamide serums, and lightweight moisturizers work well.";
        } else if (oilScore >= 11) {
          skinType = "Combination";
          description = "Your T-zone is oily while cheeks may be normal or dry.";
          tips = "Use different products for different zones. Gentle cleanser, balancing toner, and zone-specific moisturizers.";
        } else if (oilScore >= 8) {
          skinType = "Normal";
          description = "Your skin is well-balanced with minimal excess oil or dryness.";
          tips = "Maintain with a gentle cleanser, hydrating serum, and balanced moisturizer. Focus on sun protection.";
        } else {
          skinType = "Dry";
          description = "Your skin lacks moisture and may feel tight or flaky.";
          tips = "Use cream cleansers, hyaluronic acid serums, and rich moisturizers. Avoid harsh exfoliants and alcohol-based products.";
        }

        if (sensScore >= 3) {
          skinType += " / Sensitive";
          tips += " Choose fragrance-free, hypoallergenic products and patch test new products.";
        }

        return {
          primary: { label: "Your Skin Type", value: skinType },
          details: [
            { label: "Description", value: description },
            { label: "Oil Score", value: `${oilScore}/16` },
            { label: "Sensitivity", value: sensScore >= 3 ? "High" : sensScore >= 2 ? "Moderate" : "Low" },
            { label: "Recommended Approach", value: tips },
          ],
          note: "This is a general assessment. For specific skin concerns, consult a dermatologist.",
        };
      },
    },
  ],
  relatedSlugs: ["skincare-routine-calculator", "sunscreen-amount-calculator", "hair-growth-calculator"],
  faq: [
    { question: "What are the main skin types?", answer: "The five main skin types are: Normal (balanced), Oily (excess sebum), Dry (lacks moisture), Combination (oily T-zone with dry/normal cheeks), and Sensitive (reactive, easily irritated). Many people have a mix." },
    { question: "Can your skin type change over time?", answer: "Yes, skin type can change due to aging, hormonal changes, climate, medications, and skincare routine. Oily skin in teens may become normal or dry with age. Seasonal changes also affect skin." },
    { question: "How do I determine my skin type at home?", answer: "The bare-face test: Cleanse your face, pat dry, wait 30 minutes without applying products. If your face is shiny all over, you likely have oily skin. Shiny T-zone only means combination. Comfortable means normal. Tight or flaky means dry." },
  ],
  formula: "Skin type is determined by scoring oiliness, pore size, post-wash feel, breakout frequency (oil score 4-16), and sensitivity (1-4). Oil score: 14+ = Oily, 11-13 = Combination, 8-10 = Normal, 4-7 = Dry. Sensitivity 3+ adds Sensitive classification.",
};
