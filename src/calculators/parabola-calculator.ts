import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";
export const parabolaCalculator: CalculatorDefinition = {
  slug: "parabola-calculator", title: "Parabola Calculator",
  description: "Free parabola calculator. Find vertex, focus, directrix, and axis of symmetry from the equation of a parabola.",
  category: "Math", categorySlug: "math", icon: "+",
  keywords: ["parabola calculator", "parabola equation", "vertex focus directrix", "parabola graph", "quadratic parabola"],
  variants: [{
    id: "fromVertexForm", name: "Vertex Form: y = a(x-h)^2 + k",
    fields: [
      { name: "a", label: "a (coefficient)", type: "number", placeholder: "e.g. 1" },
      { name: "h", label: "h (vertex x)", type: "number", placeholder: "e.g. 2" },
      { name: "k", label: "k (vertex y)", type: "number", placeholder: "e.g. -3" },
    ],
    calculate: (inputs) => {
      const a=inputs.a as number,h=inputs.h as number,k=inputs.k as number;
      if(!a||h===undefined||k===undefined) return null;
      const focusY=k+1/(4*a);
      const directrixY=k-1/(4*a);
      const focalLength=Math.abs(1/(4*a));
      const opens=a>0?"upward":"downward";
      const latusRectum=Math.abs(1/a);
      return {primary:{label:"Vertex",value:"("+formatNumber(h,6)+", "+formatNumber(k,6)+")"},details:[
        {label:"Focus",value:"("+formatNumber(h,6)+", "+formatNumber(focusY,6)+")"},
        {label:"Directrix",value:"y = "+formatNumber(directrixY,6)},
        {label:"Axis of symmetry",value:"x = "+formatNumber(h,6)},
        {label:"Opens",value:opens},
        {label:"Focal length",value:formatNumber(focalLength,6)},
        {label:"Latus rectum",value:formatNumber(latusRectum,6)},
        {label:"Y-intercept",value:formatNumber(a*h*h+k,6)}]};
    },
  },{
    id: "fromStandard", name: "Standard Form: y = ax^2 + bx + c",
    fields: [
      { name: "a", label: "a", type: "number", placeholder: "e.g. 1" },
      { name: "b", label: "b", type: "number", placeholder: "e.g. -4" },
      { name: "c", label: "c", type: "number", placeholder: "e.g. 1" },
    ],
    calculate: (inputs) => {
      const a=inputs.a as number,b=inputs.b as number,c=inputs.c as number;
      if(!a||b===undefined||c===undefined) return null;
      const h=-b/(2*a),k=a*h*h+b*h+c;
      const focusY=k+1/(4*a);
      const directrixY=k-1/(4*a);
      const disc=b*b-4*a*c;
      const xInts=disc>=0?"x = "+formatNumber((-b+Math.sqrt(disc))/(2*a),6)+", "+formatNumber((-b-Math.sqrt(disc))/(2*a),6):"None (no real roots)";
      return {primary:{label:"Vertex",value:"("+formatNumber(h,6)+", "+formatNumber(k,6)+")"},details:[
        {label:"Focus",value:"("+formatNumber(h,6)+", "+formatNumber(focusY,6)+")"},
        {label:"Directrix",value:"y = "+formatNumber(directrixY,6)},
        {label:"Axis of symmetry",value:"x = "+formatNumber(h,6)},
        {label:"Y-intercept",value:formatNumber(c,6)},
        {label:"X-intercepts",value:xInts},
        {label:"Opens",value:a>0?"upward":"downward"},
        {label:"Discriminant",value:formatNumber(disc,6)}]};
    },
  },{
    id: "fromVertexPoint", name: "From Vertex and a Point",
    fields: [
      { name: "h", label: "Vertex x (h)", type: "number", placeholder: "e.g. 2" },
      { name: "k", label: "Vertex y (k)", type: "number", placeholder: "e.g. -3" },
      { name: "px", label: "Point x", type: "number", placeholder: "e.g. 4" },
      { name: "py", label: "Point y", type: "number", placeholder: "e.g. 1" },
    ],
    calculate: (inputs) => {
      const h=inputs.h as number,k=inputs.k as number,px=inputs.px as number,py=inputs.py as number;
      if(h===undefined||k===undefined||px===undefined||py===undefined) return null;
      if(px===h) return null;
      const a=(py-k)/((px-h)*(px-h));
      const focusY=k+1/(4*a);
      return {primary:{label:"Equation",value:"y = "+formatNumber(a,6)+"(x - "+formatNumber(h,6)+")^2 + "+formatNumber(k,6)},details:[
        {label:"a coefficient",value:formatNumber(a,6)},
        {label:"Vertex",value:"("+formatNumber(h,6)+", "+formatNumber(k,6)+")"},
        {label:"Focus",value:"("+formatNumber(h,6)+", "+formatNumber(focusY,6)+")"},
        {label:"Opens",value:a>0?"upward":"downward"}]};
    },
  }],
  relatedSlugs: ["quadratic-calculator","hyperbola-calculator","ellipse-equation-calculator"],
  faq: [{question:"What is vertex form of a parabola?",answer:"y = a(x-h)^2 + k where (h,k) is the vertex. a determines width and direction."},
    {question:"How do you find the focus?",answer:"For y=a(x-h)^2+k, focus is at (h, k+1/(4a)). The directrix is y=k-1/(4a)."}],
  formula: "y = a(x-h)^2 + k | Focus: (h, k+1/(4a)) | Directrix: y = k-1/(4a)",
};
