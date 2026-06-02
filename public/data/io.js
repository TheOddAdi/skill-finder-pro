/* =========================================================
   JSON import / export utilities.
   Lets you bulk-load employees.json into the database
   or dump the current database back to JSON.
   ========================================================= */
import { supabase } from "../logic/supabaseClient.js";
import { createEmployee, getAllEmployees } from "../logic/employees.js";

/**
 * Import an array of employee objects (matching employees.json shape)
 * into the database. Returns the number of rows inserted.
 * Pass { replace: true } to wipe the table first.
 */
export async function importEmployeesFromJSON(rows, { replace = false } = {}) {
  if (!Array.isArray(rows)) throw new Error("Expected an array of employees");

  if (replace) {
    const { error } = await supabase
      .from("employees")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) throw error;
  }

  let inserted = 0;
  for (const row of rows) {
    await createEmployee(row);
    inserted++;
  }
  return inserted;
}

/** Fetch /data/employees.json from the static folder and import it. */
export async function importEmployeesFromFile(
  path = "/public/data/employees.json",
  opts,
) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  const rows = await res.json();
  return importEmployeesFromJSON(rows, opts);
}

/** Dump the current database to a JSON-serializable array. */
export async function exportEmployeesToJSON() {
  const employees = await getAllEmployees();
  return employees.map((e) => ({
    full_name: e.name,
    role: e.title,
    department: e.department,
    rank: e.rank,
    skills: e.skills,
    bio: e.bio,
    linkedin_url: e.linkedin,
    resume_file_url: e.resume,
    profile_photo_url: e.avatar,
  }));
}
