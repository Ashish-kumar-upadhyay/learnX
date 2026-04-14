import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin, Send } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9fc] via-background to-[#eef4ff] dark:from-[#0b1220] dark:via-[#0f172a] dark:to-[#111827] relative overflow-hidden">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute top-[-10%] right-[-5%] w-[380px] h-[380px] bg-primary/10 rounded-full blur-[110px] pointer-events-none" />

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
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/contact" className="text-sm text-foreground font-semibold">Contact</Link>
          </div>
        </nav>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-border/60 dark:border-white/15 bg-white/70 dark:bg-[#111827]/75 backdrop-blur-md p-8">
            <h1 className="text-4xl font-black text-foreground dark:text-slate-100 tracking-tight">Let's Connect</h1>
            <p className="mt-3 text-muted-foreground dark:text-slate-300">
              Have questions or want a demo? Reach out and our team will help you get started quickly.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground dark:text-slate-300">
                <Mail className="w-4 h-4 text-primary" />
                <span>hello@learnx.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground dark:text-slate-300">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 90000 00000</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground dark:text-slate-300">
                <MapPin className="w-4 h-4 text-primary" />
                <span>India, Remote-First Team</span>
              </div>
            </div>
          </div>

          <form className="rounded-3xl border border-border/60 dark:border-white/15 bg-white/70 dark:bg-[#111827]/75 backdrop-blur-md p-8 space-y-4">
            <input className="w-full rounded-xl border border-border/60 dark:border-white/15 bg-white/80 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="Your Name" />
            <input className="w-full rounded-xl border border-border/60 dark:border-white/15 bg-white/80 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="Email Address" />
            <textarea className="w-full min-h-[130px] rounded-xl border border-border/60 dark:border-white/15 bg-white/80 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="How can we help?" />
            <button type="button" className="w-full rounded-xl bg-primary text-primary-foreground font-semibold py-3 flex items-center justify-center gap-2 hover:opacity-95 transition">
              Send Message <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
