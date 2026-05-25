import { supabase } from "./supabase";

const PROFILE_ID = import.meta.env.VITE_PROFILE_ID || "adryan";

export async function loadProgress() {
  try {
    const { data, error } = await supabase
      .from("quiz_progress")
      .select("cards, stats")
      .eq("profile_id", PROFILE_ID)
      .maybeSingle();

    if (error) {
      console.error("Failed to load quiz progress:", error);
      return null;
    }

    if (!data) return null;

    return {
      cards: data.cards && typeof data.cards === "object" ? data.cards : {},
      stats: data.stats && typeof data.stats === "object" ? data.stats : null,
    };
  } catch (error) {
    console.error("Unexpected error while loading quiz progress:", error);
    return null;
  }
}

export async function saveProgress({ cards, stats }) {
  try {
    const { error } = await supabase.from("quiz_progress").upsert(
      {
        profile_id: PROFILE_ID,
        cards,
        stats,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "profile_id" },
    );

    if (error) {
      console.error("Failed to save quiz progress:", error);
    }
  } catch (error) {
    console.error("Unexpected error while saving quiz progress:", error);
  }
}
