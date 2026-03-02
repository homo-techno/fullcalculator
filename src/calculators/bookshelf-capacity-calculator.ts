import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bookshelfCapacityCalculator: CalculatorDefinition = {
  slug: "bookshelf-capacity-calculator",
  title: "Bookshelf Capacity Calculator",
  description: "Estimate the number of books a bookshelf can hold.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bookshelf","books","capacity","storage"],
  variants: [{
    id: "standard",
    name: "Bookshelf Capacity",
    description: "Estimate the number of books a bookshelf can hold.",
    fields: [
      { name: "shelfWidth", label: "Shelf Width (inches)", type: "number", min: 12, max: 96, defaultValue: 36 },
      { name: "shelves", label: "Number of Shelves", type: "number", min: 1, max: 12, defaultValue: 5 },
      { name: "bookThickness", label: "Avg Book Thickness (inches)", type: "number", min: 0.5, max: 3, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const shelfWidth = inputs.shelfWidth as number;
    const shelves = inputs.shelves as number;
    const bookThickness = inputs.bookThickness as number;
    const booksPerShelf = Math.floor(shelfWidth / bookThickness);
    const totalBooks = booksPerShelf * shelves;
    return {
      primary: { label: "Total Book Capacity", value: formatNumber(totalBooks) + " books" },
      details: [
        { label: "Books per Shelf", value: formatNumber(booksPerShelf) },
        { label: "Number of Shelves", value: formatNumber(shelves) }
      ]
    };
  },
  }],
  relatedSlugs: ["closet-organizer-calculator","wine-cellar-capacity-calculator"],
  faq: [
    { question: "How many books fit on a 36 inch shelf?", answer: "About 25 to 36 average sized books fit on a 36 inch shelf." },
    { question: "What is a standard bookshelf width?", answer: "Standard bookshelves are 24 to 36 inches wide." },
  ],
  formula: "Books per Shelf = Shelf Width / Avg Book Thickness; Total = Books per Shelf x Shelves",
};
