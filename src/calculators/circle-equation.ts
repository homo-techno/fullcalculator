import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";
export const circleEquationCalculator: CalculatorDefinition = {
  slug: "circle-equation-calculator", title: "Circle Equation Calculator",
  description: "Free circle equation calculator. Find the standard and general form equation of a circle from center and radius.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["circle equation calculator", "equation of circle", "circle standard form", "circle general form"],
  variants: [{
    id: "fromCenterRadius", name: "From Center and Radius",
    fields: [
      { name: "h", label: "Center x (h)", type: "number", placeholder: "e.g. 3" },
      { name: "k", label: "Center y (k)", type: "number", placeholder: "e.g. -2" },
      { name: "r", label: "Radius", type: "number", placeholder: "e.g. 5" },
    ],
    calculate: (inputs) => {
      const h=inputs.h as number,k=inputs.k as number,r=inputs.r as number;
      if(h===undefined||k===undefined||!r) return null;
      const hStr=h>=0?"(x - "+formatNumber(h,6)+")":"(x + "+formatNumber(Math.abs(h),6)+")";
      const kStr=k>=0?"(y - "+formatNumber(k,6)+")":"(y + "+formatNumber(Math.abs(k),6)+")";
      const D=-2*h,E=-2*k,F=h*h+k*k-r*r;
      return {primary:{label:"Standard Form",value:hStr+"^2 + "+kStr+"^2 = "+formatNumber(r*r,6)},details:[
        {label:"General form",value:"x^2 + y^2 + "+formatNumber(D,6)+"x + "+formatNumber(E,6)+"y + "+formatNumber(F,6)+" = 0"},
        {label:"Center",value:"("+formatNumber(h,6)+", "+formatNumber(k,6)+")"},
        {label:"Radius",value:formatNumber(r,6)},
        {label:"Diameter",value:formatNumber(2*r,6)},
        {label:"Area",value:formatNumber(Math.PI*r*r,6)},
        {label:"Circumference",value:formatNumber(2*Math.PI*r,6)}]};
    },
  },{
    id: "fromGeneral", name: "From General Form Coefficients",
    fields: [
      { name: "D", label: "D (coefficient of x)", type: "number", placeholder: "e.g. -6" },
      { name: "E", label: "E (coefficient of y)", type: "number", placeholder: "e.g. 4" },
      { name: "F", label: "F (constant)", type: "number", placeholder: "e.g. -12" },
    ],
    calculate: (inputs) => {
      const D=inputs.D as number,E=inputs.E as number,F=inputs.F as number;
      if(D===undefined||E===undefined||F===undefined) return null;
      const h=-D/2,k=-E/2;
      const rSq=h*h+k*k-F;
      if(rSq<=0) return null;
      const r=Math.sqrt(rSq);
      return {primary:{label:"Center",value:"("+formatNumber(h,6)+", "+formatNumber(k,6)+")"},details:[
        {label:"Radius",value:formatNumber(r,6)},
        {label:"Radius squared",value:formatNumber(rSq,6)},
        {label:"Area",value:formatNumber(Math.PI*r*r,6)},
        {label:"Circumference",value:formatNumber(2*Math.PI*r,6)}]};
    },
  },{
    id: "fromThreePoints", name: "From Three Points",
    fields: [
      { name: "x1", label: "x1", type: "number", placeholder: "e.g. 0" },
      { name: "y1", label: "y1", type: "number", placeholder: "e.g. 0" },
      { name: "x2", label: "x2", type: "number", placeholder: "e.g. 6" },
      { name: "y2", label: "y2", type: "number", placeholder: "e.g. 0" },
      { name: "x3", label: "x3", type: "number", placeholder: "e.g. 3" },
      { name: "y3", label: "y3", type: "number", placeholder: "e.g. 4" },
    ],
    calculate: (inputs) => {
      const x1=inputs.x1 as number,y1=inputs.y1 as number,x2=inputs.x2 as number,y2=inputs.y2 as number,x3=inputs.x3 as number,y3=inputs.y3 as number;
      if(x1===undefined||y1===undefined||x2===undefined||y2===undefined||x3===undefined||y3===undefined) return null;
      const A=x1*(y2-y3)-y1*(x2-x3)+(x2*y3-x3*y2);
      if(Math.abs(A)<1e-10) return null;
      const B=((x1*x1+y1*y1)*(y3-y2)+(x2*x2+y2*y2)*(y1-y3)+(x3*x3+y3*y3)*(y2-y1))/(2*A);
      const C=((x1*x1+y1*y1)*(x2-x3)+(x2*x2+y2*y2)*(x3-x1)+(x3*x3+y3*y3)*(x1-x2))/(2*A);
      const r=Math.sqrt((x1-B)**2+(y1-C)**2);
      return {primary:{label:"Center",value:"("+formatNumber(B,6)+", "+formatNumber(C,6)+")"},details:[
        {label:"Radius",value:formatNumber(r,6)},
        {label:"Area",value:formatNumber(Math.PI*r*r,6)},
        {label:"Circumference",value:formatNumber(2*Math.PI*r,6)}]};
    },
  }],
  relatedSlugs: ["area-of-circle-calculator","circle-circumference-calculator","ellipse-equation-calculator"],
  faq: [{question:"What is the standard form of a circle equation?",answer:"(x-h)^2 + (y-k)^2 = r^2, where (h,k) is the center and r is the radius."},
    {question:"What is the general form?",answer:"x^2 + y^2 + Dx + Ey + F = 0, where h=-D/2, k=-E/2, r=sqrt(h^2+k^2-F)."}],
  formula: "(x-h)^2 + (y-k)^2 = r^2 | x^2+y^2+Dx+Ey+F=0",
};
