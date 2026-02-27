import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const keyTranspositionCalculator: CalculatorDefinition = {
  slug: "key-transposition-calculator",
  title: "Key Transposition Calculator",
  description: "Free key transposition calculator. Transpose music between keys",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["key transposition calculator", "music calculator", "audio tool"],
  variants: [{
    id: "standard",
    name: "Key Transposition",
    description: "Transpose music between keys",
    fields: [
      { name: "fromKey", label: "Original Key", type: "select", defaultValue: "0", options: [{label:"C",value:"0"},{label:"C#/Db",value:"1"},{label:"D",value:"2"},{label:"D#/Eb",value:"3"},{label:"E",value:"4"},{label:"F",value:"5"},{label:"F#/Gb",value:"6"},{label:"G",value:"7"},{label:"G#/Ab",value:"8"},{label:"A",value:"9"},{label:"A#/Bb",value:"10"},{label:"B",value:"11"}] },
      { name: "toKey", label: "Target Key", type: "select", defaultValue: "7", options: [{label:"C",value:"0"},{label:"C#/Db",value:"1"},{label:"D",value:"2"},{label:"D#/Eb",value:"3"},{label:"E",value:"4"},{label:"F",value:"5"},{label:"F#/Gb",value:"6"},{label:"G",value:"7"},{label:"G#/Ab",value:"8"},{label:"A",value:"9"},{label:"A#/Bb",value:"10"},{label:"B",value:"11"}] },
    ],
    calculate: (inputs)=>{const from=parseInt(inputs.fromKey as string);const to=parseInt(inputs.toKey as string);const keys=["C","C#/Db","D","D#/Eb","E","F","F#/Gb","G","G#/Ab","A","A#/Bb","B"];const semitones=((to-from)+12)%12;const notes=keys.map((_,i)=>keys[(i+semitones)%12]);return{primary:{label:"Transposition",value:keys[from]+" → "+keys[to]},details:[{label:"Semitones up",value:String(semitones)},{label:"Semitones down",value:String(12-semitones)},{label:"Interval",value:["Unison","m2","M2","m3","M3","P4","Tritone","P5","m6","M6","m7","M7"][semitones]}]};},
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How do I use this for music production?", answer: "Enter your tempo (BPM) and the calculator provides timing values useful for setting delays, reverbs, and other time-based effects." },
    { question: "What is BPM?", answer: "BPM (Beats Per Minute) measures the tempo of music. Common tempos: 60-80 (slow), 100-120 (moderate), 140+ (fast)." },
  ],
  formula: "Beat Duration = 60000 / BPM (ms)",
};
