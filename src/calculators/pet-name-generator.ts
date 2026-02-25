import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const petTypeOptions = [
  { label: "Dog", value: "dog" },
  { label: "Cat", value: "cat" },
  { label: "Rabbit", value: "rabbit" },
  { label: "Hamster", value: "hamster" },
  { label: "Bird", value: "bird" },
  { label: "Fish", value: "fish" },
  { label: "Reptile", value: "reptile" },
];

const personalityOptions = [
  { label: "Playful / Energetic", value: "playful" },
  { label: "Calm / Gentle", value: "calm" },
  { label: "Sassy / Independent", value: "sassy" },
  { label: "Goofy / Silly", value: "goofy" },
  { label: "Regal / Elegant", value: "regal" },
  { label: "Tough / Bold", value: "tough" },
];

const namesByType: Record<string, Record<string, string[]>> = {
  dog: {
    playful: ["Ziggy", "Dash", "Pepper", "Biscuit", "Noodle"],
    calm: ["Willow", "Sage", "Honey", "Clover", "Maple"],
    sassy: ["Diva", "Sasha", "Roxy", "Cleo", "Stella"],
    goofy: ["Waffles", "Pickle", "Bongo", "Tater", "Meatball"],
    regal: ["Duke", "Duchess", "Windsor", "Sterling", "Athena"],
    tough: ["Thor", "Blaze", "Rex", "Tank", "Maverick"],
  },
  cat: {
    playful: ["Mochi", "Pixel", "Sprout", "Fizz", "Jinx"],
    calm: ["Luna", "Misty", "Shadow", "Pearl", "Jasper"],
    sassy: ["Queenie", "Diva", "Siren", "Nyx", "Velvet"],
    goofy: ["Noodle", "Pudding", "Beans", "Taco", "Wobble"],
    regal: ["Duchess", "Empress", "Caspian", "Versailles", "Olympia"],
    tough: ["Panther", "Onyx", "Fang", "Storm", "Bandit"],
  },
  rabbit: {
    playful: ["Binky", "Hopscotch", "Dash", "Skippy", "Pogo"],
    calm: ["Clover", "Cotton", "Buttercup", "Daisy", "Fern"],
    sassy: ["Coco", "Trixie", "Ginger", "Sassy", "Dottie"],
    goofy: ["Thumper", "Biscuit", "Nugget", "Muffin", "Waffles"],
    regal: ["Hazel", "Ivory", "Pearl", "Duchess", "Velvet"],
    tough: ["Jet", "Bolt", "Blaze", "Ranger", "Ace"],
  },
  hamster: {
    playful: ["Zippy", "Squeak", "Pip", "Nibbles", "Turbo"],
    calm: ["Peanut", "Teddy", "Maple", "Cocoa", "Honey"],
    sassy: ["Sassy", "Lola", "Gigi", "Missy", "Trixie"],
    goofy: ["Chunk", "Cheeks", "Nacho", "Dumpling", "Boba"],
    regal: ["Princess", "Duke", "Sterling", "Jewel", "Topaz"],
    tough: ["Bandit", "Spike", "Blitz", "Rascal", "Shadow"],
  },
  bird: {
    playful: ["Chirpy", "Tweet", "Kiwi", "Skittles", "Rio"],
    calm: ["Dove", "Sky", "Breeze", "Sunny", "Cloud"],
    sassy: ["Phoenix", "Siren", "Echo", "Jade", "Raven"],
    goofy: ["Noodle", "Pickles", "Nugget", "Tango", "Peeps"],
    regal: ["Falcon", "Aurora", "Athena", "Apollo", "Celeste"],
    tough: ["Talon", "Storm", "Hawk", "Blaze", "Thunder"],
  },
  fish: {
    playful: ["Bubbles", "Splash", "Nemo", "Dory", "Squirt"],
    calm: ["Neptune", "Coral", "Marina", "Wave", "Pearl"],
    sassy: ["Gill", "Ariel", "Jewel", "Shimmer", "Opal"],
    goofy: ["Sushi", "Guppy", "Flotsam", "Puddles", "Flipper"],
    regal: ["Poseidon", "Triton", "Sapphire", "Atlantis", "Neptune"],
    tough: ["Jaws", "Shark", "Fang", "Barracuda", "Titan"],
  },
  reptile: {
    playful: ["Ziggy", "Dart", "Spike", "Zippy", "Flash"],
    calm: ["Sage", "Moss", "Ivy", "Fern", "Stone"],
    sassy: ["Viper", "Slinky", "Nyx", "Medusa", "Electra"],
    goofy: ["Godzilla", "Noodle", "Taco", "Waffles", "Pickle"],
    regal: ["Rex", "Draco", "Emperor", "Pharaoh", "Augustus"],
    tough: ["Fang", "Blaze", "Titan", "Venom", "Thor"],
  },
};

export const petNameGeneratorCalculator: CalculatorDefinition = {
  slug: "pet-name-generator-calculator",
  title: "Pet Name Ideas Generator",
  description:
    "Free pet name ideas generator. Get personalized name suggestions for your dog, cat, rabbit, or other pet based on their personality and type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pet name",
    "dog name",
    "cat name",
    "pet name generator",
    "pet name ideas",
    "animal name",
  ],
  variants: [
    {
      id: "pet-names",
      name: "Pet Name Ideas",
      description: "Generate name ideas based on pet type and personality",
      fields: [
        {
          name: "petType",
          label: "Pet Type",
          type: "select",
          options: petTypeOptions,
        },
        {
          name: "personality",
          label: "Personality",
          type: "select",
          options: personalityOptions,
        },
        {
          name: "nameLength",
          label: "Preferred Name Length",
          type: "select",
          options: [
            { label: "Short (1-4 letters)", value: "short" },
            { label: "Medium (5-7 letters)", value: "medium" },
            { label: "Any length", value: "any" },
          ],
        },
      ],
      calculate: (inputs) => {
        const petType = (inputs.petType as string) || "dog";
        const personality = (inputs.personality as string) || "playful";
        const nameLength = (inputs.nameLength as string) || "any";

        const typeNames = namesByType[petType];
        if (!typeNames) return null;

        let names = typeNames[personality] || typeNames["playful"];

        if (nameLength === "short") {
          names = names.filter((n) => n.length <= 4);
          if (names.length === 0) names = (typeNames[personality] || []).slice(0, 3);
        } else if (nameLength === "medium") {
          names = names.filter((n) => n.length >= 5 && n.length <= 7);
          if (names.length === 0) names = (typeNames[personality] || []).slice(0, 3);
        }

        const petLabel =
          petTypeOptions.find((o) => o.value === petType)?.label ?? petType;
        const personalityLabel =
          personalityOptions.find((o) => o.value === personality)?.label ?? personality;

        return {
          primary: {
            label: "Top Name Suggestions",
            value: names.slice(0, 3).join(", "),
          },
          details: [
            { label: "Pet type", value: petLabel },
            { label: "Personality", value: personalityLabel },
            { label: "Name preference", value: nameLength },
            ...names.map((name, i) => ({
              label: `Suggestion ${i + 1}`,
              value: `${name} (${name.length} letters)`,
            })),
            { label: "Total suggestions", value: formatNumber(names.length) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "dog-age-human-calculator",
    "cat-age-human-calculator",
    "baby-name-popularity-calculator",
  ],
  faq: [
    {
      question: "How do I choose a good pet name?",
      answer:
        "Choose a name that is 1-2 syllables for easy recall, does not sound like common commands (e.g., avoid 'Kit' if you say 'sit'), matches your pet's personality, and is something you will not be embarrassed to call out in public.",
    },
    {
      question: "Can I rename an adopted pet?",
      answer:
        "Yes. Pets can learn a new name in 1-2 weeks. Use the new name consistently with treats and positive reinforcement. Avoid names that sound similar to their old name if you want a clean break.",
    },
  ],
  formula:
    "Names are curated lists filtered by pet type, personality trait, and preferred length. Suggestions prioritize popular and well-suited names.",
};
