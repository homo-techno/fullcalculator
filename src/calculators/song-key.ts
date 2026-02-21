import type { CalculatorDefinition } from "./types";

const NOTES = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
const NOTE_VALUES: Record<string, number> = {};
NOTES.forEach((n, i) => { NOTE_VALUES[n] = i; });

const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

function getScale(rootIndex: number, intervals: number[]): string[] {
  return intervals.map((i) => NOTES[(rootIndex + i) % 12]);
}

function matchScore(inputNotes: number[], scaleNotes: number[]): number {
  let matches = 0;
  for (const n of inputNotes) {
    if (scaleNotes.includes(n)) matches++;
  }
  return matches;
}

export const songKeyCalculator: CalculatorDefinition = {
  slug: "song-key-calculator",
  title: "Song Key Calculator",
  description:
    "Free song key finder. Enter the chords or notes from a song to determine its most likely musical key.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "song key finder",
    "what key is this song in",
    "key finder",
    "find key of song",
    "music key detector",
    "key signature",
  ],
  variants: [
    {
      id: "from-notes",
      name: "Key from Notes Used",
      description: "Enter up to 7 notes used in the song to find the most likely key",
      fields: [
        { name: "note1", label: "Note 1", type: "select", options: [{ label: "(none)", value: "" }, ...NOTES.map((n) => ({ label: n, value: n }))], defaultValue: "C" },
        { name: "note2", label: "Note 2", type: "select", options: [{ label: "(none)", value: "" }, ...NOTES.map((n) => ({ label: n, value: n }))], defaultValue: "D" },
        { name: "note3", label: "Note 3", type: "select", options: [{ label: "(none)", value: "" }, ...NOTES.map((n) => ({ label: n, value: n }))], defaultValue: "E" },
        { name: "note4", label: "Note 4", type: "select", options: [{ label: "(none)", value: "" }, ...NOTES.map((n) => ({ label: n, value: n }))], defaultValue: "F" },
        { name: "note5", label: "Note 5", type: "select", options: [{ label: "(none)", value: "" }, ...NOTES.map((n) => ({ label: n, value: n }))], defaultValue: "G" },
        { name: "note6", label: "Note 6", type: "select", options: [{ label: "(none)", value: "" }, ...NOTES.map((n) => ({ label: n, value: n }))], defaultValue: "" },
        { name: "note7", label: "Note 7", type: "select", options: [{ label: "(none)", value: "" }, ...NOTES.map((n) => ({ label: n, value: n }))], defaultValue: "" },
      ],
      calculate: (inputs) => {
        const inputNotes: number[] = [];
        for (let i = 1; i <= 7; i++) {
          const val = inputs[`note${i}`] as string;
          if (val && NOTE_VALUES[val] !== undefined) {
            const idx = NOTE_VALUES[val];
            if (!inputNotes.includes(idx)) inputNotes.push(idx);
          }
        }
        if (inputNotes.length < 3) return null;

        const results: { key: string; quality: string; score: number; scale: string[] }[] = [];

        for (let root = 0; root < 12; root++) {
          const majorScale = MAJOR_INTERVALS.map((i) => (root + i) % 12);
          const minorScale = MINOR_INTERVALS.map((i) => (root + i) % 12);

          results.push({
            key: NOTES[root],
            quality: "Major",
            score: matchScore(inputNotes, majorScale),
            scale: getScale(root, MAJOR_INTERVALS),
          });
          results.push({
            key: NOTES[root],
            quality: "Minor",
            score: matchScore(inputNotes, minorScale),
            scale: getScale(root, MINOR_INTERVALS),
          });
        }

        results.sort((a, b) => b.score - a.score);
        const best = results[0];
        const confidence = Math.round((best.score / inputNotes.length) * 100);

        const details: { label: string; value: string }[] = [
          { label: "Notes Entered", value: inputNotes.map((n) => NOTES[n]).join(", ") },
          { label: "Best Match", value: `${best.key} ${best.quality}` },
          { label: "Notes Matching", value: `${best.score} of ${inputNotes.length}` },
          { label: "Confidence", value: `${confidence}%` },
          { label: "Scale Notes", value: best.scale.join(" - ") },
        ];

        // Show top 3 alternatives
        for (let i = 1; i <= Math.min(3, results.length - 1); i++) {
          if (results[i].score === best.score || results[i].score >= inputNotes.length - 1) {
            details.push({
              label: `Alternative ${i}`,
              value: `${results[i].key} ${results[i].quality} (${results[i].score}/${inputNotes.length} match)`,
            });
          }
        }

        return {
          primary: { label: "Most Likely Key", value: `${best.key} ${best.quality}` },
          details,
        };
      },
    },
    {
      id: "key-info",
      name: "Key Signature Info",
      description: "Get detailed info about a specific key signature",
      fields: [
        {
          name: "keyRoot",
          label: "Key Root",
          type: "select",
          options: NOTES.map((n) => ({ label: n, value: n })),
          defaultValue: "C",
        },
        {
          name: "quality",
          label: "Quality",
          type: "select",
          options: [
            { label: "Major", value: "major" },
            { label: "Natural Minor", value: "minor" },
          ],
          defaultValue: "major",
        },
      ],
      calculate: (inputs) => {
        const root = inputs.keyRoot as string;
        const quality = inputs.quality as string;
        const rootIdx = NOTE_VALUES[root];
        if (rootIdx === undefined) return null;

        const intervals = quality === "minor" ? MINOR_INTERVALS : MAJOR_INTERVALS;
        const scale = getScale(rootIdx, intervals);

        const relativeOffset = quality === "minor" ? 3 : -3;
        const relativeIdx = ((rootIdx + relativeOffset) % 12 + 12) % 12;
        const relativeName = NOTES[relativeIdx];
        const relativeQuality = quality === "minor" ? "Major" : "Minor";

        const parallelQuality = quality === "minor" ? "Major" : "Minor";

        // Count sharps/flats (simplified)
        const majorKeySignatures: Record<number, string> = {
          0: "No sharps or flats",
          7: "1 sharp (F#)",
          2: "2 sharps (F#, C#)",
          9: "3 sharps (F#, C#, G#)",
          4: "4 sharps (F#, C#, G#, D#)",
          11: "5 sharps",
          6: "6 sharps/flats",
          1: "7 flats",
          8: "4 flats",
          3: "3 flats (Bb, Eb, Ab)",
          10: "2 flats (Bb, Eb)",
          5: "1 flat (Bb)",
        };
        const effectiveRoot = quality === "minor" ? relativeIdx : rootIdx;
        const keySig = majorKeySignatures[effectiveRoot] || "N/A";

        return {
          primary: { label: `${root} ${quality === "minor" ? "Minor" : "Major"}`, value: scale.join(" - ") },
          details: [
            { label: "Scale Notes", value: scale.join(" - ") },
            { label: "Key Signature", value: keySig },
            { label: "Relative Key", value: `${relativeName} ${relativeQuality}` },
            { label: "Parallel Key", value: `${root} ${parallelQuality}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["chord-calculator", "key-transpose-calculator", "karaoke-key-calculator"],
  faq: [
    {
      question: "How do I find the key of a song?",
      answer:
        "Identify the chords or notes used in the song, then compare them to known major and minor scales. The key whose scale contains all (or most) of the song's notes is likely the key. The first or last chord is often the key.",
    },
    {
      question: "What is a relative key?",
      answer:
        "Relative keys share the same set of notes but have different tonal centers. C Major and A Minor are relative keys; both use only the white keys on a piano but sound different because of their different root notes.",
    },
    {
      question: "What is a key signature?",
      answer:
        "A key signature is the set of sharps or flats at the beginning of sheet music that indicates which key the piece is in. C Major has no sharps or flats, G Major has one sharp (F#), F Major has one flat (Bb), etc.",
    },
  ],
  formula:
    "Key detection compares input notes against all 24 major/minor scales. Score = number of input notes found in each scale. Highest score = most likely key.",
};
