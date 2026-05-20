import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Linkedin, FileText, Search, Sparkles, Building2, Users } from "lucide-react";
import { employees, type Employee } from "@/data/employees";

export const Route = createFileRoute("/")({
  component: SkillsDirectory,
  head: () => ({
    meta: [
      { title: "Skills Directory — Find experts across the company" },
      {
        name: "description",
        content:
          "Search coworkers by skill, role, or department. Internal directory for finding expertise across teams.",
      },
    ],
  }),
});

/** Highlight matching substrings inside a string. */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="rounded px-0.5"
            style={{ background: "oklch(0.92 0.12 95)", color: "oklch(0.3 0.1 80)" }}
          >
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

function SkillChip({
  skill,
  query,
  matched,
}: {
  skill: string;
  query: string;
  matched?: boolean;
}) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-all " +
        (matched
          ? "border-transparent text-primary-foreground shadow-sm"
          : "border-border bg-secondary text-secondary-foreground hover:border-primary/40 hover:bg-accent")
      }
      style={
        matched
          ? { background: "linear-gradient(135deg, var(--primary), var(--primary-glow))" }
          : undefined
      }
    >
      <Highlight text={skill} query={query} />
    </span>
  );
}

function EmployeeCard({
  emp,
  query,
  onOpen,
}: {
  emp: Employee;
  query: string;
  onOpen: (e: Employee) => void;
}) {
  const q = query.trim().toLowerCase();
  const topSkills = emp.skills.slice(0, 5);
  return (
    <button
      onClick={() => onOpen(emp)}
      className="group relative flex w-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-all duration-200 hover:-translate-y-0.5"
      style={{ boxShadow: "var(--shadow-card)" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-card-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-card)")}
    >
      <div className="flex items-start gap-4">
        <img
          src={emp.avatar}
          alt={`${emp.name} profile`}
          width={56}
          height={56}
          loading="lazy"
          className="h-14 w-14 rounded-full object-cover ring-2 ring-background shadow-sm"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-foreground">
            <Highlight text={emp.name} query={q} />
          </h3>
          <p className="truncate text-sm text-muted-foreground">
            <Highlight text={emp.title} query={q} />
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              <Highlight text={emp.department} query={q} />
            </span>
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {emp.rank}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {topSkills.map((s) => (
          <SkillChip
            key={s}
            skill={s}
            query={q}
            matched={!!q && s.toLowerCase().includes(q)}
          />
        ))}
      </div>
    </button>
  );
}

function ProfileView({ emp, onBack }: { emp: Employee; onBack: () => void }) {
  return (
    <div className="animate-fade-in-up mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to search
      </button>

      <article
        className="overflow-hidden rounded-3xl border border-border bg-card"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div
          className="h-28 sm:h-36"
          style={{
            background:
              "linear-gradient(120deg, var(--primary), var(--primary-glow) 55%, oklch(0.75 0.15 200))",
          }}
        />
        <div className="px-6 pb-8 sm:px-10">
          <div className="-mt-12 flex flex-col items-start gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-5">
              <img
                src={emp.avatar}
                alt={emp.name}
                className="h-24 w-24 rounded-2xl object-cover ring-4 shadow-lg sm:h-32 sm:w-32"
                style={{ boxShadow: "0 8px 30px -8px oklch(0.3 0.15 265 / 0.4)" }}
              />
              <div className="pb-1">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {emp.name}
                </h1>
                <p className="text-sm text-muted-foreground sm:text-base">{emp.title}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pb-1">
              <a
                href={emp.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
              <a
                href={emp.resume}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <FileText className="h-4 w-4" /> Resume
              </a>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Department</dt>
              <dd className="mt-1 text-sm font-medium text-foreground">{emp.department}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Seniority</dt>
              <dd className="mt-1 text-sm font-medium text-foreground">{emp.rank}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Skills</dt>
              <dd className="mt-1 text-sm font-medium text-foreground">{emp.skills.length}</dd>
            </div>
          </dl>

          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              About
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground">{emp.bio}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Skills
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {emp.skills.map((s) => (
                <SkillChip key={s} skill={s} query="" />
              ))}
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}

function SkillsDirectory() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Employee | null>(null);

  // Filter employees by name, title, department, or any skill.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.title.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.skills.some((s) => s.toLowerCase().includes(q)),
    );
  }, [query]);

  if (selected) {
    return <ProfileView emp={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:pt-14">
      <header className="mb-8 text-center sm:mb-12">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Users className="h-3.5 w-3.5" /> Internal Directory
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Find the right expert, fast.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Search coworkers by skill, role, or department — built for finding the right person in
          minutes, not days.
        </p>
      </header>

      {/* Sticky search bar */}
      <div className="sticky top-3 z-20 mx-auto mb-8 max-w-2xl">
        <div
          className="flex items-center gap-3 rounded-2xl border border-border bg-card/90 px-4 py-3 backdrop-blur"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Try "Python", "UX Research", "Financial Modeling"…'
            className="w-full bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            aria-label="Search by skill, name, role, or department"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary"
            >
              Clear
            </button>
          )}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {results.length} {results.length === 1 ? "person" : "people"} found
        </p>
      </div>

      {/* Results grid */}
      {results.length > 0 ? (
        <section
          aria-label="Employee results"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {results.map((emp, i) => (
            <div
              key={emp.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${Math.min(i * 40, 240)}ms` }}
            >
              <EmployeeCard emp={emp} query={query} onOpen={setSelected} />
            </div>
          ))}
        </section>
      ) : (
        <div className="animate-fade-in mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
          <Search className="mx-auto h-8 w-8 text-muted-foreground" />
          <h2 className="mt-3 text-base font-semibold text-foreground">No matches</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We couldn't find anyone matching "{query}". Try a broader skill or check spelling.
          </p>
        </div>
      )}
    </main>
  );
}
