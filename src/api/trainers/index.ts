
import { supabase } from "@/integrations/supabase/client";

// Use "staff" instead of "trainers"
export async function getBranchTrainers(branch_id: string) {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("garage_id", branch_id); // branch_id mapped to garage_id
  if (error) throw error;
  return data;
}
