
import { supabase } from "@/integrations/supabase/client";

// Use "trainers"
export async function getBranchTrainers(gym_id: string) {
  const { data, error } = await supabase
    .from("trainers")
    .select("*")
    .eq("gym_id", gym_id);
  if (error) throw error;
  return data;
}
