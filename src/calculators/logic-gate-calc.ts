import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const logicGateCalculator: CalculatorDefinition = {
  slug: "logic-gate-calculator",
  title: "Logic Gate Calculator",
  description: "Free logic gate truth table calculator. Compute outputs for AND, OR, XOR, NAND, NOR, and XNOR gates with binary inputs.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["logic gate calculator", "truth table", "boolean logic", "AND gate", "OR gate", "XOR gate", "NAND gate", "NOR gate"],
  variants: [
    {
      id: "two-input",
      name: "Two-Input Gate",
      description: "Calculate the output of a logic gate with two binary inputs",
      fields: [
        {
          name: "gate",
          label: "Gate Type",
          type: "select",
          options: [
            { label: "AND", value: "AND" },
            { label: "OR", value: "OR" },
            { label: "XOR", value: "XOR" },
            { label: "NAND", value: "NAND" },
            { label: "NOR", value: "NOR" },
            { label: "XNOR", value: "XNOR" },
          ],
          defaultValue: "AND",
        },
        {
          name: "inputA",
          label: "Input A",
          type: "select",
          options: [
            { label: "0 (False)", value: "0" },
            { label: "1 (True)", value: "1" },
          ],
          defaultValue: "0",
        },
        {
          name: "inputB",
          label: "Input B",
          type: "select",
          options: [
            { label: "0 (False)", value: "0" },
            { label: "1 (True)", value: "1" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const gate = (inputs.gate as string) || "AND";
        const a = parseFloat(inputs.inputA as string);
        const b = parseFloat(inputs.inputB as string);
        if (isNaN(a) || isNaN(b)) return null;
        const bA = a === 1;
        const bB = b === 1;

        let result: boolean;
        let expression: string;
        switch (gate) {
          case "AND": result = bA && bB; expression = `${a} AND ${b}`; break;
          case "OR": result = bA || bB; expression = `${a} OR ${b}`; break;
          case "XOR": result = bA !== bB; expression = `${a} XOR ${b}`; break;
          case "NAND": result = !(bA && bB); expression = `${a} NAND ${b}`; break;
          case "NOR": result = !(bA || bB); expression = `${a} NOR ${b}`; break;
          case "XNOR": result = bA === bB; expression = `${a} XNOR ${b}`; break;
          default: result = false; expression = "";
        }

        // Generate full truth table for this gate
        const truthTable: string[] = [];
        for (const ia of [0, 1]) {
          for (const ib of [0, 1]) {
            const ba = ia === 1;
            const bb = ib === 1;
            let r: boolean;
            switch (gate) {
              case "AND": r = ba && bb; break;
              case "OR": r = ba || bb; break;
              case "XOR": r = ba !== bb; break;
              case "NAND": r = !(ba && bb); break;
              case "NOR": r = !(ba || bb); break;
              case "XNOR": r = ba === bb; break;
              default: r = false;
            }
            truthTable.push(`(${ia}, ${ib}) → ${r ? 1 : 0}`);
          }
        }

        return {
          primary: { label: `${gate} Output`, value: result ? "1 (True)" : "0 (False)" },
          details: [
            { label: "Expression", value: expression },
            { label: "Input A", value: formatNumber(a, 0) },
            { label: "Input B", value: formatNumber(b, 0) },
            { label: "Truth Table (0,0)", value: truthTable[0] },
            { label: "Truth Table (0,1)", value: truthTable[1] },
            { label: "Truth Table (1,0)", value: truthTable[2] },
            { label: "Truth Table (1,1)", value: truthTable[3] },
          ],
        };
      },
    },
    {
      id: "not-gate",
      name: "NOT Gate (Inverter)",
      description: "Calculate the output of a NOT gate (single input inverter)",
      fields: [
        {
          name: "inputA",
          label: "Input",
          type: "select",
          options: [
            { label: "0 (False)", value: "0" },
            { label: "1 (True)", value: "1" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const a = parseFloat(inputs.inputA as string);
        if (isNaN(a)) return null;
        const result = a === 0 ? 1 : 0;
        return {
          primary: { label: "NOT Output", value: result === 1 ? "1 (True)" : "0 (False)" },
          details: [
            { label: "Input", value: formatNumber(a, 0) },
            { label: "Output", value: formatNumber(result, 0) },
            { label: "Truth Table: NOT 0", value: "1" },
            { label: "Truth Table: NOT 1", value: "0" },
          ],
        };
      },
    },
    {
      id: "three-input",
      name: "Three-Input Gate",
      description: "Calculate output of a gate with three binary inputs",
      fields: [
        {
          name: "gate",
          label: "Gate Type",
          type: "select",
          options: [
            { label: "AND", value: "AND" },
            { label: "OR", value: "OR" },
            { label: "XOR (Odd parity)", value: "XOR" },
            { label: "NAND", value: "NAND" },
            { label: "NOR", value: "NOR" },
          ],
          defaultValue: "AND",
        },
        {
          name: "inputA",
          label: "Input A",
          type: "select",
          options: [
            { label: "0 (False)", value: "0" },
            { label: "1 (True)", value: "1" },
          ],
          defaultValue: "0",
        },
        {
          name: "inputB",
          label: "Input B",
          type: "select",
          options: [
            { label: "0 (False)", value: "0" },
            { label: "1 (True)", value: "1" },
          ],
          defaultValue: "0",
        },
        {
          name: "inputC",
          label: "Input C",
          type: "select",
          options: [
            { label: "0 (False)", value: "0" },
            { label: "1 (True)", value: "1" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const gate = (inputs.gate as string) || "AND";
        const a = parseFloat(inputs.inputA as string);
        const b = parseFloat(inputs.inputB as string);
        const c = parseFloat(inputs.inputC as string);
        if (isNaN(a) || isNaN(b) || isNaN(c)) return null;

        const bA = a === 1, bB = b === 1, bC = c === 1;
        let result: boolean;
        switch (gate) {
          case "AND": result = bA && bB && bC; break;
          case "OR": result = bA || bB || bC; break;
          case "XOR": result = (bA !== bB) !== bC; break;
          case "NAND": result = !(bA && bB && bC); break;
          case "NOR": result = !(bA || bB || bC); break;
          default: result = false;
        }

        const onesCount = [a, b, c].filter(v => v === 1).length;

        return {
          primary: { label: `${gate} Output`, value: result ? "1 (True)" : "0 (False)" },
          details: [
            { label: "Inputs (A, B, C)", value: `(${formatNumber(a, 0)}, ${formatNumber(b, 0)}, ${formatNumber(c, 0)})` },
            { label: "Number of 1s", value: formatNumber(onesCount, 0) },
            { label: "Gate", value: gate },
            { label: "Result (binary)", value: formatNumber(result ? 1 : 0, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["binary-hex-converter", "probability-calculator", "scientific-calculator"],
  faq: [
    { question: "What are logic gates?", answer: "Logic gates are the fundamental building blocks of digital circuits. They perform basic logical operations (AND, OR, NOT, etc.) on binary inputs (0 and 1) to produce a binary output. All digital devices from calculators to computers are built from combinations of logic gates." },
    { question: "What is the difference between XOR and XNOR?", answer: "XOR (Exclusive OR) outputs 1 when the inputs are different. XNOR (Exclusive NOR) outputs 1 when the inputs are the same. XNOR is the inverse of XOR. For two inputs: XOR gives 1 for (0,1) and (1,0), while XNOR gives 1 for (0,0) and (1,1)." },
    { question: "What are NAND and NOR gates used for?", answer: "NAND and NOR are 'universal gates' because any other logic gate can be built using only NAND gates or only NOR gates. This makes them fundamental in digital circuit design and manufacturing." },
  ],
  formula: "AND: A·B | OR: A+B | XOR: A⊕B | NAND: ¬(A·B) | NOR: ¬(A+B) | NOT: ¬A",
};
