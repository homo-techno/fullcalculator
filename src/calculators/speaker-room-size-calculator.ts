import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const speakerRoomSizeCalculator: CalculatorDefinition = {
  slug: "speaker-room-size-calculator",
  title: "Speaker Room Size Calculator",
  description: "Determine the ideal speaker placement and count for optimal room coverage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["speaker placement","room size","audio","surround sound","home theater"],
  variants: [{
    id: "standard",
    name: "Speaker Room Size",
    description: "Determine the ideal speaker placement and count for optimal room coverage.",
    fields: [
      { name: "roomLength", label: "Room Length (ft)", type: "number", min: 5, max: 100, defaultValue: 20 },
      { name: "roomWidth", label: "Room Width (ft)", type: "number", min: 5, max: 100, defaultValue: 15 },
      { name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", min: 7, max: 20, defaultValue: 9 },
      { name: "purpose", label: "Purpose", type: "select", options: [{ value: "1", label: "Stereo Music" }, { value: "2", label: "Home Theater 5.1" }, { value: "3", label: "Home Theater 7.1" }, { value: "4", label: "Whole Room Background" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const length = inputs.roomLength as number;
    const width = inputs.roomWidth as number;
    const ceilingHeight = inputs.ceilingHeight as number;
    const purpose = inputs.purpose as number;
    const area = length * width;
    const volume = area * ceilingHeight;
    const speakerCounts = { 1: 2, 2: 6, 3: 8, 4: Math.ceil(area / 150) * 2 };
    const speakers = speakerCounts[purpose];
    const idealDistance = length * 0.38;
    const listenerDistance = length * 0.62;
    const purposeLabels = { 1: "Stereo Music", 2: "Home Theater 5.1", 3: "Home Theater 7.1", 4: "Whole Room Background" };
    const minWatts = Math.ceil(area * 0.5);
    return {
      primary: { label: "Recommended Speakers", value: formatNumber(speakers) },
      details: [
        { label: "Room Volume", value: formatNumber(volume) + " cu ft" },
        { label: "Room Area", value: formatNumber(area) + " sq ft" },
        { label: "Speaker Distance from Wall", value: formatNumber(idealDistance) + " ft" },
        { label: "Min Power Per Speaker", value: formatNumber(minWatts) + " W" },
        { label: "Setup Type", value: purposeLabels[purpose] }
      ]
    };
  },
  }],
  relatedSlugs: ["speaker-wattage-calculator","subwoofer-box-volume-calculator","soundproofing-cost-calculator"],
  faq: [
    { question: "How far should speakers be from the wall?", answer: "Speakers should generally be at least 2-3 feet from walls and about 38% of the room length from the front wall." },
    { question: "What is the ideal room size for a home theater?", answer: "A room of 200-400 square feet with 9-10 foot ceilings provides excellent home theater acoustics." },
    { question: "Do I need a subwoofer for a small room?", answer: "Even in small rooms, a subwoofer handles low frequencies that regular speakers cannot reproduce effectively." },
  ],
  formula: "Speaker Distance = Room Length x 0.38; Listener Position = Room Length x 0.62",
};
