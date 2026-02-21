import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const printingCostCalculator: CalculatorDefinition = {
  slug: "printing-cost-calculator",
  title: "Printing Cost Calculator",
  description: "Free printing cost calculator. Estimate total printing costs for books, brochures, flyers, and custom print jobs including paper, ink, and binding.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["printing cost calculator", "print job cost", "book printing cost", "flyer printing cost", "brochure cost calculator"],
  variants: [
    {
      id: "perpage",
      name: "Cost per Page",
      description: "Calculate total cost from cost-per-page rate",
      fields: [
        { name: "pages", label: "Number of Pages", type: "number", placeholder: "e.g. 200" },
        { name: "copies", label: "Number of Copies", type: "number", placeholder: "e.g. 100", defaultValue: 1 },
        { name: "printType", label: "Print Type", type: "select", options: [
          { label: "B&W single-sided ($0.03-0.05)", value: "0.04" },
          { label: "B&W double-sided ($0.05-0.08)", value: "0.06" },
          { label: "Color single-sided ($0.10-0.20)", value: "0.15" },
          { label: "Color double-sided ($0.15-0.30)", value: "0.22" },
          { label: "Photo quality ($0.50-1.00)", value: "0.75" },
          { label: "Custom rate", value: "custom" },
        ], defaultValue: "0.06" },
        { name: "customRate", label: "Custom Rate per Page ($)", type: "number", placeholder: "e.g. 0.10", prefix: "$", step: 0.01 },
      ],
      calculate: (inputs) => {
        const pages = inputs.pages as number;
        const copies = (inputs.copies as number) || 1;
        const printType = inputs.printType as string;
        const customRate = inputs.customRate as number;
        if (!pages) return null;

        const rate = printType === "custom" ? (customRate || 0) : parseFloat(printType);
        if (!rate) return null;

        const totalPages = pages * copies;
        const totalCost = totalPages * rate;
        const costPerCopy = pages * rate;

        return {
          primary: { label: "Total Cost", value: `$${formatNumber(totalCost, 2)}` },
          details: [
            { label: "Cost per page", value: `$${formatNumber(rate, 4)}` },
            { label: "Pages per copy", value: formatNumber(pages) },
            { label: "Number of copies", value: formatNumber(copies) },
            { label: "Total pages", value: formatNumber(totalPages) },
            { label: "Cost per copy", value: `$${formatNumber(costPerCopy, 2)}` },
            { label: "Total cost", value: `$${formatNumber(totalCost, 2)}` },
          ],
        };
      },
    },
    {
      id: "book",
      name: "Book/Booklet Printing",
      description: "Estimate book or booklet printing costs",
      fields: [
        { name: "pageCount", label: "Page Count (interior)", type: "number", placeholder: "e.g. 200" },
        { name: "copies", label: "Number of Copies", type: "number", placeholder: "e.g. 100" },
        { name: "interiorType", label: "Interior Printing", type: "select", options: [
          { label: "B&W interior ($0.015/page)", value: "0.015" },
          { label: "Color interior ($0.06/page)", value: "0.06" },
          { label: "Premium color ($0.12/page)", value: "0.12" },
        ], defaultValue: "0.015" },
        { name: "coverType", label: "Cover Type", type: "select", options: [
          { label: "Softcover ($0.85/unit)", value: "0.85" },
          { label: "Hardcover ($5.50/unit)", value: "5.50" },
          { label: "Laminated softcover ($1.50/unit)", value: "1.50" },
        ], defaultValue: "0.85" },
        { name: "size", label: "Book Size", type: "select", options: [
          { label: "5.5x8.5 (Digest)", value: "1.0" },
          { label: "6x9 (Standard)", value: "1.1" },
          { label: "8.5x11 (Full Size)", value: "1.3" },
          { label: "8.5x8.5 (Square)", value: "1.25" },
        ], defaultValue: "1.0" },
      ],
      calculate: (inputs) => {
        const pageCount = inputs.pageCount as number;
        const copies = inputs.copies as number;
        const interiorRate = parseFloat(inputs.interiorType as string) || 0.015;
        const coverCost = parseFloat(inputs.coverType as string) || 0.85;
        const sizeMultiplier = parseFloat(inputs.size as string) || 1.0;
        if (!pageCount || !copies) return null;

        const adjustedInterior = interiorRate * sizeMultiplier;
        const interiorCostPerBook = pageCount * adjustedInterior;
        const costPerBook = interiorCostPerBook + coverCost;
        const totalCost = costPerBook * copies;
        const setupFee = copies < 50 ? 25 : 0;

        return {
          primary: { label: "Total Print Cost", value: `$${formatNumber(totalCost + setupFee, 2)}` },
          details: [
            { label: "Interior cost per book", value: `$${formatNumber(interiorCostPerBook, 2)}` },
            { label: "Cover cost per book", value: `$${formatNumber(coverCost, 2)}` },
            { label: "Cost per book", value: `$${formatNumber(costPerBook, 2)}` },
            { label: "Subtotal", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Setup fee", value: setupFee > 0 ? `$${setupFee} (< 50 copies)` : "Waived (50+ copies)" },
            { label: "Total", value: `$${formatNumber(totalCost + setupFee, 2)}` },
            { label: "Number of copies", value: formatNumber(copies) },
          ],
          note: "Estimates based on typical print-on-demand pricing. Bulk offset printing is cheaper at 500+ copies. Prices vary by printer.",
        };
      },
    },
    {
      id: "largeformat",
      name: "Large Format / Poster",
      description: "Estimate cost for large format prints",
      fields: [
        { name: "width", label: "Width (inches)", type: "number", placeholder: "e.g. 24" },
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 36" },
        { name: "material", label: "Print Material", type: "select", options: [
          { label: "Matte Paper ($3-5/sq ft)", value: "4" },
          { label: "Glossy Paper ($4-6/sq ft)", value: "5" },
          { label: "Canvas ($8-12/sq ft)", value: "10" },
          { label: "Vinyl Banner ($5-8/sq ft)", value: "6.5" },
          { label: "Foam Board ($8-15/sq ft)", value: "12" },
          { label: "Acrylic/Metal ($15-25/sq ft)", value: "20" },
        ], defaultValue: "5" },
        { name: "quantity", label: "Quantity", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const w = inputs.width as number;
        const h = inputs.height as number;
        const pricePerSqFt = parseFloat(inputs.material as string) || 5;
        const qty = (inputs.quantity as number) || 1;
        if (!w || !h) return null;

        const sqFt = (w * h) / 144;
        const costPerPrint = sqFt * pricePerSqFt;
        const totalCost = costPerPrint * qty;

        return {
          primary: { label: "Cost per Print", value: `$${formatNumber(costPerPrint, 2)}` },
          details: [
            { label: "Print size", value: `${w}" x ${h}"` },
            { label: "Area", value: `${formatNumber(sqFt, 2)} sq ft` },
            { label: "Price per sq ft", value: `$${formatNumber(pricePerSqFt, 2)}` },
            { label: "Cost per print", value: `$${formatNumber(costPerPrint, 2)}` },
            { label: "Quantity", value: `${qty}` },
            { label: "Total cost", value: `$${formatNumber(totalCost, 2)}` },
          ],
          note: "Prices are estimates for professional print shops. Add finishing costs (lamination, mounting, framing) separately.",
        };
      },
    },
  ],
  relatedSlugs: ["ink-coverage-calculator", "paper-weight-calculator", "binding-calculator"],
  faq: [
    { question: "How much does it cost to print a book?", answer: "A 200-page B&W softcover book costs about $3-5 per copy at print-on-demand prices. Bulk printing (500+ copies) can reduce this to $1-3. Color interiors significantly increase cost." },
    { question: "Is color printing more expensive?", answer: "Yes, color printing typically costs 3-5x more than black and white. B&W is $0.03-0.08 per page, while color ranges from $0.10-0.30 per page, depending on quality and coverage." },
    { question: "How can I reduce printing costs?", answer: "Print double-sided, reduce coverage area, use B&W instead of color where possible, order in bulk, and choose lighter paper weight. Also consider digital distribution to reduce print volume." },
  ],
  formula: "Total = Pages × Cost per Page × Copies | Book Cost = (Pages × Interior Rate) + Cover Cost | Large Format = Area (sq ft) × Price per sq ft",
};
