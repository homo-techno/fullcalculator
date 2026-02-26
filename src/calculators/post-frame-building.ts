import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const postFrameBuildingCalculator: CalculatorDefinition = {
  slug: "post-frame-building-calculator",
  title: "Post Frame / Pole Barn Material Calculator",
  description:
    "Calculate materials for a post frame (pole barn) building including posts, trusses, purlins, girts, and metal roofing/siding.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pole barn calculator",
    "post frame building",
    "pole building materials",
    "barn material calculator",
    "post frame cost",
  ],
  variants: [
    {
      id: "standard",
      name: "Standard Post Frame Building",
      description: "Calculate materials for a rectangular post frame building",
      fields: [
        {
          name: "buildingLength",
          label: "Building Length (feet)",
          type: "number",
          placeholder: "e.g. 40",
        },
        {
          name: "buildingWidth",
          label: "Building Width (feet)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "wallHeight",
          label: "Sidewall Height (feet)",
          type: "select",
          options: [
            { label: "10 ft", value: "10" },
            { label: "12 ft", value: "12" },
            { label: "14 ft", value: "14" },
            { label: "16 ft", value: "16" },
          ],
          defaultValue: "12",
        },
        {
          name: "postSpacing",
          label: "Post Spacing (feet)",
          type: "select",
          options: [
            { label: "6 ft", value: "6" },
            { label: "8 ft", value: "8" },
            { label: "10 ft", value: "10" },
          ],
          defaultValue: "8",
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.buildingLength as string);
        const width = parseFloat(inputs.buildingWidth as string);
        const wallHeight = parseFloat(inputs.wallHeight as string);
        const postSpacing = parseFloat(inputs.postSpacing as string);
        if (!length || !width || !wallHeight || !postSpacing) return null;

        // Posts: around perimeter at spacing
        const perimeter = 2 * (length + width);
        const numPosts = Math.ceil(perimeter / postSpacing);
        const postLength = wallHeight + 4; // 4 ft buried

        // Trusses: one every post spacing along length, plus gable ends
        const numTrusses = Math.ceil(length / postSpacing) + 1;

        // Purlins: roof. Assume 4/12 pitch, 2ft spacing on each side
        const roofRun = width / 2;
        const roofSlope = Math.sqrt(roofRun * roofRun + (roofRun * 4 / 12) * (roofRun * 4 / 12));
        const purlinsPerSide = Math.ceil(roofSlope / 2) + 1;
        const totalPurlins = purlinsPerSide * 2 * (Math.ceil(length / postSpacing));

        // Girts (horizontal wall members): 3-4 per bay depending on height
        const girtsPerBay = Math.ceil(wallHeight / 3);
        const baysLongWalls = Math.ceil(length / postSpacing) * 2;
        const baysEndWalls = Math.ceil(width / postSpacing) * 2;
        const totalGirts = (baysLongWalls + baysEndWalls) * girtsPerBay;

        // Metal roofing: each side of roof
        const roofArea = roofSlope * length * 2;
        const roofPanels = Math.ceil(roofArea / (3 * length)); // 3ft wide panels

        // Metal siding
        const wallArea = perimeter * wallHeight;
        const sidingPanels = Math.ceil(wallArea / (3 * wallHeight));

        // Screws: ~1 per sq ft
        const totalScrews = Math.ceil(roofArea + wallArea);

        return {
          primary: {
            label: "Total Posts",
            value: `${formatNumber(numPosts)} posts`,
          },
          details: [
            { label: "Posts (6x6 treated)", value: `${formatNumber(numPosts)} @ ${formatNumber(postLength)}ft` },
            { label: "Trusses", value: `${formatNumber(numTrusses)} (${formatNumber(width)}ft span)` },
            { label: "Purlins (2x4)", value: formatNumber(totalPurlins) },
            { label: "Girts (2x6)", value: formatNumber(totalGirts) },
            { label: "Roof area", value: `${formatNumber(roofArea, 0)} sq ft` },
            { label: "Metal roof panels (3ft wide)", value: formatNumber(roofPanels) },
            { label: "Wall area", value: `${formatNumber(wallArea)} sq ft` },
            { label: "Metal siding panels", value: formatNumber(sidingPanels) },
            { label: "Screws (approx)", value: formatNumber(totalScrews) },
          ],
          note: "Assumes 4/12 roof pitch, girts at 3ft spacing, purlins at 2ft spacing. Actual requirements vary by wind load, snow load, and local building codes. Consult a post frame engineer.",
        };
      },
    },
    {
      id: "cost-estimate",
      name: "Pole Barn Cost Estimate",
      description: "Rough cost estimate for a pole barn building",
      fields: [
        {
          name: "length",
          label: "Length (feet)",
          type: "number",
          placeholder: "e.g. 40",
        },
        {
          name: "width",
          label: "Width (feet)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "quality",
          label: "Build Quality",
          type: "select",
          options: [
            { label: "Economy (open sides, basic)", value: "8" },
            { label: "Standard (enclosed, basic)", value: "15" },
            { label: "Premium (insulated, finished)", value: "25" },
          ],
          defaultValue: "15",
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string);
        const width = parseFloat(inputs.width as string);
        const costPerSqFt = parseFloat(inputs.quality as string);
        if (!length || !width || !costPerSqFt) return null;

        const sqFt = length * width;
        const materialCost = sqFt * costPerSqFt;
        const laborCost = materialCost * 0.6;
        const concreteCost = sqFt * 2; // rough slab estimate
        const totalCost = materialCost + laborCost + concreteCost;

        return {
          primary: {
            label: "Estimated Total Cost",
            value: `$${formatNumber(totalCost)}`,
          },
          details: [
            { label: "Building footprint", value: `${formatNumber(sqFt)} sq ft` },
            { label: "Material cost", value: `$${formatNumber(materialCost)}` },
            { label: "Labor estimate", value: `$${formatNumber(laborCost)}` },
            { label: "Concrete/foundation", value: `$${formatNumber(concreteCost)}` },
            { label: "Cost per sq ft (total)", value: `$${formatNumber(totalCost / sqFt, 2)}` },
          ],
          note: "Very rough budgeting estimate. Actual costs vary significantly by region, site conditions, doors/windows, insulation, and electrical. Get multiple quotes from local builders.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "rafter-length-calculator", "wood-beam-span-calculator"],
  faq: [
    {
      question: "How much does a pole barn cost per square foot?",
      answer:
        "A basic pole barn (open sides, metal roof/siding) costs $8-12 per square foot for materials. A fully enclosed standard barn is $15-25/sqft. With insulation, concrete floor, and finishing, expect $25-45/sqft. Labor adds 40-60% to material costs.",
    },
    {
      question: "How deep should pole barn posts be?",
      answer:
        "Pole barn posts should be buried at least 4 feet deep, or below the frost line plus 6 inches, whichever is deeper. Posts are typically set in concrete collars. For a 12ft sidewall, use 16ft posts (12ft above grade + 4ft buried).",
    },
  ],
  formula:
    "Posts = Perimeter / Spacing | Trusses = Length / Spacing + 1 | Roof Area = Slope Length x Building Length x 2",
};
