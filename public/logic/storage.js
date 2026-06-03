/* =========================================================
   Storage helpers — talk to Lovable Cloud Storage.
   Resumes live in a private bucket; we generate signed URLs
   on demand so users can download them.
   ========================================================= */
import { supabase } from "./supabaseClient.js";

const RESUMES_BUCKET = "resumes";

/** Upload a PDF file and return its storage path (not a URL). */
export async function uploadResume(file) {
  if (!file) return null;
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed for resumes.");
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage
    .from(RESUMES_BUCKET)
    .upload(path, file, { contentType: "application/pdf", upsert: false });
  if (error) throw error;
  return path;
}

/**
 * Given a stored resume path, return a short-lived signed URL.
 * Falls back to returning the input untouched if it already looks
 * like an http(s) URL (legacy data).
 */
export async function getResumeDownloadUrl(pathOrUrl, downloadName) {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const download = downloadName
    ? downloadName.replace(/[^a-zA-Z0-9._-]/g, "_")
    : true;
  const { data, error } = await supabase.storage
    .from(RESUMES_BUCKET)
    .createSignedUrl(pathOrUrl, 60 * 10, { download });
  if (error) throw error;
  return data.signedUrl;
}
