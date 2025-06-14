
import { supabase } from "@/integrations/supabase/client";

// Use "garage_services" instead of "class_types"
export async function getClassTypes(branch_id: string) {
  const { data, error } = await supabase
    .from("garage_services")
    .select("*")
    .eq("garage_id", branch_id); // note: mapping branch_id→garage_id
  if (error) throw error;
  return data;
}
