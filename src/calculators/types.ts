export interface CalculatorField {
  name: string;
  label: string;
  type: "number" | "select";
  placeholder?: string;
  suffix?: string;
  prefix?: string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number | string;
}

export interface CalculatorResult {
  primary: { label: string; value: string; suffix?: string };
  details?: { label: string; value: string }[];
  note?: string;
}

export interface CalculatorVariant {
  id: string;
  name: string;
  description?: string;
  fields: CalculatorField[];
  calculate: (inputs: Record<string, number | string>) => CalculatorResult | null;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface CalculatorDefinition {
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  icon: string;
  keywords: string[];
  variants: CalculatorVariant[];
  relatedSlugs: string[];
  faq: FAQ[];
  formula?: string;
}

export const CATEGORIES = [
  { name: "Math", slug: "math", icon: "+" },
  { name: "Finance", slug: "finance", icon: "$" },
  { name: "Health", slug: "health", icon: "H" },
  { name: "Everyday", slug: "everyday", icon: "~" },
  { name: "Science", slug: "science", icon: "A" },
] as const;
