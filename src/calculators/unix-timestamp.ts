import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const unixTimestampCalculator: CalculatorDefinition = {
  slug: "unix-timestamp-calculator",
  title: "Unix Timestamp Converter",
  description:
    "Free Unix timestamp converter. Convert between Unix epoch timestamps and human-readable dates. Get the current Unix time.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "unix timestamp converter",
    "epoch time converter",
    "unix time to date",
    "date to unix timestamp",
    "epoch converter",
  ],
  variants: [
    {
      id: "to-date",
      name: "Unix Timestamp to Date",
      description: "Convert a Unix timestamp to a human-readable date",
      fields: [
        { name: "timestamp", label: "Unix Timestamp (seconds)", type: "number", placeholder: "e.g. 1700000000" },
      ],
      calculate: (inputs) => {
        const ts = inputs.timestamp as number;
        if (ts === undefined || ts === null) return null;

        // Detect if milliseconds (> year 2100 in seconds)
        const isMs = ts > 4102444800;
        const date = isMs ? new Date(ts) : new Date(ts * 1000);

        if (isNaN(date.getTime())) return null;

        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const utcStr = date.toUTCString();
        const localStr = `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
        const isoStr = date.toISOString();

        return {
          primary: { label: "Date (Local)", value: localStr },
          details: [
            { label: "UTC", value: utcStr },
            { label: "ISO 8601", value: isoStr },
            { label: "Unix (seconds)", value: formatNumber(Math.floor(date.getTime() / 1000)) },
            { label: "Unix (milliseconds)", value: formatNumber(date.getTime()) },
            { label: "Auto-detected format", value: isMs ? "Milliseconds" : "Seconds" },
          ],
        };
      },
    },
    {
      id: "to-timestamp",
      name: "Date to Unix Timestamp",
      description: "Convert a date to a Unix timestamp",
      fields: [
        { name: "year", label: "Year", type: "number", placeholder: "e.g. 2026", min: 1970, max: 2100 },
        { name: "month", label: "Month", type: "number", placeholder: "1-12", min: 1, max: 12 },
        { name: "day", label: "Day", type: "number", placeholder: "1-31", min: 1, max: 31 },
        { name: "hour", label: "Hour (0-23)", type: "number", placeholder: "e.g. 12", min: 0, max: 23, defaultValue: 0 },
        { name: "minute", label: "Minute", type: "number", placeholder: "e.g. 0", min: 0, max: 59, defaultValue: 0 },
        { name: "second", label: "Second", type: "number", placeholder: "e.g. 0", min: 0, max: 59, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const y = inputs.year as number;
        const m = inputs.month as number;
        const d = inputs.day as number;
        const h = (inputs.hour as number) || 0;
        const min = (inputs.minute as number) || 0;
        const sec = (inputs.second as number) || 0;
        if (!y || !m || !d) return null;

        const date = new Date(y, m - 1, d, h, min, sec);
        const utcDate = new Date(Date.UTC(y, m - 1, d, h, min, sec));
        const tsLocal = Math.floor(date.getTime() / 1000);
        const tsUtc = Math.floor(utcDate.getTime() / 1000);

        return {
          primary: { label: "Unix Timestamp (Local)", value: formatNumber(tsLocal) },
          details: [
            { label: "Unix (seconds, UTC)", value: formatNumber(tsUtc) },
            { label: "Unix (milliseconds, local)", value: formatNumber(date.getTime()) },
            { label: "ISO 8601 (local)", value: date.toISOString() },
            { label: "ISO 8601 (UTC)", value: utcDate.toISOString() },
          ],
        };
      },
    },
    {
      id: "current",
      name: "Current Unix Time",
      description: "Get the current Unix timestamp",
      fields: [
        { name: "dummy", label: "Click calculate for current time", type: "number", placeholder: "Enter any number", defaultValue: 1 },
      ],
      calculate: () => {
        const now = new Date();
        const ts = Math.floor(now.getTime() / 1000);
        const tsMs = now.getTime();

        return {
          primary: { label: "Current Unix Timestamp", value: formatNumber(ts) },
          details: [
            { label: "Milliseconds", value: formatNumber(tsMs) },
            { label: "Current UTC", value: now.toUTCString() },
            { label: "Current ISO 8601", value: now.toISOString() },
            { label: "Current local time", value: now.toLocaleString() },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "timestamp-calculator",
    "date-calculator",
    "julian-date-calculator",
  ],
  faq: [
    {
      question: "What is a Unix timestamp?",
      answer:
        "A Unix timestamp (or epoch time) is the number of seconds elapsed since January 1, 1970, 00:00:00 UTC. It is widely used in programming and databases to represent dates.",
    },
    {
      question: "What is the Year 2038 problem?",
      answer:
        "32-bit systems store Unix time as a signed 32-bit integer, which overflows on January 19, 2038 at 03:14:07 UTC. Most modern systems use 64-bit integers to avoid this issue.",
    },
    {
      question: "What is the difference between seconds and milliseconds?",
      answer:
        "Unix time in seconds has 10 digits (e.g. 1700000000). In milliseconds it has 13 digits (e.g. 1700000000000). JavaScript's Date.now() returns milliseconds.",
    },
  ],
  formula: "Unix Timestamp = Seconds since January 1, 1970 00:00:00 UTC",
};
