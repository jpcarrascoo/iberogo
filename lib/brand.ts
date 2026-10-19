// IBEROGO — Week 4 brand system.
// One source of truth for name, colors, type and voice. The /marketing page renders
// this file, and the on-page logic checks use contrastRatio() to verify the colors.

export const BRAND = {
  name: "IBEROGO",
  wordmark: { first: "IBERO", accent: "GO" },
  tagline: {
    es: "Pide antes. Recoge entre clases.",
    en: "Order ahead. Pick up between classes.",
  },
  oneLiner: {
    es: "IBEROGO te deja pedir tu comida como le escribes a un amigo y elegir a qué hora y dónde la recoges.",
    en: "IBEROGO lets you order food the way you'd text a friend and choose when and where you pick it up.",
  },
};

export type ColorToken = {
  name: string;
  hex: string;
  tailwind: string;
  use: string;
};

export const COLORS: ColorToken[] = [
  { name: "Rojo GO", hex: "#DC2626", tailwind: "red-600", use: "The one accent: the GO in the wordmark, primary buttons, active links." },
  { name: "Tinta", hex: "#171717", tailwind: "neutral-900", use: "Body text and headlines on light backgrounds." },
  { name: "Papel", hex: "#FFFFFF", tailwind: "white", use: "Light-mode background." },
  { name: "Noche", hex: "#0A0A0A", tailwind: "neutral-950", use: "Dark-mode background." },
  { name: "Gris", hex: "#525252", tailwind: "neutral-600", use: "Secondary text, captions, labels." },
  { name: "Listo", hex: "#15803D", tailwind: "green-700", use: "Success states only (\"Saved ✓\", \"Copied ✓\"). Never decorative." },
];

// Text/background pairs the site actually uses. Each must reach WCAG AA (4.5:1).
export const CONTRAST_PAIRS: { label: string; fg: string; bg: string }[] = [
  { label: "Tinta on Papel (body text)", fg: "#171717", bg: "#FFFFFF" },
  { label: "Rojo GO on Papel (links, accent text)", fg: "#DC2626", bg: "#FFFFFF" },
  { label: "Papel on Rojo GO (button label)", fg: "#FFFFFF", bg: "#DC2626" },
  { label: "Gris on Papel (secondary text)", fg: "#525252", bg: "#FFFFFF" },
  { label: "#EDEDED on Noche (dark-mode body)", fg: "#EDEDED", bg: "#0A0A0A" },
];

export const TYPE_SCALE = [
  { role: "Hero headline", spec: "40–48px · bold · tight tracking", sample: "Sáltate la fila." },
  { role: "Section heading", spec: "20–24px · semibold", sample: "Cómo funciona" },
  { role: "Body", spec: "16–18px · regular · 70% opacity for secondary", sample: "Elige a qué hora y dónde recoges." },
  { role: "Label", spec: "12px · semibold · uppercase · wide tracking", sample: "SEMANA 4 — MARKETING" },
];

export const FONT_NOTE =
  "System UI stack (San Francisco on Mac/iPhone, Segoe UI on Windows, Roboto on Android). Free, no download, instant load on campus Wi-Fi.";

export const VOICE = [
  { rule: "Habla como estudiante, no como banco.", en: "Talk like a student, not a bank.", example: "“¿Otra vez 15 min en la fila?” — not “Optimice su tiempo de consumo.”" },
  { rule: "Tutea siempre.", en: "Always use “tú”.", example: "“Tú eliges la hora” — not “Usted elige”." },
  { rule: "Corto. Una idea por post.", en: "Short. One idea per post.", example: "Headlines under 8 words." },
  { rule: "Honesto sobre dónde vamos.", en: "Honest about where we are.", example: "“Prueba el demo” — never “Pide ya” while ordering isn't live." },
];

export const DOS = [
  "Use the red only for the GO and for the single most important action on a screen.",
  "Say it's a student project and a prototype.",
  "Quote real students only — paraphrased, dated, anonymous unless they agree to their name.",
  "Write in Spanish for students; keep an English line for the course.",
];

export const DONTS = [
  "Don't use the Universidad Iberoamericana logo, crest or official colors, or imply IBEROGO is official.",
  "Don't invent numbers (\"5,000 estudiantes ya lo usan\") or testimonials.",
  "Don't promise payments, delivery or vendors that don't exist yet.",
  "Don't add a second accent color.",
];

export const KNOWN_INCONSISTENCIES: string[] = [
  "/pricing (Week 3) still uses emerald accents instead of Rojo GO — to migrate in a later week.",
];

// --- WCAG contrast -----------------------------------------------------------

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(fg: string, bg: string): number {
  const a = relativeLuminance(fg);
  const b = relativeLuminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}
