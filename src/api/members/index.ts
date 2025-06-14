
import { supabase } from "@/integrations/supabase/client";

export async function createMember(form: any) {
  const { data, error } = await supabase
    .from("members")
    .insert([form])
    .select()
    .single();
  if (error) throw error;
  return data;
}
