
import { supabase } from "@/integrations/supabase/client";

// Use "sessions" for booking PT/class sessions
export async function bookSession(payload: any) {
  const { data, error } = await supabase
    .from("sessions")
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}
