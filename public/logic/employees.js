/* =========================================================
   Employee CRUD — talks to Lovable Cloud (Supabase) only.
   All UI code should go through these functions, never
   query the database directly.
   ========================================================= */
import { supabase } from "./supabaseClient.js";

const TABLE = "employees";

/** Map a DB row to the shape the UI expects. */
function fromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.full_name,
    title: row.role ?? "",
    department: row.department ?? "",
    rank: row.rank ?? "",
    skills: Array.isArray(row.skills) ? row.skills : [],
    bio: row.bio ?? "",
    linkedin: row.linkedin_url ?? "#",
    resume: row.resume_file_url ?? "#",
    avatar: row.profile_photo_url ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Map the UI shape (or a JSON import row) to a DB row. */
function toRow(input) {
  return {
    full_name: input.full_name ?? input.name,
    role: input.role ?? input.title ?? null,
    department: input.department ?? null,
    rank: input.rank ?? null,
    skills: input.skills ?? [],
    bio: input.bio ?? null,
    linkedin_url: input.linkedin_url ?? input.linkedin ?? null,
    resume_file_url: input.resume_file_url ?? input.resume ?? null,
    profile_photo_url: input.profile_photo_url ?? input.avatar ?? null,
  };
}

// ---------- Read ----------
export async function getAllEmployees() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("full_name", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function getEmployeeById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return fromRow(data);
}

// ---------- Write ----------
export async function createEmployee(employee) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(toRow(employee))
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function updateEmployee(id, patch) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(toRow(patch))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function deleteEmployee(id) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
  return true;
}
