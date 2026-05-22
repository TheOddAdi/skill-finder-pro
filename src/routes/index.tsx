import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * The Skills Directory is now a plain HTML/CSS/JS app served from /public.
 * This route simply redirects to /index.html so visiting "/" still works.
 */
export const Route = createFileRoute("/")({
  component: RedirectToApp,
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

function RedirectToApp() {
  useEffect(() => {
    window.location.replace("/index.html");
  }, []);
  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      Loading Skills Directory…{" "}
      <a href="/index.html">Open directly</a>
    </div>
  );
}
