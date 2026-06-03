## Goal
Control the filename the browser uses when a user clicks "Download resume", instead of falling back to the stored object name (`{uuid}-{original}.pdf`).

## Proposed naming scheme
Default: `{FullName}_Resume.pdf` — e.g. `Jane_Doe_Resume.pdf`. Spaces replaced with `_`, unsafe characters stripped. (Open to a different convention — see question below.)

## Changes

### 1. `public/logic/storage.js`
Update `getResumeDownloadUrl` to accept an optional `downloadName`:

```js
export async function getResumeDownloadUrl(pathOrUrl, downloadName) {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const safe = downloadName
    ? downloadName.replace(/[^a-zA-Z0-9._-]/g, "_")
    : true; // fallback: use stored filename
  const { data, error } = await supabase.storage
    .from("resumes")
    .createSignedUrl(pathOrUrl, 600, { download: safe });
  if (error) throw error;
  return data.signedUrl;
}
```

Supabase's `download` option, when given a string, emits `Content-Disposition: attachment; filename="..."`, so the browser saves the file under that name regardless of how it's stored in the bucket.

### 2. `public/script.js` (resume button handler, ~line 162)
Pass the employee's name when requesting the URL:

```js
const filename = `${emp.full_name.replace(/\s+/g, "_")}_Resume.pdf`;
const url = await getResumeDownloadUrl(emp.resume, filename);
```

### Not changing
- `uploadResume()` — the stored path stays `{uuid}-{original}.pdf` so uploads remain unique and don't collide. Only the download-time filename changes.

## Question for you
What naming pattern do you want?
- `Jane_Doe_Resume.pdf` (name only)
- `Jane_Doe_Engineering.pdf` (name + department)
- `Resume_Jane_Doe_2026.pdf` (with date)
- Something else

Let me know and I'll switch to build mode and apply it.
