/* =========================================================
   Skills Directory — vanilla JS UI
   Data layer lives in /public/logic/*.
   This file only renders, filters in memory, and runs the modal.
   ========================================================= */
import { getAllEmployees, getEmployeeById, createEmployee } from "./logic/employees.js";
import { importEmployeesFromJSON } from "./data/io.js";
import { getResumeDownloadUrl } from "./logic/storage.js";

// In-memory cache of all employees (fetched on load + after add).
let EMPLOYEES = [];

// ---------- DOM refs ----------
const $search = document.getElementById("search-view");
const $profile = document.getElementById("profile-view");
const $input = document.getElementById("search-input");
const $clear = document.getElementById("clear-btn");
const $results = document.getElementById("results");
const $empty = document.getElementById("empty");
const $emptyText = document.getElementById("empty-text");
const $count = document.getElementById("result-count");
const $addBtn = document.getElementById("add-btn");
const $modal = document.getElementById("add-modal");
const $form = document.getElementById("add-form");
const $formError = document.getElementById("add-error");
const $submit = document.getElementById("add-submit");

// ---------- Utilities ----------
function escapeHTML(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

// ---------- Search / filtering ----------
function filterEmployees(query) {
  const q = query.trim().toLowerCase();
  if (!q) return EMPLOYEES;
  return EMPLOYEES.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.title.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.skills.some((s) => s.toLowerCase().includes(q)),
  );
}

// ---------- Rendering: cards ----------
function renderCard(emp, query) {
  const q = query.trim().toLowerCase();
  const top = emp.skills.slice(0, 5);
  const chips = top
    .map((s) => {
      const matched = q && s.toLowerCase().includes(q);
      return `<span class="chip ${matched ? "chip--matched" : ""}">${escapeHTML(s)}</span>`;
    })
    .join("");

  return `
    <button class="card" data-id="${emp.id}" aria-label="Open profile for ${escapeHTML(emp.name)}">
      <div class="card__head">
        <div class="card__info">
          <h3 class="card__name">${escapeHTML(emp.name)}</h3>
          <p class="card__title">${escapeHTML(emp.title)}</p>
          <div class="card__meta">
            <span>🏢 ${escapeHTML(emp.department)}</span>
            <span>✨ ${escapeHTML(emp.rank)}</span>
          </div>
        </div>
      </div>
      <div class="card__skills">${chips}</div>
    </button>
  `;
}

function renderResults() {
  const query = $input.value;
  const list = filterEmployees(query);

  $count.textContent = `${list.length} ${list.length === 1 ? "person" : "people"} found`;
  $clear.hidden = !query;

  if (list.length === 0) {
    $results.innerHTML = "";
    $empty.hidden = false;
    $emptyText.textContent = query
      ? `We couldn't find anyone matching "${query}". Try a broader skill or check spelling.`
      : "No employees yet. Click “+ Add person” to get started.";
    return;
  }

  $empty.hidden = true;
  $results.innerHTML = list.map((emp) => renderCard(emp, query)).join("");

  $results.querySelectorAll(".card").forEach((node) => {
    node.addEventListener("click", async () => {
      const emp = await getEmployeeById(node.dataset.id);
      if (emp) showProfile(emp);
    });
  });
}

// ---------- Rendering: profile ----------
function renderProfile(emp) {
  const skills = emp.skills.map((s) => `<span class="chip">${escapeHTML(s)}</span>`).join("");
  const linkedinBtn = emp.linkedin
    ? `<a class="btn btn--primary" href="${escapeHTML(emp.linkedin)}" target="_blank" rel="noreferrer noopener">LinkedIn</a>`
    : "";
  const resumeBtn = emp.resume
    ? `<button class="btn btn--ghost" id="resume-btn" type="button">Download resume</button>`
    : "";

  return `
    <button class="back-btn" id="back-btn" aria-label="Back to search">← Back to search</button>
    <article class="profile">
      <div class="profile__cover"></div>
      <div class="profile__body">
        <div class="profile__head">
          <div class="profile__identity">
            <div>
              <h1 class="profile__name">${escapeHTML(emp.name)}</h1>
              <p class="profile__role">${escapeHTML(emp.title)}</p>
            </div>
          </div>
          <div class="profile__actions">${linkedinBtn}${resumeBtn}</div>
        </div>

        <dl class="profile__stats">
          <div><dt>Department</dt><dd>${escapeHTML(emp.department)}</dd></div>
          <div><dt>Seniority</dt><dd>${escapeHTML(emp.rank)}</dd></div>
          <div><dt>Skills</dt><dd>${emp.skills.length}</dd></div>
        </dl>

        <section class="profile__section">
          <h2>About</h2>
          <p class="profile__bio">${escapeHTML(emp.bio)}</p>
        </section>

        <section class="profile__section">
          <h2>Skills</h2>
          <div class="profile__skills">${skills}</div>
        </section>
      </div>
    </article>
  `;
}

// ---------- View switching ----------
function showProfile(emp) {
  $profile.innerHTML = renderProfile(emp);
  $search.classList.remove("view--active");
  $search.hidden = true;
  $profile.hidden = false;
  $profile.classList.add("view--active");
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("back-btn").addEventListener("click", showSearch);

  const $resume = document.getElementById("resume-btn");
  if ($resume) {
    $resume.addEventListener("click", async () => {
      try {
        $resume.disabled = true;
        const filename = `${(emp.name || emp.full_name || "employee").trim().replace(/\s+/g, "_")}_Resume.pdf`;
        const url = await getResumeDownloadUrl(emp.resume, filename);
        if (url) window.open(url, "_blank", "noopener");
      } catch (err) {
        console.error("Resume download failed:", err);
        alert("Couldn't open resume.");
      } finally {
        $resume.disabled = false;
      }
    });
  }
}

function showSearch() {
  $profile.hidden = true;
  $profile.classList.remove("view--active");
  $search.hidden = false;
  $search.classList.add("view--active");
  $input.focus();
}

// ---------- Add person modal ----------
function openModal() {
  $modal.hidden = false;
  $modal.setAttribute("aria-hidden", "false");
  $formError.hidden = true;
  setTimeout(() => $form.querySelector('[name="full_name"]').focus(), 50);
}
function closeModal() {
  $modal.hidden = true;
  $modal.setAttribute("aria-hidden", "true");
  $form.reset();
  document.getElementById("json-form")?.reset();
  document.getElementById("csv-form")?.reset();
  $formError.hidden = true;
  document.getElementById("json-error")?.setAttribute("hidden", "");
  document.getElementById("csv-error")?.setAttribute("hidden", "");
}

$addBtn.addEventListener("click", openModal);
$modal.addEventListener("click", (e) => {
  if (e.target.matches("[data-close]")) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !$modal.hidden) closeModal();
});

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  $formError.hidden = true;

  const fd = new FormData($form);
  const resumeFile = fd.get("resume");
  const hasResume = resumeFile && resumeFile.size > 0;

  if (hasResume && resumeFile.type !== "application/pdf") {
    $formError.textContent = "Resume must be a PDF file.";
    $formError.hidden = false;
    return;
  }

  const skills = String(fd.get("skills") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const payload = {
    full_name: String(fd.get("full_name") || "").trim(),
    role: String(fd.get("role") || "").trim(),
    email: String(fd.get("email") || "").trim().toLowerCase(),
    phone: String(fd.get("phone") || "").trim() || null,
    department: String(fd.get("department") || "").trim() || null,
    rank: String(fd.get("rank") || "").trim() || null,
    skills,
    bio: String(fd.get("bio") || "").trim() || null,
    linkedin_url: String(fd.get("linkedin_url") || "").trim() || null,
  };

  if (!payload.full_name || !payload.role || !payload.email || skills.length === 0) {
    $formError.textContent = "Name, role, email, and at least one skill are required.";
    $formError.hidden = false;
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    $formError.textContent = "Please enter a valid email address.";
    $formError.hidden = false;
    return;
  }

  try {
    $submit.disabled = true;
    $submit.textContent = "Adding…";
    await createEmployee(payload, { resumeFile: hasResume ? resumeFile : null });
    EMPLOYEES = await getAllEmployees();
    renderResults();
    closeModal();
  } catch (err) {
    console.error("Add failed:", err);
    $formError.textContent = err.message || "Couldn't add this person.";
    $formError.hidden = false;
  } finally {
    $submit.disabled = false;
    $submit.textContent = "Add person";
  }
});

// ---------- Tab switching ----------
const $tabs = document.querySelectorAll(".tab");
const $panels = document.querySelectorAll(".tab-panel");
$tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const name = tab.dataset.tab;
    $tabs.forEach((t) => {
      const active = t.dataset.tab === name;
      t.classList.toggle("tab--active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });
    $panels.forEach((p) => {
      const active = p.dataset.panel === name;
      p.classList.toggle("tab-panel--active", active);
      p.hidden = !active;
    });
  });
});

// ---------- JSON import ----------
const $jsonForm = document.getElementById("json-form");
const $jsonError = document.getElementById("json-error");
const $jsonSubmit = document.getElementById("json-submit");

async function readFileText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = () => reject(r.error);
    r.readAsText(file);
  });
}

$jsonForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  $jsonError.hidden = true;
  const fd = new FormData($jsonForm);
  const file = fd.get("json_file");
  const text = String(fd.get("json_text") || "").trim();
  let raw = text;
  try {
    if (file && file.size > 0) raw = await readFileText(file);
    if (!raw) throw new Error("Provide a JSON file or paste JSON.");
    const parsed = JSON.parse(raw);
    const rows = Array.isArray(parsed) ? parsed : [parsed];
    $jsonSubmit.disabled = true;
    $jsonSubmit.textContent = "Importing…";
    const n = await importEmployeesFromJSON(rows);
    EMPLOYEES = await getAllEmployees();
    renderResults();
    closeModal();
    alert(`Imported ${n} ${n === 1 ? "person" : "people"}.`);
  } catch (err) {
    console.error("JSON import failed:", err);
    $jsonError.textContent = err.message || "Couldn't import JSON.";
    $jsonError.hidden = false;
  } finally {
    $jsonSubmit.disabled = false;
    $jsonSubmit.textContent = "Import JSON";
  }
});

// ---------- CSV import ----------
const $csvForm = document.getElementById("csv-form");
const $csvError = document.getElementById("csv-error");
const $csvSubmit = document.getElementById("csv-submit");

/** Minimal RFC4180-ish CSV parser (handles quoted fields, escaped quotes, CRLF). */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (c === "\r") { /* ignore */ }
      else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length && r.some((v) => v !== ""));
}

function csvToEmployeeRows(text) {
  const rows = parseCSV(text);
  if (rows.length < 2) throw new Error("CSV needs a header row and at least one data row.");
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1).map((r) => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (r[i] ?? "").trim(); });
    return {
      full_name: obj.full_name || obj.name || "",
      role: obj.role || obj.title || "",
      department: obj.department || null,
      rank: obj.rank || null,
      skills: String(obj.skills || "")
        .split(/[;,]/)
        .map((s) => s.trim())
        .filter(Boolean),
      bio: obj.bio || null,
      linkedin_url: obj.linkedin_url || obj.linkedin || null,
    };
  });
}

$csvForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  $csvError.hidden = true;
  const fd = new FormData($csvForm);
  const file = fd.get("csv_file");
  const text = String(fd.get("csv_text") || "");
  let raw = text;
  try {
    if (file && file.size > 0) raw = await readFileText(file);
    if (!raw.trim()) throw new Error("Provide a CSV file or paste CSV.");
    const rows = csvToEmployeeRows(raw);
    if (rows.length === 0) throw new Error("No rows found in CSV.");
    $csvSubmit.disabled = true;
    $csvSubmit.textContent = "Importing…";
    const n = await importEmployeesFromJSON(rows);
    EMPLOYEES = await getAllEmployees();
    renderResults();
    closeModal();
    alert(`Imported ${n} ${n === 1 ? "person" : "people"}.`);
  } catch (err) {
    console.error("CSV import failed:", err);
    $csvError.textContent = err.message || "Couldn't import CSV.";
    $csvError.hidden = false;
  } finally {
    $csvSubmit.disabled = false;
    $csvSubmit.textContent = "Import CSV";
  }
});

// ---------- Search wiring ----------
$input.addEventListener("input", renderResults);
$clear.addEventListener("click", () => {
  $input.value = "";
  renderResults();
  $input.focus();
});

// ---------- Init ----------
(async function init() {
  $count.textContent = "Loading…";
  try {
    EMPLOYEES = await getAllEmployees();
    renderResults();
  } catch (err) {
    console.error("Failed to load employees:", err);
    $count.textContent = "Failed to load directory";
    $empty.hidden = false;
    $emptyText.textContent = "Couldn't reach the database. Please refresh.";
  }
})();
