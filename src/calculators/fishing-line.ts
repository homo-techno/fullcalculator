import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fishingLineCalculator: CalculatorDefinition = {
  slug: "fishing-line-calculator",
  title: "Fishing Line Calculator",
  description: "Free fishing line weight calculator. Calculate the right fishing line strength, capacity, and type for your target fish species and reel.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fishing line calculator", "fishing line weight calculator", "fishing line strength", "what pound test line", "reel line capacity"],
  variants: [
    {
      id: "by-fish",
      name: "By Target Fish",
      description: "Get recommended line weight for your target species",
      fields: [
        { name: "species", label: "Target Species", type: "select", options: [
          { label: "Panfish (Bluegill, Crappie)", value: "panfish" },
          { label: "Trout (Stream/Lake)", value: "trout" },
          { label: "Bass (Largemouth/Smallmouth)", value: "bass" },
          { label: "Walleye / Pike", value: "walleye" },
          { label: "Catfish (Channel)", value: "catfish" },
          { label: "Muskie / Northern Pike", value: "muskie" },
          { label: "Salmon / Steelhead", value: "salmon" },
          { label: "Redfish / Snook (Inshore)", value: "inshore" },
          { label: "Tuna / Offshore", value: "offshore" },
          { label: "Surf Fishing", value: "surf" },
        ] },
        { name: "lineType", label: "Line Type", type: "select", options: [
          { label: "Monofilament", value: "mono" },
          { label: "Fluorocarbon", value: "fluoro" },
          { label: "Braided", value: "braid" },
        ], defaultValue: "mono" },
      ],
      calculate: (inputs) => {
        const species = inputs.species as string;
        const lineType = inputs.lineType as string;
        if (!species) return null;
        const speciesData: Record<string, { monoLb: number[]; braidLb: number[]; avgWeight: string; technique: string }> = {
          panfish: { monoLb: [2, 6], braidLb: [4, 10], avgWeight: "0.5-2 lbs", technique: "Light tackle, small hooks" },
          trout: { monoLb: [4, 8], braidLb: [6, 10], avgWeight: "1-5 lbs", technique: "Light spinning, fly fishing" },
          bass: { monoLb: [8, 17], braidLb: [15, 30], avgWeight: "2-8 lbs", technique: "Spinning or baitcasting" },
          walleye: { monoLb: [6, 12], braidLb: [10, 20], avgWeight: "2-8 lbs", technique: "Jigging, trolling" },
          catfish: { monoLb: [12, 20], braidLb: [20, 40], avgWeight: "5-30 lbs", technique: "Bottom fishing, heavy tackle" },
          muskie: { monoLb: [17, 30], braidLb: [40, 65], avgWeight: "10-30 lbs", technique: "Heavy casting, trolling" },
          salmon: { monoLb: [10, 20], braidLb: [20, 40], avgWeight: "5-30 lbs", technique: "Trolling, drift fishing" },
          inshore: { monoLb: [10, 20], braidLb: [15, 30], avgWeight: "5-20 lbs", technique: "Spinning, baitcasting" },
          offshore: { monoLb: [30, 80], braidLb: [50, 100], avgWeight: "20-200+ lbs", technique: "Trolling, heavy tackle" },
          surf: { monoLb: [15, 25], braidLb: [20, 40], avgWeight: "Varies", technique: "Long casting, heavy sinkers" },
        };
        const data = speciesData[species] || speciesData.bass;
        const isMonoLike = lineType === "mono" || lineType === "fluoro";
        const range = isMonoLike ? data.monoLb : data.braidLb;
        const recommended = `${range[0]}-${range[1]} lb test`;
        const lineDiameter = isMonoLike
          ? `${formatNumber(Math.sqrt(range[0]) * 0.004, 4)}-${formatNumber(Math.sqrt(range[1]) * 0.004, 4)} inches`
          : "Much thinner than equivalent mono";
        return {
          primary: { label: "Recommended Line", value: recommended },
          details: [
            { label: "Line type", value: lineType === "mono" ? "Monofilament" : lineType === "fluoro" ? "Fluorocarbon" : "Braided" },
            { label: "Target fish weight", value: data.avgWeight },
            { label: "Fishing technique", value: data.technique },
            { label: "Line diameter", value: lineDiameter },
          ],
          note: lineType === "braid" ? "Braided line has no stretch and is much thinner per pound test. Use a fluorocarbon leader for less visibility." : lineType === "fluoro" ? "Fluorocarbon is nearly invisible underwater but more expensive. Less stretch than mono." : "Monofilament is the most versatile and affordable. Has stretch for shock absorption.",
        };
      },
    },
    {
      id: "capacity",
      name: "Reel Line Capacity",
      description: "Calculate how much line fits on your reel",
      fields: [
        { name: "reelCapacity", label: "Reel Rated Capacity", type: "select", options: [
          { label: "Ultralight (100yd / 4lb mono)", value: "100-4" },
          { label: "Light (150yd / 6lb mono)", value: "150-6" },
          { label: "Medium Light (200yd / 8lb mono)", value: "200-8" },
          { label: "Medium (220yd / 10lb mono)", value: "220-10" },
          { label: "Medium Heavy (200yd / 14lb mono)", value: "200-14" },
          { label: "Heavy (180yd / 17lb mono)", value: "180-17" },
          { label: "Extra Heavy (200yd / 20lb mono)", value: "200-20" },
        ], defaultValue: "220-10" },
        { name: "targetLine", label: "Line Type to Spool", type: "select", options: [
          { label: "Monofilament", value: "mono" },
          { label: "Fluorocarbon", value: "fluoro" },
          { label: "Braided (2x capacity)", value: "braid" },
        ], defaultValue: "mono" },
        { name: "targetLb", label: "Target Pound Test", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const cap = inputs.reelCapacity as string;
        const lineType = inputs.targetLine as string;
        const targetLb = inputs.targetLb as number;
        if (!cap || !targetLb) return null;
        const [ydsStr, lbStr] = cap.split("-");
        const ratedYds = parseInt(ydsStr);
        const ratedLb = parseInt(lbStr);
        // Line diameter roughly proportional to sqrt of pound test
        const ratio = Math.sqrt(ratedLb) / Math.sqrt(targetLb);
        let adjustedYds = ratedYds * ratio * ratio;
        if (lineType === "braid") adjustedYds = adjustedYds * 2; // braid is ~half diameter
        else if (lineType === "fluoro") adjustedYds = adjustedYds * 0.95; // fluoro slightly thicker
        const adjustedMeters = adjustedYds * 0.9144;
        return {
          primary: { label: "Estimated Line Capacity", value: `${formatNumber(adjustedYds, 0)} yards` },
          details: [
            { label: "Meters", value: formatNumber(adjustedMeters, 0) },
            { label: "Reel rated for", value: `${ratedYds} yds of ${ratedLb} lb mono` },
            { label: "Target line", value: `${targetLb} lb ${lineType}` },
            { label: "Capacity change", value: `${formatNumber((adjustedYds / ratedYds - 1) * 100, 0)}%` },
          ],
          note: "These are estimates. Actual capacity varies by line brand and how tightly line is spooled. Fill reel to within 1/8 inch of the spool lip for best casting.",
        };
      },
    },
  ],
  relatedSlugs: ["trail-distance-calculator", "tide-calculator", "visibility-distance-calculator"],
  faq: [
    { question: "What pound test line should I use?", answer: "Match line strength to your target species: panfish 2-6 lb, trout 4-8 lb, bass 8-17 lb, walleye 6-12 lb, catfish 12-20 lb. A good rule of thumb: use line rated for 1/3 to 1/2 the rod's power rating." },
    { question: "Should I use mono, fluoro, or braided line?", answer: "Monofilament: best all-around, affordable, some stretch. Fluorocarbon: nearly invisible underwater, good for clear water. Braided: strongest, thinnest, no stretch, best for sensitivity. Many anglers use braided mainline with a fluorocarbon leader." },
    { question: "How often should I replace fishing line?", answer: "Monofilament: every 3-6 months or sooner with heavy use. Fluorocarbon: every 6-12 months. Braided: can last 1-2+ years. Replace immediately if you see nicks, fraying, or color fading. UV exposure degrades mono fastest." },
  ],
  formula: "Line capacity ratio = (Rated lb / Target lb) for same-type line | Braid capacity ≈ 2× monofilament capacity for same pound test",
};
