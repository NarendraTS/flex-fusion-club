
import { supabase } from "@/integrations/supabase/client";

// Use "garages" instead of "branches"
export async function getBranches() {
  const { data, error } = await supabase.from("garages").select("*").order("name");
  if (error) throw error;
  return data;
}
