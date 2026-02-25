import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";
export const equationOfLineCalculator: CalculatorDefinition = {
  slug: "equation-of-line-calculator", title: "Equation of a Line Calculator",
  description: "Free equation of a line calculator. Find slope-intercept and point-slope form equations.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["equation of line", "line equation", "slope intercept form", "point slope form"],
  variants: [{
    id: "fromTwoPoints", name: "From Two Points",
    fields: [
      { name: "x1", label: "x1", type: "number", placeholder: "e.g. 1" },
      { name: "y1", label: "y1", type: "number", placeholder: "e.g. 2" },
      { name: "x2", label: "x2", type: "number", placeholder: "e.g. 4" },
      { name: "y2", label: "y2", type: "number", placeholder: "e.g. 8" },
    ],
    calculate: (inputs) => {
      const x1=inputs.x1 as number,y1=inputs.y1 as number,x2=inputs.x2 as number,y2=inputs.y2 as number;
      if(x1===undefined||y1===undefined||x2===undefined||y2===undefined) return null;
      if(x1===x2) return {primary:{label:"Equation",value:"x = "+formatNumber(x1,6)},details:[{label:"Type",value:"Vertical line"}]};
      const m=(y2-y1)/(x2-x1),b=y1-m*x1;
      const bs=b>=0?" + "+formatNumber(b,6):" - "+formatNumber(Math.abs(b),6);
      return {primary:{label:"Slope-Intercept",value:"y = "+formatNumber(m,6)+"x"+bs},details:[
        {label:"Slope",value:formatNumber(m,6)},{label:"Y-intercept",value:formatNumber(b,6)},
        {label:"X-intercept",value:m!==0?formatNumber(-b/m,6):"None"},
        {label:"Distance",value:formatNumber(Math.sqrt((x2-x1)**2+(y2-y1)**2),6)}]};
    },
  },{
    id: "fromPointSlope", name: "From Point and Slope",
    fields: [
      { name: "x1", label: "x", type: "number", placeholder: "e.g. 2" },
      { name: "y1", label: "y", type: "number", placeholder: "e.g. 3" },
      { name: "m", label: "Slope", type: "number", placeholder: "e.g. 1.5" },
    ],
    calculate: (inputs) => {
      const x1=inputs.x1 as number,y1=inputs.y1 as number,m=inputs.m as number;
      if(x1===undefined||y1===undefined||m===undefined) return null;
      const b=y1-m*x1;
      const bs=b>=0?" + "+formatNumber(b,6):" - "+formatNumber(Math.abs(b),6);
      return {primary:{label:"Slope-Intercept",value:"y = "+formatNumber(m,6)+"x"+bs},details:[
        {label:"Y-intercept",value:formatNumber(b,6)},
        {label:"Perpendicular slope",value:m!==0?formatNumber(-1/m,6):"Undefined"},
        {label:"Angle with x-axis",value:formatNumber(Math.atan(m)*180/Math.PI,6)+"\u00b0"}]};
    },
  },{
    id: "fromSlopeIntercept", name: "From Slope and Y-Intercept",
    fields: [
      { name: "m", label: "Slope", type: "number", placeholder: "e.g. 2" },
      { name: "b", label: "Y-Intercept", type: "number", placeholder: "e.g. -3" },
    ],
    calculate: (inputs) => {
      const m=inputs.m as number,b=inputs.b as number;
      if(m===undefined||b===undefined) return null;
      const bs=b>=0?" + "+formatNumber(b,6):" - "+formatNumber(Math.abs(b),6);
      return {primary:{label:"Equation",value:"y = "+formatNumber(m,6)+"x"+bs},details:[
        {label:"X-intercept",value:m!==0?formatNumber(-b/m,6):"None"},
        {label:"Perpendicular slope",value:m!==0?formatNumber(-1/m,6):"Undefined"}]};
    },
  }],
  relatedSlugs: ["slope-calculator","distance-formula-calculator","midpoint-calculator"],
  faq: [{question:"What are linear equation forms?",answer:"Slope-intercept: y=mx+b. Point-slope: y-y1=m(x-x1). Standard: Ax+By+C=0."},
    {question:"How to find equation from two points?",answer:"Find slope m=(y2-y1)/(x2-x1), then use point-slope form."}],
  formula: "y = mx + b | m = (y2-y1)/(x2-x1)",
};
