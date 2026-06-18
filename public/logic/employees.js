/* =========================================================
   Employee CRUD — talks to Lovable Cloud only.
   All UI code should go through these functions.
   ========================================================= */
import { supabase } from "./supabaseClient.js";
import { uploadResume } from "./storage.js";

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
    linkedin: row.linkedin_url ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    resume: row.resume_file_url ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Map the UI shape (or a JSON import row) to a DB row. */
function toRow(input) {
  const email = (input.email ?? "").toString().trim().toLowerCase() || null;
  const phone = (input.phone ?? "").toString().trim() || null;
  return {
    full_name: input.full_name ?? input.name,
    role: input.role ?? input.title ?? null,
    department: input.department ?? null,
    rank: input.rank ?? null,
    skills: input.skills ?? [],
    bio: input.bio ?? null,
    linkedin_url: input.linkedin_url ?? input.linkedin ?? null,
    email,
    phone,
    resume_file_url: input.resume_file_url ?? input.resume ?? null,
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
/**
 * Create an employee. `input` accepts either DB-style keys or UI keys.
 * Pass `resumeFile` (a File) to upload a PDF and store the resulting path.
 */
export async function createEmployee(input, { resumeFile } = {}) {
  let resumePath = input.resume_file_url ?? input.resume ?? null;
  if (resumeFile) {
    resumePath = await uploadResume(resumeFile);
  }
  const row = toRow({ ...input, resume_file_url: resumePath });
  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
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
