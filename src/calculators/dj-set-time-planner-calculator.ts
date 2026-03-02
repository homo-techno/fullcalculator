import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const djSetTimePlannerCalculator: CalculatorDefinition = {
  slug: "dj-set-time-planner-calculator",
  title: "DJ Set Time Planner Calculator",
  description: "Plan your DJ set with track counts, transitions, and energy flow based on set length and genre.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["DJ","set time","tracklist","mixing","playlist"],
  variants: [{
    id: "standard",
    name: "DJ Set Time Planner",
    description: "Plan your DJ set with track counts, transitions, and energy flow based on set length and genre.",
    fields: [
      { name: "setLength", label: "Set Length (minutes)", type: "number", min: 15, max: 480, defaultValue: 60 },
      { name: "avgTrackLength", label: "Avg Track Length (minutes)", type: "number", min: 2, max: 10, defaultValue: 4 },
      { name: "transitionLength", label: "Avg Transition (seconds)", type: "number", min: 5, max: 60, defaultValue: 16 },
      { name: "genre", label: "Genre", type: "select", options: [{ value: "1", label: "House / Techno" }, { value: "2", label: "Hip-Hop / R&B" }, { value: "3", label: "EDM / Festival" }, { value: "4", label: "Open Format" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const setLength = inputs.setLength as number;
    const avgTrackLength = inputs.avgTrackLength as number;
    const transitionLength = inputs.transitionLength as number;
    const genre = inputs.genre as number;
    const transitionMin = transitionLength / 60;
    const effectiveTrackTime = avgTrackLength - transitionMin;
    const totalTracks = Math.ceil(setLength / effectiveTrackTime);
    const prepTracks = Math.ceil(totalTracks * 1.5);
    const totalTransitions = totalTracks - 1;
    const genreLabels = ["", "House / Techno", "Hip-Hop / R&B", "EDM / Festival", "Open Format"];
    const bpmRanges = ["", "120-135 BPM", "85-115 BPM", "125-150 BPM", "80-140 BPM"];
    return {
      primary: { label: "Tracks Needed", value: formatNumber(totalTracks) },
      details: [
        { label: "Prepare at Least", value: formatNumber(prepTracks) + " tracks" },
        { label: "Total Transitions", value: formatNumber(totalTransitions) },
        { label: "Genre", value: genreLabels[genre] },
        { label: "Typical BPM Range", value: bpmRanges[genre] }
      ]
    };
  },
  }],
  relatedSlugs: ["bpm-tempo-calculator","concert-ticket-value-calculator","music-streaming-revenue-calculator"],
  faq: [
    { question: "How many songs do I need for a 1-hour DJ set?", answer: "For a typical 1-hour set, plan for 15-20 tracks depending on track length and how long you mix transitions." },
    { question: "How long should DJ transitions be?", answer: "Transitions vary by genre: house music uses 16-32 beat mixes while hip-hop may use quick 4-8 beat cuts." },
    { question: "Should I prepare extra tracks?", answer: "Always prepare 1.5 to 2 times the tracks you plan to play to allow flexibility and read the crowd." },
  ],
  formula: "Tracks = Set Length / (Avg Track Length - Transition Length)
Prep Tracks = Tracks x 1.5",
};
