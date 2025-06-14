
import { supabase } from "@/integrations/supabase/client";

// Use "gyms"
export async function getBranches() {
  const { data, error } = await supabase.from("gyms").select("*").order("name");
  if (error) throw error;
  return data;
}
