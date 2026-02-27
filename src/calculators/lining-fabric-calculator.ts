import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const liningFabricCalculator: CalculatorDefinition = {
  slug: "lining-fabric-calculator",
  title: "Lining Fabric Calculator",
  description: "Free lining fabric calculator. Sewing and crafting material calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["lining fabric calculator", "sewing calculator", "craft tool"],
  variants: [{
    id: "standard",
    name: "Lining Fabric",
    description: "Sewing/craft calculation",
    fields: [
      { name: "length", label: "Project Length", type: "number", placeholder: "e.g. 60", suffix: "inches", min: 0.1 },
      { name: "width", label: "Project Width", type: "number", placeholder: "e.g. 45", suffix: "inches", min: 0.1 },
      { name: "seam", label: "Seam Allowance", type: "number", placeholder: "e.g. 0.625", suffix: "inches", min: 0.25, max: 2, step: 0.125, defaultValue: 0.625 },
    ],
    calculate: (inputs)=>{const l=inputs.length as number;const w=inputs.width as number;const s=inputs.seam as number||0.625;if(!l||!w)return null;const cutL=l+s*2;const cutW=w+s*2;const sqIn=cutL*cutW;const yards=sqIn/(36*45);return{primary:{label:"Fabric Needed",value:formatNumber(yards)+" yards"},details:[{label:"Cut size",value:formatNumber(cutL)+"x"+formatNumber(cutW)+" in"},{label:"Square inches",value:formatNumber(sqIn)},{label:"With 10% waste",value:formatNumber(yards*1.1)+" yards"}]};},
  }],
  relatedSlugs: ["fabric-yardage-calculator"],
  faq: [
    { question: "How much extra fabric should I buy?", answer: "Add 10-15% extra for pattern matching, mistakes, and shrinkage. More for directional fabrics." },
    { question: "What seam allowance should I use?", answer: "Standard seam allowance is 5/8 inch (1.5cm) for garments, 1/4 inch for quilting." },
  ],
  formula: "Fabric = (Length + Seam x 2) x (Width + Seam x 2)",
};
