export interface Boss {
  id: string
  name: string
  displayName: string
  attack: string
  attackRef: string
  weakness: string
  color: string
  icon: string
}

export interface CounterCard {
  id: string
  name: string
  visual: string
  lore: string
  counters: string // Boss ID this card counters
  minigameType: "snake" | "whack" | "runner" | "ctf"
  color: string
  secondaryColor: string
  icon: string
  url: string
}

export interface GameCard {
  id: string
  name: string
  type: "Defense" | "Counter" | "Attack" | "Tank" | "Scout" | "Worker" | "Ghost"
  power: number
  description: string
  color: string
  secondaryColor?: string
  hoverData?: string
  counters?: string[]
  icon?: string
  minigameType?: "snake" | "whack" | "dodge" | "runner" | "ctf"
}

export interface ThreatCard {
  name: string
  power: number
  description: string
}

// THE 5 BOSSES
export const BOSSES: Boss[] = [
  {
    id: "microsoft",
    name: "MICRO-SOFT",
    displayName: "The Zombie",
    attack: "E-Waste Avalanche",
    attackRef: "Windows 10 End of Life",
    weakness: "Linux / Stability",
    color: "#00a4ef",
    icon: "window",
  },
  {
    id: "google",
    name: "GOGGLE",
    displayName: "The Cloud Overlord",
    attack: "Storage Ransom",
    attackRef: "Education Storage Limits",
    weakness: "Self-Hosting",
    color: "#4285f4",
    icon: "g",
  },
  {
    id: "adobe",
    name: "AD-OBE",
    displayName: "The Rent Seeker",
    attack: "The Hidden Fee",
    attackRef: "Cancellation Lawsuits",
    weakness: "FOSS Creativity",
    color: "#ff0000",
    icon: "adobe",
  },
  {
    id: "meta",
    name: "META-VERSE",
    displayName: "The Spy",
    attack: "Psychographic Profiling",
    attackRef: "Cambridge Analytica",
    weakness: "Federation / Privacy",
    color: "#0668e1",
    icon: "meta",
  },
  {
    id: "apple",
    name: "iFRUIT",
    displayName: "The Walled Garden",
    attack: "Proprietary Lock",
    attackRef: "Part Pairing/Anti-Repair",
    weakness: "Right-to-Repair",
    color: "#a3aaae",
    icon: "apple",
  },
]

// THE 5 COUNTER CARDS
export const COUNTER_CARDS: CounterCard[] = [
  {
    id: "linux-mint",
    name: "The Resurrector",
    visual: "Linux Mint",
    lore: "Revives old hardware. 0% TPM required.",
    counters: "microsoft",
    minigameType: "ctf",
    color: "#87cf3e",
    secondaryColor: "#569530",
    icon: "penguin",
    url: "/minigame/linux-mint",
  },
  {
    id: "nextcloud",
    name: "The Local Fortress",
    visual: "Nextcloud",
    lore: "Your drive. Your rules. 0€ monthly fees.",
    counters: "google",
    minigameType: "whack",
    color: "#0082c9",
    secondaryColor: "#00639a",
    icon: "server",
    url: "/minigame/nextcloud",
  },
  {
    id: "libre-studio",
    name: "The Libre Studio",
    visual: "Blender/Gimp",
    lore: "Pro tools. No cancellation fees.",
    counters: "adobe",
    minigameType: "whack",
    color: "#f5792a",
    secondaryColor: "#e96d00",
    icon: "paintbrush",
    url: "/minigame/libre-studio",
  },
  {
    id: "fediverse",
    name: "The Fediverse",
    visual: "Mastodon",
    lore: "No Algorithms. No Tracking. Real Community.",
    counters: "meta",
    minigameType: "runner",
    color: "#6364ff",
    secondaryColor: "#563acc",
    icon: "islands",
    url: "/minigame/fediverse",
  },
  {
    id: "ifixit",
    name: "The Fixer's Kit",
    visual: "iFixit/Framework",
    lore: "If you can't open it, you don't own it.",
    counters: "apple",
    minigameType: "snake",
    color: "#ffd700",
    secondaryColor: "#cc9900",
    icon: "screwdriver",
    url: "/minigame/ifixit",
  },
]
