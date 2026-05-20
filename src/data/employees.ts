// Mock employee data. Replace with JSON/CSV fetch later — keep the shape identical.
export type Employee = {
  id: string;
  name: string;
  title: string;
  department: string;
  rank: string;
  avatar: string;
  skills: string[];
  bio: string;
  linkedin: string;
  resume: string;
};

export const employees: Employee[] = [
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
