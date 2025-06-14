
import { supabase } from "@/integrations/supabase/client";

// Use a table that exists; comment out if not present
export async function getMembershipPlans() {
  // const { data, error } = await supabase
  //   .from("membership_plans")
  //   .select("*")
  //   .order("price");
  // if (error) throw error;
  // return data;

  // Dummy for now
  return [];
}
