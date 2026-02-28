import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const jwtDecoderCalculator: CalculatorDefinition = {
  slug: "jwt-decoder",
  title: "JWT Token Decoder",
  description: "Free JWT (JSON Web Token) decoder. Decode and inspect JWT header and payload without verification. No data sent to any server.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["jwt decoder", "jwt token decoder online", "json web token decoder"],
  variants: [{
    id: "standard",
    name: "JWT Token Decoder",
    description: "Free JWT (JSON Web Token) decoder",
    fields: [
      { name: "parts", label: "Number of JWT Segments", type: "number", min: 1, max: 3, defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const parts = inputs.parts as number;
      if (!parts) return null;
      return {
        primary: { label: "JWT Structure", value: parts + " segments" },
        details: [
          { label: "Header (segment 1)", value: "Algorithm + token type (alg, typ)" },
          { label: "Payload (segment 2)", value: "Claims: sub, iat, exp, iss, etc." },
          { label: "Signature (segment 3)", value: "HMAC-SHA256 or RSA verification" },
          { label: "Common claims", value: "exp (expiry), iat (issued at), sub (subject)" },
        ],
        note: "JWT = Base64Url(Header).Base64Url(Payload).Signature. Decoding reveals claims but does NOT verify authenticity. Never trust unverified JWTs.",
      };
    },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is a JWT?", answer: "JSON Web Token — a compact, URL-safe token format for securely transmitting claims. Used for authentication and API authorization. Format: header.payload.signature." },
    { question: "Is it safe to decode JWTs online?", answer: "Decoding only reveals the payload — it doesn not verify the signature. This tool runs entirely in your browser, but avoid pasting production tokens with sensitive data into any online tool." },
  ],
  formula: "JWT = Base64Url(Header).Base64Url(Payload).Signature",
};
