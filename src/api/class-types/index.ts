
import { supabase } from "@/integrations/supabase/client";

export async function getClassTypes(branch_id: string) {
  const { data, error } = await supabase
    .from("class_types")
    .select("*")
    .eq("branch_id", branch_id);
  if (error) throw error;
  return data;
}
