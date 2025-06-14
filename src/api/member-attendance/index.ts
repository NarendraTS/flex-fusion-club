
import { supabase } from "@/integrations/supabase/client";

// Use "attendance" instead of "member_attendance"
export async function recordAttendance({ member_id, branch_id }: { member_id: string, branch_id: string }) {
  const { data, error } = await supabase
    .from("attendance")
    .insert([{ staff_id: member_id, garage_id: branch_id, clock_in: new Date().toISOString() }]) // mapped fields
    .select()
    .single();
  if (error) throw error;
  return data;
}
