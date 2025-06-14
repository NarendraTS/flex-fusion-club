
import { supabase } from "@/integrations/supabase/client";

// Use "classes" instead of "garage_services" or "class_types"
export async function getClassTypes(gym_id: string) {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("gym_id", gym_id);
  if (error) throw error;
  return data;
}
