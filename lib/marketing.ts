// IBEROGO — Week 4 marketing engine + content system.
// A point-in-time content kit (same pattern as lib/research.ts): typed data plus pure
// functions. /marketing renders it, the homepage reads LANDING from it, and the
// on-page logic checks call the same functions the UI uses.
//
// Honesty rules baked into this file:
// - Copy was drafted with an AI coding assistant from real inputs (Week 1–3 research and
//   two real student conversations). It is not generated live, and nothing posts itself.
// - Quotes are real, paraphrased from the builder's notes, dated, and anonymous.
// - Nothing claims IBEROGO takes real orders or payments yet.

import { BRAND, CONTRAST_PAIRS, contrastRatio } from "./brand";
import { parseOrderText } from "./parseOrder";

// The Week 1 demo parser only understands English for now (decision, Week 4: keep the
// parser as is and say so in the copy). Every demo example in the copy uses this string,
// and logic check 12 runs it through the real parser.
export const DEMO_EXAMPLE = "2 tacos, no onions, and a coke, pickup at 1";

export type Lang = "es" | "en";
export type Bilingual = { es: string; en: string };

// --- Persona ----------------------------------------------------------------

export const PERSONA = {
  name: "Sofía",
  label: "Composite persona — not a real person",
  age: "20 · 5th-semester IBERO undergrad",
  context: {
    es: "Tiene clases seguidas casi toda la mañana y breaks cortos. Viene de lejos, así que muchas veces sale de casa sin desayunar.",
    en: "Back-to-back classes most mornings with short breaks. Commutes in, so she often leaves home without eating.",
  },
  goals: [
    { es: "Comer algo real entre clases sin llegar tarde.", en: "Eat a real meal between classes without being late." },
    { es: "No gastar de más: probar algo gratis antes de pagar.", en: "Not overspend: try something free before paying." },
  ],
  frustrations: [
    { es: "La fila de la cafetería en hora pico se come su break.", en: "The peak-hour cafeteria line eats her break." },
    { es: "Las apps de comida piden muchos pasos y formularios.", en: "Food apps take too many steps and forms." },
  ],
  channels: ["Instagram (stories)", "TikTok", "WhatsApp groups (carrera / generación)"],
  wouldPay: {
    es: "Usaría Básico ($0) de inmediato; pagaría Plus ($59/mes) solo si la prioridad de verdad le da su comida más rápido.",
    en: "Would use Básico ($0) right away; would pay Plus ($59/month) only if priority reliably gets her food faster.",
  },
  basedOn: [
    {
      date: "Sept 14, 2026",
      who: "IBERO student (Week 2 validation)",
      paraphrase:
        "Never used a pre-order app at IBERO but would like to — it would save time between classes and avoid long lines. Would use it for ease of use, clear menus and prices, choosing pickup time and place, and ordering the way you'd text a friend.",
    },
    {
      date: "Sept 28, 2026",
      who: "IBERO student (Week 3 pricing conversation)",
      paraphrase:
        "Would use IBEROGO to save time and avoid lines. $0 makes the basic service an easy choice; would consider $59/month if priority consistently got food faster; $129 only with clearly more benefits.",
    },
  ],
};

// --- A/B tests ----------------------------------------------------------------

export type Choice = "A" | "B";

export type ABTest = {
  id: "AB1" | "AB2";
  name: string;
  where: string;
  question: string;
  variants: Record<Choice, Bilingual>;
  hypothesis: string;
};

export const AB_TESTS: ABTest[] = [
  {
    id: "AB1",
    name: "Test 1 — Hero headline",
    where: "Homepage hero headline",
    question: "¿Cuál te daría más ganas de probar la app? (Which one makes you want to try the app?)",
    variants: {
      A: { es: "Sáltate la fila en la IBERO.", en: "Skip the line at IBERO." },
      B: { es: "Tu comida, lista entre clases.", en: "Your food, ready between classes." },
    },
    hypothesis: "B may win: it names the outcome (food ready) instead of the pain (the line). A is the current headline.",
  },
  {
    id: "AB2",
    name: "Test 2 — Lead message",
    where: "Homepage subhead + first line of posts",
    question: "¿Cuál de estas te convence más de usarla? (Which one convinces you more?)",
    variants: {
      A: { es: "Pide como le escribes a un amigo.", en: "Order the way you'd text a friend." },
      B: { es: "Tú eliges a qué hora y dónde recoges.", en: "You choose when and where you pick up." },
    },
    hypothesis: "Both came from real student conversations. We don't know which one should lead — that's the point.",
  },
];

// Change this to the Test 1 winner once the A/B test has at least MIN_VOTES real votes.
export const HOMEPAGE_HEADLINE: Choice = "A";

export const MIN_VOTES = 5;

export type ABSummary = {
  a: number;
  b: number;
  total: number;
  aPct: number;
  bPct: number;
  leader: Choice | "tie" | null;
  decided: boolean;
};

export function abSummary(votes: { choice: string }[]): ABSummary {
  const a = votes.filter((v) => v.choice === "A").length;
  const b = votes.filter((v) => v.choice === "B").length;
  const total = a + b;
  const aPct = total ? Math.round((a / total) * 100) : 0;
  const bPct = total ? 100 - aPct : 0;
  const leader: ABSummary["leader"] = total === 0 ? null : a === b ? "tie" : a > b ? "A" : "B";
  const decided = total >= MIN_VOTES && a !== b;
  return { a, b, total, aPct, bPct, leader, decided };
}

// --- Landing page copy (also rendered on the homepage) ------------------------

const heroVariant = AB_TESTS[0].variants[HOMEPAGE_HEADLINE];

export const LANDING = {
  eyebrow: { es: "Proyecto estudiantil · Prototipo", en: "Student project · Prototype" },
  headline: heroVariant,
  subhead: {
    es: "Escribe tu pedido como un mensaje, elige a qué hora y dónde lo recoges, y llega directo por tu comida.",
    en: "Type your order like a text, choose when and where to pick it up, and walk straight to your food.",
  },
  primaryCta: { label: { es: "Prueba el demo", en: "Try the demo" }, href: "/core" },
  secondaryCta: { label: { es: "Ver precios", en: "See pricing" }, href: "/pricing" },
  notice: {
    es: "IBEROGO es un prototipo: el demo convierte tu mensaje (en inglés, por ahora) en un pedido, pero todavía no se envía a ninguna cafetería ni se cobra nada.",
    en: "IBEROGO is a prototype: the demo turns your message (in English, for now) into an order, but it isn't sent to any cafeteria and nothing is charged yet.",
  },
  stepsTitle: { es: "Cómo funciona", en: "How it works" },
  steps: [
    {
      title: { es: "Escribe", en: "Type it" },
      body: {
        es: `Como un mensaje: “${DEMO_EXAMPLE}”. (Por ahora el demo entiende pedidos en inglés.)`,
        en: `Just like a text: “${DEMO_EXAMPLE}”. (For now the demo understands English orders.)`,
      },
    },
    {
      title: { es: "Elige hora y lugar", en: "Pick a time and place" },
      body: { es: "Tú decides cuándo y en qué punto recoges, entre tus clases.", en: "You decide when and where you collect, between your classes." },
    },
    {
      title: { es: "Recoge y a clase", en: "Grab it and go" },
      body: {
        es: "Cuando las cafeterías se sumen, llegas por tu pedido sin hacer fila.",
        en: "Once cafeterias join, you walk up and collect without queuing.",
      },
    },
  ],
  whyNotTitle: { es: "¿Por qué no simplemente…?", en: "Why not just…?" },
  whyNot: [
    {
      q: { es: "…que te lo lleven al salón?", en: "…have it delivered to the classroom?" },
      a: {
        es: "Es difícil de organizar e interrumpe la clase. Con IBEROGO eliges un punto de recogida cercano.",
        en: "It's hard to organize and interrupts class. With IBEROGO you pick a nearby pickup point.",
      },
    },
    {
      q: { es: "…pagar extra para que te atiendan primero?", en: "…pay extra to be served first?" },
      a: {
        es: "Pagar en cada pedido se siente injusto. Básico es gratis; la prioridad sería un plan opcional.",
        en: "Paying on every order feels unfair. Básico is free; priority would be an optional plan.",
      },
    },
    {
      q: { es: "…comer antes de llegar?", en: "…eat before you get to campus?" },
      a: {
        es: "Con tu horario y el trayecto, no siempre se puede. Pide antes de llegar y programa la hora.",
        en: "With your schedule and commute, it isn't always possible. Order before you arrive and schedule the time.",
      },
    },
  ],
  quote: {
    text: {
      es: "“Nunca he usado una app así en la IBERO, pero me gustaría: me ahorraría tiempo entre clases y evitaría las filas largas.”",
      en: "“I've never used an app like this at IBERO, but I'd like to: it would save me time between classes and avoid long lines.”",
    },
    attribution: {
      es: "Estudiante de la IBERO · conversación real, 14 sep 2026 · parafraseado",
      en: "IBERO student · real conversation, Sept 14, 2026 · paraphrased",
    },
  },
  faqTitle: { es: "Preguntas frecuentes", en: "FAQ" },
  faq: [
    {
      q: { es: "¿Es oficial de la IBERO?", en: "Is this official IBERO?" },
      a: {
        es: "No. Es un proyecto estudiantil, sin afiliación con la Universidad Iberoamericana.",
        en: "No. It's a student project, not affiliated with Universidad Iberoamericana.",
      },
    },
    {
      q: { es: "¿Ya puedo pedir y pagar?", en: "Can I order and pay yet?" },
      a: {
        es: "Todavía no. Hoy puedes probar el demo que convierte tu mensaje en un pedido (por ahora entiende inglés). Cafeterías y pagos vienen después.",
        en: "Not yet. Today you can try the demo that turns your message into an order (English only for now). Cafeterias and payments come later.",
      },
    },
    {
      q: { es: "¿Cuánto cuesta?", en: "How much does it cost?" },
      a: {
        es: "Básico será gratis. Plus ($59/mes) y Campus Pass ($129/mes) son propuestas que seguimos validando con estudiantes.",
        en: "Básico will be free. Plus ($59/month) and Campus Pass ($129/month) are proposals we're still validating with students.",
      },
    },
  ],
};

// --- Social posts ---------------------------------------------------------------

export type Channel = "Instagram" | "Instagram Story" | "X" | "WhatsApp" | "LinkedIn";
export type Pillar = "Problema" | "Cómo funciona" | "Precio" | "Confianza" | "Comunidad";

export type Post = {
  id: string;
  channel: Channel;
  format: string;
  pillar: Pillar;
  es: string;
  en: string;
  hashtags: string[];
};

export const CHANNEL_LIMITS: Record<Channel, number> = {
  Instagram: 2200,
  "Instagram Story": 2200,
  X: 280,
  WhatsApp: 65536,
  LinkedIn: 3000,
};

const DEMO = "iberogo-neon.vercel.app";

export const POSTS: Post[] = [
  {
    id: "P1",
    channel: "Instagram",
    format: "Feed post (single image: the cafeteria line)",
    pillar: "Problema",
    es: `¿Cuántos minutos de tu break se te van en la fila de la cafetería? 🕐

Estamos construyendo IBEROGO: pides antes, eliges a qué hora y dónde recoges, y llegas directo por tu comida.

Es un proyecto estudiantil y todavía es prototipo. Prueba el demo (link en bio) y dinos qué le falta.`,
    en: "How much of your break goes to the cafeteria line? We're building IBEROGO — order ahead, pick your time and place. Student project, still a prototype: try the demo and tell us what's missing.",
    hashtags: ["#IBERO", "#IBEROGO", "#VidaUniversitaria", "#CDMX"],
  },
  {
    id: "P2",
    channel: "Instagram Story",
    format: "Story with poll sticker",
    pillar: "Comunidad",
    es: `Pregunta rápida 👀
¿Qué te haría usar una app para pedir comida en la uni?

[Encuesta]
📝 Pedir como le escribo a un amigo
📍 Elegir a qué hora y dónde recojo`,
    en: "Quick question: what would make you use a campus food app? Poll: order like texting a friend vs. choose pickup time and place. (An informal online signal alongside A/B Test 2.)",
    hashtags: [],
  },
  {
    id: "P3",
    channel: "X",
    format: "Single post",
    pillar: "Cómo funciona",
    es: `Escribes: “${DEMO_EXAMPLE}”.
IBEROGO lo convierte en un pedido: qué, cuántos, notas y hora.
El demo por ahora entiende inglés. Pruébalo 👉 ${DEMO}/core`,
    en: `You type “${DEMO_EXAMPLE}” — IBEROGO turns it into an order: items, quantities, notes and time. The demo understands English for now. Try it.`,
    hashtags: ["#IBERO"],
  },
  {
    id: "P4",
    channel: "WhatsApp",
    format: "Message for class / generation group chats",
    pillar: "Comunidad",
    es: `¡Hola! Soy Jose, estudiante de la IBERO 👋
Estoy armando IBEROGO, una app para pedir comida antes y recogerla entre clases sin hacer fila.
Todavía es un demo (por ahora entiende pedidos en inglés, tipo “${DEMO_EXAMPLE}”): ¿me ayudan probándolo 2 minutos y diciéndome qué le cambiarían? 🙏
${DEMO}`,
    en: "Hi! I'm Jose, an IBERO student. I'm building IBEROGO, an app to order food ahead and pick it up between classes without queuing. It's still a demo (English orders only for now) — could you try it for 2 minutes and tell me what you'd change?",
    hashtags: [],
  },
  {
    id: "P5",
    channel: "Instagram",
    format: "Carousel (4 slides)",
    pillar: "Cómo funciona",
    es: `Así funciona IBEROGO 👇

1/ Escribe tu pedido como un mensaje.
2/ Elige a qué hora y en qué punto lo recoges.
3/ Llegas, recoges y a clase.
4/ Todavía es un demo: pruébalo y dinos qué falta. Link en bio.`,
    en: "How IBEROGO works: 1) type your order like a message, 2) choose time and pickup point, 3) collect and go to class, 4) it's still a demo — try it and tell us what's missing.",
    hashtags: ["#IBEROGO", "#IBERO", "#Emprendimiento"],
  },
  {
    id: "P6",
    channel: "Instagram",
    format: "Feed post (text graphic)",
    pillar: "Problema",
    es: `Lo que ya intentaste para comer entre clases:
🏃 Llegar 20 minutos antes
📚 Salirte antes de clase
🍽️ Simplemente no comer

Con IBEROGO tú eliges la hora y el punto de recogida. Sin repartidor en el salón y sin cargo extra por prioridad en cada pedido.`,
    en: "What you've already tried to eat between classes: arriving early, leaving class early, skipping the meal. With IBEROGO you pick the time and pickup point — no classroom delivery, no per-order priority fee.",
    hashtags: ["#IBERO", "#VidaUniversitaria"],
  },
  {
    id: "P7",
    channel: "Instagram",
    format: "Feed post (3 tier cards)",
    pillar: "Precio",
    es: `¿Cuánto costaría IBEROGO? 💸

Básico: $0. Pides en texto libre y eliges hora y lugar.
Plus ($59/mes) y Campus Pass ($129/mes) son ideas para prioridad y pedidos según tu horario. Todavía no existen y queremos saber si de verdad los pagarías.

¿Lo harías? Cuéntanos en comentarios 👇`,
    en: "What would IBEROGO cost? Básico: free. Plus ($59/mo) and Campus Pass ($129/mo) are ideas for priority and schedule-based ordering — they don't exist yet and we want to know if you'd actually pay. Would you?",
    hashtags: ["#IBEROGO", "#IBERO"],
  },
  {
    id: "P8",
    channel: "Instagram",
    format: "Quote graphic",
    pillar: "Confianza",
    es: `“Nunca he usado una app así en la IBERO, pero me gustaría: me ahorraría tiempo entre clases y evitaría las filas largas.”

— Estudiante de la IBERO (conversación real, 14 sep 2026, parafraseado)

Por eso estamos construyendo IBEROGO.`,
    en: "Real (paraphrased) quote from an IBERO student conversation on Sept 14, 2026: never used an app like this at IBERO but would like to — it would save time and avoid long lines. That's why we're building IBEROGO.",
    hashtags: ["#IBEROGO", "#IBERO"],
  },
  {
    id: "P9",
    channel: "X",
    format: "Single post",
    pillar: "Confianza",
    es: `¿IBEROGO es oficial de la IBERO?
No. Es un proyecto estudiantil, hecho por un alumno, en fase de prototipo.
Por eso te pedimos feedback antes que nada 🙌 ${DEMO}`,
    en: "Is IBEROGO official IBERO? No — it's a student project built by a student, still a prototype. That's why we ask for your feedback first.",
    hashtags: [],
  },
  {
    id: "P10",
    channel: "LinkedIn",
    format: "Build-in-public post",
    pillar: "Comunidad",
    es: `Semana 4 construyendo IBEROGO, una app para que los estudiantes de la IBERO pidan comida antes y la recojan entre clases.

Lo que más aprendí hablando con estudiantes: no les importa la tecnología, les importan dos cosas simples. Pedir como le escriben a un amigo, y elegir a qué hora y dónde recogen.

Esta semana armé el sistema de marca, 10 posts, 3 guiones de video y un A/B test con estudiantes reales para decidir cuál de esas dos ideas va primero.

Todavía es prototipo. Si tienes feedback, me encantaría leerlo.`,
    en: "Week 4 building IBEROGO. What talking to students taught me: they care about two simple things — ordering like texting a friend, and choosing pickup time and place. This week: brand system, 10 posts, 3 video scripts and an A/B test with real students to decide which idea leads.",
    hashtags: ["#BuildInPublic", "#Emprendimiento", "#IBERO"],
  },
];

// --- Video scripts --------------------------------------------------------------

export type Scene = { t: string; visual: string; onScreen: string; vo: string; en: string };

export type Script = {
  id: string;
  title: string;
  platform: string;
  length: string;
  pillar: Pillar;
  scenes: Scene[];
  productionNote: string;
};

export const SCRIPTS: Script[] = [
  {
    id: "V1",
    title: "La fila",
    platform: "TikTok",
    length: "30 s",
    pillar: "Problema",
    scenes: [
      { t: "0–3 s", visual: "Phone POV walking toward the cafeteria; the line comes into view.", onScreen: "POV: tu break es corto. La fila, no.", vo: "—", en: "POV: your break is short. The line isn't." },
      { t: "3–10 s", visual: "Close-up of the phone clock, then back to the line.", onScreen: "", vo: "Llegas, ves la fila, haces cuentas… y no te da tiempo.", en: "You arrive, see the line, do the math… and there's no time." },
      { t: "10–22 s", visual: `Screen recording of /core: typing “${DEMO_EXAMPLE}”, the structured card appears.`, onScreen: "Escríbelo como un mensaje (demo en inglés, por ahora)", vo: "Con IBEROGO escribes tu pedido como un mensaje y eliges a qué hora lo recoges.", en: "With IBEROGO you type your order like a message and choose when to pick it up." },
      { t: "22–27 s", visual: "Jose to camera.", onScreen: DEMO, vo: "Todavía es un demo. Pruébalo y dime qué le falta.", en: "It's still a demo. Try it and tell me what's missing." },
      { t: "27–30 s", visual: "IBEROGO wordmark on white.", onScreen: BRAND.tagline.es, vo: "—", en: BRAND.tagline.en },
    ],
    productionNote: "Film on a phone, edit in CapCut (free). No identifiable faces or cafeteria staff without their permission.",
  },
  {
    id: "V2",
    title: "Pide como le escribes a un amigo",
    platform: "Instagram Reels",
    length: "30 s",
    pillar: "Cómo funciona",
    scenes: [
      { t: "0–4 s", visual: "Split screen: left a WhatsApp chat with a friend, right IBEROGO /core.", onScreen: "¿Cuál es la diferencia?", vo: "—", en: "What's the difference?" },
      { t: "4–12 s", visual: `Left: “2 tacos sin cebolla y una coca, paso a la 1” sent to a friend. Right: “${DEMO_EXAMPLE}” typed into /core.`, onScreen: "Mismo pedido, como mensaje", vo: "Así le escribes a tu amigo para que te traiga algo…", en: "This is how you text a friend to bring you something…" },
      { t: "12–22 s", visual: "Right side: the real parsed card — 2 × Tacos (no onions), 1 × Coke, pickup at 1 pm.", onScreen: "2 × tacos · no onions · 1:00 pm", vo: "…y así lo entiende IBEROGO. Sin formularios, sin menús eternos.", en: "…and this is how IBEROGO understands it. No forms, no endless menus." },
      { t: "22–30 s", visual: "Wordmark + link.", onScreen: `El demo entiende inglés por ahora · ${DEMO}`, vo: "Es un prototipo y por ahora entiende inglés. ¿Lo quieres en español? Dímelo.", en: "It's a prototype and understands English for now. Want it in Spanish? Tell me." },
    ],
    productionNote: "Pure screen recording — the easiest to make. Use the real /core demo with the English example, not a mockup.",
  },
  {
    id: "V3",
    title: "Tú eliges hora y lugar",
    platform: "TikTok",
    length: "45 s",
    pillar: "Problema",
    scenes: [
      { t: "0–5 s", visual: "Jose to camera, holding up three fingers.", onScreen: "3 “soluciones” para comer entre clases", vo: "Tres formas de comer entre clases… y por qué no funcionan.", en: "Three ways to eat between classes… and why they don't work." },
      { t: "5–15 s", visual: "Text card 1.", onScreen: "1. Que te lo lleven al salón", vo: "Que te lo lleven al salón: es difícil de organizar e interrumpe la clase.", en: "Classroom delivery: hard to organize and it interrupts class." },
      { t: "15–25 s", visual: "Text card 2.", onScreen: "2. Pagar extra por prioridad", vo: "Pagar extra para que te atiendan primero… en cada pedido. No.", en: "Paying extra to be served first… on every order. No." },
      { t: "25–33 s", visual: "Text card 3.", onScreen: "3. Comer antes de llegar", vo: "Comer antes de llegar: con el tráfico, suerte.", en: "Eating before you arrive: with the traffic, good luck." },
      { t: "33–45 s", visual: "Screen recording of the pickup time in /core, then Jose to camera.", onScreen: "Tú eliges a qué hora y dónde recoges", vo: "Con IBEROGO tú eliges a qué hora y en qué punto recoges. ¿Qué otra opción se te ocurre? Dímelo en comentarios.", en: "With IBEROGO you choose when and where you pick up. What other option can you think of? Tell me in the comments." },
    ],
    productionNote: "Comments are the goal: reply to every one — that's free research for Week 5.",
  },
];

// --- 14-day campaign calendar ----------------------------------------------------

export type CalendarDay = { day: number; assetIds: string[]; channel: string; goal: string; note: string };

export const CALENDAR: CalendarDay[] = [
  { day: 1, assetIds: ["P1"], channel: "Instagram", goal: "Awareness", note: "Open with the problem." },
  { day: 2, assetIds: ["V1"], channel: "TikTok", goal: "Awareness", note: "Same problem, in video." },
  { day: 3, assetIds: ["P2"], channel: "Instagram Story", goal: "Engagement", note: "Poll = informal signal for Test 2." },
  { day: 4, assetIds: ["P3"], channel: "X", goal: "Demo visits", note: "Show the parser in one line." },
  { day: 5, assetIds: ["P4"], channel: "WhatsApp", goal: "Feedback", note: "Send to 2–3 class group chats, personally." },
  { day: 6, assetIds: ["P5"], channel: "Instagram", goal: "Demo visits", note: "How it works carousel." },
  { day: 7, assetIds: ["AB1", "AB2"], channel: "In person", goal: "Learn", note: "Run both A/B tests with ≥5 students; review week-1 numbers." },
  { day: 8, assetIds: ["V2"], channel: "Instagram Reels", goal: "Demo visits", note: "Lead with the Test 2 winner if decided." },
  { day: 9, assetIds: ["P6"], channel: "Instagram", goal: "Awareness", note: "The alternatives students already try." },
  { day: 10, assetIds: ["P7"], channel: "Instagram", goal: "Learn", note: "Ask about willingness to pay." },
  { day: 11, assetIds: ["V3"], channel: "TikTok", goal: "Engagement", note: "Reply to every comment." },
  { day: 12, assetIds: ["P8"], channel: "Instagram", goal: "Trust", note: "Real (paraphrased) student quote." },
  { day: 13, assetIds: ["P9"], channel: "X", goal: "Trust", note: "Answer the “is it official?” question up front." },
  { day: 14, assetIds: ["P10"], channel: "LinkedIn", goal: "Learn", note: "Recap + what changed after testing." },
];

export const DEFAULT_START_DATE = "2026-10-26";

export function assetLabel(id: string): string {
  const post = POSTS.find((p) => p.id === id);
  if (post) return `${post.id} · ${post.channel} — ${post.format}`;
  const script = SCRIPTS.find((s) => s.id === id);
  if (script) return `${script.id} · ${script.platform} — “${script.title}”`;
  const test = AB_TESTS.find((t) => t.id === id);
  if (test) return `${test.id} · ${test.name}`;
  return `${id} (missing)`;
}

export function assetExists(id: string): boolean {
  return POSTS.some((p) => p.id === id) || SCRIPTS.some((s) => s.id === id) || AB_TESTS.some((t) => t.id === id);
}

export type DatedDay = CalendarDay & { date: string };

// start: "YYYY-MM-DD". Uses UTC so the date never shifts with the viewer's time zone.
export function calendarWithDates(start: string): DatedDay[] {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(start);
  return CALENDAR.map((d) => {
    if (!m) return { ...d, date: `Day ${d.day}` };
    const date = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + d.day - 1));
    const label = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
    return { ...d, date: label };
  });
}

// --- Text builders (what Copy and Export put out) --------------------------------

export function postText(p: Post): string {
  return p.hashtags.length ? `${p.es}\n\n${p.hashtags.join(" ")}` : p.es;
}

export function scriptText(s: Script): string {
  const lines = [`${s.title} — ${s.platform}, ${s.length}`, ""];
  for (const sc of s.scenes) {
    lines.push(`[${sc.t}] ${sc.visual}`);
    if (sc.onScreen) lines.push(`  Texto en pantalla: ${sc.onScreen}`);
    if (sc.vo && sc.vo !== "—") lines.push(`  Voz: ${sc.vo}`);
  }
  lines.push("", `Nota: ${s.productionNote}`);
  return lines.join("\n");
}

function csvCell(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function calendarCsv(start: string): string {
  const header = ["Day", "Date", "Channel", "Assets", "Goal", "Note"];
  const rows = calendarWithDates(start).map((d) =>
    [String(d.day), d.date, d.channel, d.assetIds.map(assetLabel).join(" + "), d.goal, d.note].map(csvCell).join(",")
  );
  return [header.join(","), ...rows].join("\n");
}

export function landingText(lang: Lang): string {
  const L = LANDING;
  return [
    L.eyebrow[lang],
    L.headline[lang],
    L.subhead[lang],
    `${L.primaryCta.label[lang]} · ${L.secondaryCta.label[lang]}`,
    "",
    L.stepsTitle[lang],
    ...L.steps.map((s, i) => `${i + 1}. ${s.title[lang]} — ${s.body[lang]}`),
    "",
    L.whyNotTitle[lang],
    ...L.whyNot.map((w) => `${w.q[lang]} ${w.a[lang]}`),
    "",
    `${L.quote.text[lang]} — ${L.quote.attribution[lang]}`,
    "",
    L.faqTitle[lang],
    ...L.faq.map((f) => `${f.q[lang]} ${f.a[lang]}`),
    "",
    L.notice[lang],
  ].join("\n");
}

export function toMarkdown(start: string): string {
  const out: string[] = [];
  out.push(`# ${BRAND.name} — Marketing kit (Week 4)`, "");
  out.push(`> ${BRAND.tagline.es} · ${BRAND.tagline.en}`, "");
  out.push("Drafted with AI assistance from real research and two real student conversations; reviewed by a human before posting.", "");
  out.push("## Persona (composite)", "");
  out.push(`**${PERSONA.name}**, ${PERSONA.age}. ${PERSONA.context.en}`, "");
  out.push(`Would pay: ${PERSONA.wouldPay.en}`, "");
  out.push("## Landing page copy (ES)", "", "```", landingText("es"), "```", "");
  out.push("## Landing page copy (EN)", "", "```", landingText("en"), "```", "");
  out.push("## Social posts", "");
  for (const p of POSTS) {
    out.push(`### ${p.id} · ${p.channel} — ${p.format} (${p.pillar})`, "", "```", postText(p), "```", "", `_EN:_ ${p.en}`, "");
  }
  out.push("## Video scripts", "");
  for (const s of SCRIPTS) {
    out.push(`### ${s.id} · ${s.title}`, "", "```", scriptText(s), "```", "");
  }
  out.push("## 14-day calendar", "", "| Day | Date | Channel | Assets | Goal |", "|---|---|---|---|---|");
  for (const d of calendarWithDates(start)) {
    out.push(`| ${d.day} | ${d.date} | ${d.channel} | ${d.assetIds.join(" + ")} | ${d.goal} |`);
  }
  out.push("", "## A/B tests", "");
  for (const t of AB_TESTS) {
    out.push(`### ${t.name}`, "", `- A: ${t.variants.A.es} (${t.variants.A.en})`, `- B: ${t.variants.B.es} (${t.variants.B.en})`, `- Hypothesis: ${t.hypothesis}`, "");
  }
  return out.join("\n");
}

// --- On-page logic checks ---------------------------------------------------------

export type Check = { name: string; expected: string; actual: string; pass: boolean };

const BANNED_CLAIMS = ["pide ya", "ya disponible", "descarga la app", "paga aquí", "miles de estudiantes", "envío gratis"];

export function runMarketingChecks(): Check[] {
  const checks: Check[] = [];

  checks.push({
    name: "1. Content counts",
    expected: "10 posts · 3 scripts · 14 days",
    actual: `${POSTS.length} posts · ${SCRIPTS.length} scripts · ${CALENDAR.length} days`,
    pass: POSTS.length === 10 && SCRIPTS.length === 3 && CALENDAR.length === 14,
  });

  const missing = CALENDAR.flatMap((d) => d.assetIds).filter((id) => !assetExists(id));
  checks.push({
    name: "2. Every calendar day points to a real asset",
    expected: "0 missing references",
    actual: missing.length ? `Missing: ${missing.join(", ")}` : "0 missing references",
    pass: missing.length === 0,
  });

  const scheduled = new Set(CALENDAR.flatMap((d) => d.assetIds));
  const unscheduled = [...POSTS.map((p) => p.id), ...SCRIPTS.map((s) => s.id)].filter((id) => !scheduled.has(id));
  checks.push({
    name: "3. Every post and script is scheduled",
    expected: "13 of 13 scheduled",
    actual: unscheduled.length ? `Not scheduled: ${unscheduled.join(", ")}` : `${13 - unscheduled.length} of 13 scheduled`,
    pass: unscheduled.length === 0,
  });

  const xPosts = POSTS.filter((p) => p.channel === "X");
  const xMax = Math.max(...xPosts.map((p) => postText(p).length));
  checks.push({
    name: "4. X posts fit in 280 characters",
    expected: "longest ≤ 280",
    actual: `longest = ${xMax}`,
    pass: xMax <= CHANNEL_LIMITS.X,
  });

  const igPosts = POSTS.filter((p) => p.channel.startsWith("Instagram"));
  const igMax = Math.max(...igPosts.map((p) => postText(p).length));
  checks.push({
    name: "5. Instagram captions fit in 2,200 characters",
    expected: "longest ≤ 2,200",
    actual: `longest = ${igMax}`,
    pass: igMax <= CHANNEL_LIMITS.Instagram,
  });

  const ratios = CONTRAST_PAIRS.map((c) => contrastRatio(c.fg, c.bg));
  const minRatio = Math.min(...ratios);
  checks.push({
    name: "6. Brand text colors pass WCAG AA",
    expected: "every pair ≥ 4.5:1",
    actual: `lowest = ${minRatio}:1 (${CONTRAST_PAIRS[ratios.indexOf(minRatio)].label})`,
    pass: minRatio >= 4.5,
  });

  const small = abSummary([{ choice: "A" }, { choice: "A" }, { choice: "B" }]);
  checks.push({
    name: "7. A/B: 3 votes is not enough to decide",
    expected: "A 2 (67%) · B 1 (33%) · not decided",
    actual: `A ${small.a} (${small.aPct}%) · B ${small.b} (${small.bPct}%) · ${small.decided ? "decided" : "not decided"}`,
    pass: small.a === 2 && small.b === 1 && small.aPct === 67 && small.bPct === 33 && !small.decided,
  });

  const win = abSummary([..."AAABB"].map((c) => ({ choice: c })));
  checks.push({
    name: "8. A/B: 3–2 with 5 votes picks A",
    expected: "leader A · decided",
    actual: `leader ${win.leader} · ${win.decided ? "decided" : "not decided"}`,
    pass: win.leader === "A" && win.decided,
  });

  const tie = abSummary([..."ABABAB"].map((c) => ({ choice: c })));
  checks.push({
    name: "9. A/B: a 3–3 tie is not a winner",
    expected: "leader tie · not decided",
    actual: `leader ${tie.leader} · ${tie.decided ? "decided" : "not decided"}`,
    pass: tie.leader === "tie" && !tie.decided,
  });

  const dated = calendarWithDates("2026-10-26");
  checks.push({
    name: "10. Calendar dates from a start date",
    expected: "Day 1 = Mon, Oct 26, 2026 · Day 14 = Sun, Nov 8, 2026",
    actual: `Day 1 = ${dated[0].date} · Day 14 = ${dated[13].date}`,
    pass: dated[0].date === "Mon, Oct 26, 2026" && dated[13].date === "Sun, Nov 8, 2026",
  });

  const allCopy = [...POSTS.map(postText), ...SCRIPTS.map(scriptText), landingText("es")].join("\n").toLowerCase();
  const found = BANNED_CLAIMS.filter((b) => allCopy.includes(b));
  checks.push({
    name: "11. No launch claims while ordering isn't live",
    expected: `none of: ${BANNED_CLAIMS.map((b) => `“${b}”`).join(", ")}`,
    actual: found.length ? `Found: ${found.join(", ")}` : "none found",
    pass: found.length === 0,
  });

  const parsed = parseOrderText(DEMO_EXAMPLE);
  const tacos = parsed.items.find((i) => i.name.toLowerCase() === "tacos");
  const demoOk = parsed.items.length === 2 && tacos?.quantity === 2 && tacos?.notes === "no onions" && parsed.pickupTimeRaw !== null;
  checks.push({
    name: "12. The demo example in the copy really parses",
    expected: "2 items · 2 × Tacos (no onions) · pickup time found",
    actual: `${parsed.items.length} items · ${parsed.items.map((i) => `${i.quantity} × ${i.name}${i.notes ? ` (${i.notes})` : ""}`).join(", ")} · pickup ${parsed.pickupTimeRaw ?? "not found"}`,
    pass: demoOk,
  });

  return checks;
}
