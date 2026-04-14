import { Link } from "react-router-dom";
import { GraduationCap, Sparkles, Bot, BarChart3, ShieldCheck, Layers } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const featureItems = [
  {
    icon: Bot,
    title: "AI Learning Assistant",
    description: "Personalized suggestions, smart doubt-solving, and 24/7 guided support for learners.",
    color: "from-sky-500 to-blue-600",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track performance trends with visual dashboards for students, teachers, and admins.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: ShieldCheck,
    title: "Secure Role Access",
    description: "Role-based modules with safe auth flows and protected data access across the platform.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Layers,
    title: "Unified Workflow",
    description: "Assignments, attendance, communication, and reports in one consistent interface.",
    color: "from-emerald-500 to-cyan-600",
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9fc] via-background to-[#eef4ff] dark:from-[#0b1220] dark:via-[#0f172a] dark:to-[#111827] relative overflow-hidden">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute top-[-10%] right-[-5%] w-[420px] h-[420px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-12%] left-[-8%] w-[320px] h-[320px] bg-violet-500/15 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 md:px-16 py-6">
        <nav className="mb-12 flex items-center justify-between">
          <Link to="/auth" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">LearnX</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-sm text-foreground font-semibold">Features</Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>
        </nav>

        <header className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-white/10 border border-border/60 px-3 py-1.5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-muted-foreground dark:text-slate-300">Powerful, modern, and scalable</span>
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-black text-foreground dark:text-slate-100 tracking-tight">
            Features That Make Learning
            <span className="block bg-gradient-to-r from-sky-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
              Engaging & Effective
            </span>
          </h1>
          <p className="mt-4 text-muted-foreground dark:text-slate-300 max-w-2xl">
            LearnX combines AI intelligence, streamlined tools, and clean workflows to improve outcomes for every role.
          </p>
        </header>

        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          {featureItems.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border/60 dark:border-white/15 bg-white/70 dark:bg-[#111827]/75 backdrop-blur-md p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-md`}>
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-foreground dark:text-slate-100">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground dark:text-slate-300">{feature.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
