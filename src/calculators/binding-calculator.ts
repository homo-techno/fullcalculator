import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bindingCalculator: CalculatorDefinition = {
  slug: "binding-calculator",
  title: "Book Binding Calculator",
  description: "Free book binding calculator. Calculate spine width, page count, paper needs, and binding specifications for book and booklet projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["book binding calculator", "spine width calculator", "book thickness calculator", "page count calculator", "booklet calculator"],
  variants: [
    {
      id: "spine",
      name: "Spine Width Calculator",
      description: "Calculate book spine width from page count and paper weight",
      fields: [
        { name: "pageCount", label: "Interior Page Count", type: "number", placeholder: "e.g. 200" },
        { name: "paperType", label: "Paper Type", type: "select", options: [
          { label: "50 GSM (thin, Bible paper)", value: "0.06" },
          { label: "60 GSM (lightweight)", value: "0.08" },
          { label: "75-80 GSM (standard copy)", value: "0.10" },
          { label: "90 GSM (premium uncoated)", value: "0.12" },
          { label: "100 GSM (book paper)", value: "0.13" },
          { label: "120 GSM (thick uncoated)", value: "0.15" },
          { label: "80 GSM coated/glossy", value: "0.07" },
          { label: "115 GSM coated/glossy", value: "0.09" },
          { label: "150 GSM coated/glossy", value: "0.12" },
        ], defaultValue: "0.10" },
        { name: "coverType", label: "Cover Type", type: "select", options: [
          { label: "Softcover (0.5mm cover)", value: "0.5" },
          { label: "Laminated softcover (0.6mm)", value: "0.6" },
          { label: "Hardcover (3mm boards)", value: "3.0" },
          { label: "Hardcover (2mm boards)", value: "2.0" },
        ], defaultValue: "0.5" },
      ],
      calculate: (inputs) => {
        const pages = inputs.pageCount as number;
        const sheetThickness = parseFloat(inputs.paperType as string) || 0.10;
        const coverThickness = parseFloat(inputs.coverType as string) || 0.5;
        if (!pages) return null;

        const sheets = pages / 2;
        const blockThickness = sheets * sheetThickness;
        const spineWidth = blockThickness;
        const totalThickness = blockThickness + coverThickness * 2;

        return {
          primary: { label: "Spine Width", value: `${formatNumber(spineWidth, 1)} mm (${formatNumber(spineWidth / 25.4, 2)}")` },
          details: [
            { label: "Interior pages", value: `${pages} pages (${sheets} sheets)` },
            { label: "Text block thickness", value: `${formatNumber(blockThickness, 1)} mm` },
            { label: "Spine width", value: `${formatNumber(spineWidth, 1)} mm (${formatNumber(spineWidth / 25.4, 3)}")` },
            { label: "Total book thickness", value: `${formatNumber(totalThickness, 1)} mm (${formatNumber(totalThickness / 25.4, 2)}")` },
            { label: "Sheet thickness", value: `${sheetThickness} mm each` },
            { label: "Cover thickness", value: `${coverThickness} mm each side` },
          ],
          note: "Spine width is critical for cover design. Allow 1-2mm tolerance. Pages must be in multiples of 2. Some bindings require multiples of 4, 8, or 16.",
        };
      },
    },
    {
      id: "signatures",
      name: "Signature Calculator",
      description: "Calculate signatures for perfect binding or case binding",
      fields: [
        { name: "pageCount", label: "Total Interior Pages", type: "number", placeholder: "e.g. 256" },
        { name: "signatureSize", label: "Pages per Signature", type: "select", options: [
          { label: "4 pages (single fold)", value: "4" },
          { label: "8 pages (quarto)", value: "8" },
          { label: "16 pages (octavo - standard)", value: "16" },
          { label: "32 pages (sexto-decimo)", value: "32" },
        ], defaultValue: "16" },
      ],
      calculate: (inputs) => {
        const totalPages = inputs.pageCount as number;
        const sigPages = parseInt(inputs.signatureSize as string) || 16;
        if (!totalPages) return null;

        const fullSignatures = Math.floor(totalPages / sigPages);
        const remainingPages = totalPages % sigPages;
        const adjustedTotal = remainingPages > 0 ? (fullSignatures + 1) * sigPages : totalPages;
        const blankPages = adjustedTotal - totalPages;
        const totalSheets = adjustedTotal / 2;

        return {
          primary: { label: "Signatures Needed", value: `${fullSignatures + (remainingPages > 0 ? 1 : 0)}` },
          details: [
            { label: "Full signatures", value: `${fullSignatures} × ${sigPages} pages` },
            { label: "Remaining pages", value: remainingPages > 0 ? `${remainingPages} pages` : "None" },
            { label: "Blank pages to add", value: blankPages > 0 ? `${blankPages} pages` : "None needed" },
            { label: "Adjusted page count", value: `${adjustedTotal} pages` },
            { label: "Total sheets", value: formatNumber(totalSheets) },
            { label: "Pages per signature", value: `${sigPages}` },
          ],
          note: remainingPages > 0
            ? `Your page count needs ${blankPages} blank pages added to fill the last signature. Consider adjusting content to fill ${adjustedTotal} pages.`
            : "Page count divides evenly into signatures. No blank pages needed.",
        };
      },
    },
    {
      id: "booklet",
      name: "Saddle-Stitch Booklet",
      description: "Calculate sheets needed for stapled booklets",
      fields: [
        { name: "pageCount", label: "Total Pages (including covers)", type: "number", placeholder: "e.g. 24" },
        { name: "copies", label: "Number of Copies", type: "number", placeholder: "e.g. 100", defaultValue: 1 },
        { name: "paperSize", label: "Paper Size (flat sheet)", type: "select", options: [
          { label: "Letter (8.5x11) -> 5.5x8.5 booklet", value: "letter" },
          { label: "Tabloid (11x17) -> 8.5x11 booklet", value: "tabloid" },
          { label: "A4 -> A5 booklet", value: "a4" },
          { label: "A3 -> A4 booklet", value: "a3" },
        ], defaultValue: "tabloid" },
      ],
      calculate: (inputs) => {
        const pages = inputs.pageCount as number;
        const copies = (inputs.copies as number) || 1;
        const paper = inputs.paperSize as string;
        if (!pages) return null;

        const adjustedPages = Math.ceil(pages / 4) * 4;
        const blankPages = adjustedPages - pages;
        const sheetsPerBooklet = adjustedPages / 4;
        const totalSheets = sheetsPerBooklet * copies;

        const sizeMap: Record<string, string> = {
          letter: "5.5\" x 8.5\"",
          tabloid: "8.5\" x 11\"",
          a4: "148 x 210 mm (A5)",
          a3: "210 x 297 mm (A4)",
        };

        return {
          primary: { label: "Sheets per Booklet", value: `${sheetsPerBooklet}` },
          details: [
            { label: "Requested pages", value: `${pages}` },
            { label: "Adjusted to", value: `${adjustedPages} pages (multiple of 4)` },
            { label: "Blank pages added", value: `${blankPages}` },
            { label: "Sheets per booklet", value: `${sheetsPerBooklet}` },
            { label: "Total sheets needed", value: formatNumber(totalSheets) },
            { label: "Finished booklet size", value: sizeMap[paper] || "Custom" },
            { label: "Copies", value: formatNumber(copies) },
            { label: "Max stapled pages", value: "Typically 48-64 pages max" },
          ],
          note: "Saddle-stitch booklets require page counts in multiples of 4. Maximum recommended is 48-64 pages (12-16 sheets) for staple binding.",
        };
      },
    },
  ],
  relatedSlugs: ["printing-cost-calculator", "paper-weight-calculator", "ink-coverage-calculator"],
  faq: [
    { question: "How do I calculate spine width?", answer: "Spine width = number of sheets (pages/2) multiplied by paper thickness per sheet. Standard 80 GSM paper is about 0.10mm thick. A 200-page book on standard paper has a spine of about 10mm." },
    { question: "What is a signature in book binding?", answer: "A signature is a group of pages printed on a single large sheet that is then folded. Standard signatures are 16 pages (one sheet folded 3 times). Page counts must be multiples of the signature size." },
    { question: "What is saddle-stitch binding?", answer: "Saddle-stitch is staple binding where folded sheets are nested and stapled through the spine. It works best for booklets up to about 64 pages. Page count must be a multiple of 4." },
  ],
  formula: "Spine Width = (Pages / 2) × Sheet Thickness | Signatures = Pages / Pages per Signature | Saddle-stitch Sheets = Pages / 4",
};
