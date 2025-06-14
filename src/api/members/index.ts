
import { supabase } from "@/integrations/supabase/client";

// Use "staff" as a temporary stand-in for "members"
export async function createMember(form: any) {
  const { data, error } = await supabase
    .from("staff")
    .insert([form])
    .select()
    .single();
  if (error) throw error;
  return data;
}
