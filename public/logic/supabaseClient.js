/* =========================================================
   Supabase browser client (vanilla JS, ESM via CDN)
   Source of truth for all employee data.
   ========================================================= */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://juydoycdcfnfszfoxcfr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1eWRveWNkY2ZuZnN6Zm94Y2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MDM1NjIsImV4cCI6MjA5NTk3OTU2Mn0.fNVsmrPWBU1dITdsLzHjhJ5BiOlUpyfughq6_xulu3E";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false },
});
