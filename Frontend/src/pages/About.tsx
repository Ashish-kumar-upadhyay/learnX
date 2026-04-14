import { Link } from "react-router-dom";
import { GraduationCap, Target, Rocket, HeartHandshake } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9fc] via-background to-[#eef4ff] dark:from-[#0b1220] dark:via-[#0f172a] dark:to-[#111827] relative overflow-hidden">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute top-[-8%] left-[-6%] w-[360px] h-[360px] bg-sky-500/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-6%] w-[300px] h-[300px] bg-pink-500/15 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 md:px-16 py-6">
        <nav className="mb-12 flex items-center justify-between">
          <Link to="/auth" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">LearnX</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link to="/about" className="text-sm text-foreground font-semibold">About</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>
        </nav>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-border/60 dark:border-white/15 bg-white/70 dark:bg-[#111827]/75 backdrop-blur-md p-8">
            <h1 className="text-4xl md:text-5xl font-black text-foreground dark:text-slate-100 tracking-tight">About LearnX</h1>
            <p className="mt-4 text-muted-foreground dark:text-slate-300 leading-relaxed">
              LearnX is designed to simplify modern education with a focused experience for students, teachers, and administrators.
              Our mission is to blend technology and pedagogy in a way that feels intuitive, fast, and genuinely helpful.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              { icon: Target, title: "Our Mission", text: "Deliver calm, high-impact digital learning workflows." },
              { icon: Rocket, title: "Our Vision", text: "Empower institutions with intelligent and scalable tools." },
              { icon: HeartHandshake, title: "Our Promise", text: "Student-first design, teacher productivity, admin clarity." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/60 dark:border-white/15 bg-white/65 dark:bg-[#111827]/75 backdrop-blur-md p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 text-white flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground dark:text-slate-100">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground dark:text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
