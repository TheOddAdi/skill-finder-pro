/* =========================================================
   Skills Directory — vanilla JS UI
   Data layer lives in /public/logic/employees.js (Lovable Cloud).
   This file only renders + filters in memory.
   ========================================================= */
import { getAllEmployees, getEmployeeById } from "./logic/employees.js";

// In-memory cache of all employees (fetched once on load, refreshed on demand).
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

// ---------- Utilities ----------
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
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
        <img class="card__avatar" src="${emp.avatar}" alt="" loading="lazy" width="56" height="56" />
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
      : "No employees yet.";
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

  return `
    <button class="back-btn" id="back-btn" aria-label="Back to search">
      ← Back to search
    </button>
    <article class="profile">
      <div class="profile__cover"></div>
      <div class="profile__body">
        <div class="profile__head">
          <div class="profile__identity">
            <img class="profile__avatar" src="${emp.avatar}" alt="${escapeHTML(emp.name)}" />
            <div>
              <h1 class="profile__name">${escapeHTML(emp.name)}</h1>
              <p class="profile__role">${escapeHTML(emp.title)}</p>
            </div>
          </div>
          <div class="profile__actions">
            <a class="btn btn--primary" href="${emp.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a>
            <a class="btn btn--ghost" href="${emp.resume}">Resume</a>
          </div>
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
}

function showSearch() {
  $profile.hidden = true;
  $profile.classList.remove("view--active");
  $search.hidden = false;
  $search.classList.add("view--active");
  $input.focus();
}

// ---------- Init ----------
$input.addEventListener("input", renderResults);
$clear.addEventListener("click", () => {
  $input.value = "";
  renderResults();
  $input.focus();
});

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
