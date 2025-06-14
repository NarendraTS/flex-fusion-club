
import { supabase } from "@/integrations/supabase/client";

// Use "job_cards" to represent sessions for now
export async function bookSession(payload: any) {
  const { data, error } = await supabase
    .from("job_cards")
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}
