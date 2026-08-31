"use client";

import { useState } from "react";
import IntakeForm from "@/components/core/IntakeForm";
import OutputCard from "@/components/core/OutputCard";
import RecentSaves from "@/components/core/RecentSaves";
import { parseOrderText, type ParsedOrder } from "@/lib/parseOrder";
import { supabase, supabaseConfigured } from "@/lib/supabaseClient";

export default function CorePage() {
  const [parsed, setParsed] = useState<ParsedOrder | null>(null);
  const [rawInput, setRawInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const [refreshKey, setRefreshKey] = useState(0);

  function handleParse(text: string) {
    setRawInput(text);
    setParsed(parseOrderText(text));
    setSaveState("idle");
  }

  async function handleSave() {
    if (!parsed || !supabaseConfigured || !supabase) {
      setSaveState("error");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("core_outputs").insert({
      raw_input: rawInput,
      restaurant: parsed.restaurant,
      items: parsed.items,
      pickup_time_raw: parsed.pickupTimeRaw,
      pickup_time_iso: parsed.pickupTimeIso,
      special_instructions: parsed.specialInstructions,
    });
    setSaving(false);
    if (error) {
      setSaveState("error");
    } else {
      setSaveState("saved");
      setRefreshKey((k) => k + 1);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Generative Core Agent — Order Parser
      </h1>
      <p className="mt-2 mb-8 text-black/70 dark:text-white/70">
        Type an order the way you&apos;d text it to a friend. This turns it into
        structured data — items, quantities, notes, and pickup time — that
        the rest of IBEROGO will build on in later weeks.
      </p>

      <IntakeForm onParse={handleParse} />

      {parsed && (
        <div className="mt-6">
          <OutputCard order={parsed} onSave={handleSave} saving={saving} saveState={saveState} />
        </div>
      )}

      <RecentSaves refreshKey={refreshKey} />
    </div>
  );
}
