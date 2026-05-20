/* =========================================================
   Skills Directory — vanilla JS
   Hardcoded mock data, search filtering, view switching
   ========================================================= */

// ---------- Mock data (swap for a fetch() later) ----------
const EMPLOYEES = [
  {
    id: "1",
    name: "Amelia Chen",
    title: "Senior Software Engineer",
    department: "Engineering",
    rank: "L5 · Senior",
    avatar: "https://i.pravatar.cc/240?img=47",
    skills: ["Python", "TypeScript", "Distributed Systems", "PostgreSQL", "Kubernetes", "GraphQL"],
    bio: "Backend specialist focused on scaling event-driven platforms. Previously built payments infrastructure at two fintechs.",
    linkedin: "https://linkedin.com",
    resume: "#",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    title: "Lead UX Researcher",
    department: "Design",
    rank: "L6 · Lead",
    avatar: "https://i.pravatar.cc/240?img=12",
    skills: ["UX Research", "Usability Testing", "Figma", "Survey Design", "Ethnography"],
    bio: "Mixed-methods researcher partnering with product to turn qualitative insight into shipped decisions.",
    linkedin: "https://linkedin.com",
    resume: "#",
  },
  {
    id: "3",
    name: "Priya Raman",
    title: "Data Analyst",
    department: "Business Intelligence",
    rank: "L4 · Mid",
    avatar: "https://i.pravatar.cc/240?img=45",
    skills: ["SQL", "Python", "Tableau", "dbt", "Statistics", "A/B Testing"],
    bio: "Turns messy operational data into clear narratives. Owns the growth analytics stack.",
    linkedin: "https://linkedin.com",
    resume: "#",
  },
  {
    id: "4",
    name: "Diego Alvarez",
    title: "Senior Product Manager",
    department: "Product",
    rank: "L5 · Senior",
    avatar: "https://i.pravatar.cc/240?img=33",
    skills: ["Product Strategy", "Roadmapping", "Discovery", "SQL", "Stakeholder Management"],
    bio: "Ships customer-facing products at the intersection of platform and growth. Ex-consultant.",
    linkedin: "https://linkedin.com",
    resume: "#",
  },
  {
    id: "5",
    name: "Hannah Weiss",
    title: "Financial Analyst",
    department: "Finance",
    rank: "L3 · Associate",
    avatar: "https://i.pravatar.cc/240?img=49",
    skills: ["Financial Modeling", "Excel", "Forecasting", "Valuation", "Power BI"],
    bio: "FP&A analyst supporting GTM. Builds three-statement models and rolling forecasts.",
    linkedin: "https://linkedin.com",
    resume: "#",
  },
  {
    id: "6",
    name: "Kenji Okafor",
    title: "DevOps Engineer",
    department: "Platform",
    rank: "L4 · Mid",
    avatar: "https://i.pravatar.cc/240?img=15",
    skills: ["Terraform", "AWS", "Kubernetes", "CI/CD", "Observability", "Go"],
    bio: "Keeps the lights on. Designs deploy pipelines and golden paths for product teams.",
    linkedin: "https://linkedin.com",
    resume: "#",
  },
  {
    id: "7",
    name: "Sofia Lindqvist",
    title: "Machine Learning Engineer",
    department: "Engineering",
    rank: "L5 · Senior",
    avatar: "https://i.pravatar.cc/240?img=20",
    skills: ["Python", "PyTorch", "MLOps", "NLP", "Vector Search"],
    bio: "Builds production ML systems for search and recommendations. Loves clean evaluation pipelines.",
    linkedin: "https://linkedin.com",
    resume: "#",
  },
  {
    id: "8",
    name: "Jordan Bailey",
    title: "Product Designer",
    department: "Design",
    rank: "L4 · Mid",
    avatar: "https://i.pravatar.cc/240?img=68",
    skills: ["Figma", "Design Systems", "Prototyping", "Accessibility", "Motion"],
    bio: "Systems-minded designer focused on accessible, fast interfaces.",
    linkedin: "https://linkedin.com",
    resume: "#",
  },
];

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

/** Escape user-controlled strings so we can safely use innerHTML. */
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

/** Escape a string for safe use inside a RegExp. */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Wrap matches of `query` inside `text` with <mark>...</mark>. */
function highlight(text, query) {
  const safe = escapeHTML(text);
  const q = query.trim();
  if (!q) return safe;
  const re = new RegExp(`(${escapeRegex(escapeHTML(q))})`, "ig");
  return safe.replace(re, "<mark>$1</mark>");
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
      return `<span class="chip ${matched ? "chip--matched" : ""}">${highlight(s, query)}</span>`;
    })
    .join("");

  return `
    <button class="card" data-id="${emp.id}" aria-label="Open profile for ${escapeHTML(emp.name)}">
      <div class="card__head">
        <img class="card__avatar" src="${emp.avatar}" alt="" loading="lazy" width="56" height="56" />
        <div class="card__info">
          <h3 class="card__name">${highlight(emp.name, query)}</h3>
          <p class="card__title">${highlight(emp.title, query)}</p>
          <div class="card__meta">
            <span>🏢 ${highlight(emp.department, query)}</span>
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
    $emptyText.textContent = `We couldn't find anyone matching "${query}". Try a broader skill or check spelling.`;
    return;
  }

  $empty.hidden = true;
  $results.innerHTML = list.map((emp) => renderCard(emp, query)).join("");

  // Wire up card clicks (event delegation would also work)
  $results.querySelectorAll(".card").forEach((node) => {
    node.addEventListener("click", () => {
      const emp = EMPLOYEES.find((e) => e.id === node.dataset.id);
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
            <a class="btn btn--primary" href="${emp.linkedin}" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
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

renderResults();
