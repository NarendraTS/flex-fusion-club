
import { supabase } from "@/integrations/supabase/client";

// Use "membership_plans"
export async function getMembershipPlans(gym_id?: string) {
  const query = supabase
    .from("membership_plans")
    .select("*")
    .order("price");
  if (gym_id) query.eq("gym_id", gym_id);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
