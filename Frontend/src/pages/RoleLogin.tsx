import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE, setTokens } from "@/lib/backendApi";
import {
  GraduationCap, Mail, Lock, Eye, EyeOff, User, ArrowLeft,
  School, ShieldCheck, Zap, Sparkles, Clock
} from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";

const roleConfig = {
  student: {
    label: "Student",
    icon: GraduationCap,
    gradient: "linear-gradient(135deg, hsl(220 90% 56%), hsl(260 50% 58%))",
    bgGradient: "linear-gradient(135deg, hsl(220 90% 56% / 0.15), hsl(260 50% 58% / 0.08))",
    glowColor: "hsl(220 90% 56% / 0.4)",
    heading: "Ready to learn?",
    subheading: "Your campus journey starts here",
    demo: { email: "student@demo.com", password: "123456" },
  },
  teacher: {
    label: "Teacher",
    icon: School,
    gradient: "linear-gradient(135deg, hsl(260 50% 58%), hsl(190 80% 50%))",
    bgGradient: "linear-gradient(135deg, hsl(260 50% 58% / 0.15), hsl(190 80% 50% / 0.08))",
    glowColor: "hsl(260 50% 58% / 0.4)",
    heading: "Teacher Portal",
    subheading: "Manage your classes and students",
    demo: { email: "teacher@demo.com", password: "123456" },
  },
  admin: {
    label: "Admin",
    icon: ShieldCheck,
    gradient: "linear-gradient(135deg, hsl(0 72% 51%), hsl(38 92% 50%))",
    bgGradient: "linear-gradient(135deg, hsl(0 72% 51% / 0.15), hsl(38 92% 50% / 0.08))",
    glowColor: "hsl(0 72% 51% / 0.4)",
    heading: "System Control",
    subheading: "Full platform access",
    demo: { email: "admin@demo.com", password: "123456" },
  },
};

type RoleKey = "student" | "teacher" | "admin";

const demoAccounts = [
  { role: "Student", email: "student@demo.com", password: "123456", icon: GraduationCap, gradient: "linear-gradient(135deg, hsl(220 90% 56%), hsl(260 50% 58%))" },
  { role: "Teacher", email: "teacher@demo.com", password: "123456", icon: School, gradient: "linear-gradient(135deg, hsl(260 50% 58%), hsl(190 80% 50%))" },
  { role: "Admin", email: "admin@demo.com", password: "123456", icon: ShieldCheck, gradient: "linear-gradient(135deg, hsl(0 72% 51%), hsl(38 92% 50%))" },
];

export default function RoleLogin() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { refreshProfile, signOut } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [className, setClassName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [waitingApproval, setWaitingApproval] = useState(false);

  const validRole = (role && role in roleConfig ? role : "student") as RoleKey;
  const config = roleConfig[validRole];
  const RoleIcon = config.icon;

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: demoPassword }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.data) {
        throw new Error(json?.message || json?.errors?.[0] || "Demo login failed");
      }

      setTokens({ accessToken: json.data.accessToken, refreshToken: json.data.refreshToken });
      await refreshProfile();

      const roles = (json.data.user?.roles || []) as string[];
      toast.success("Welcome to LearnX! 🎉");
      if (roles.includes("admin")) navigate("/admin");
      else if (roles.includes("teacher")) navigate("/teacher");
      else navigate("/");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Demo login failed";
      if (msg.toLowerCase().includes("failed to fetch")) {
        toast.error("Backend server unreachable. Ensure backend runs on http://localhost:5000");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.data) throw new Error(json?.message || "Login failed");

        setTokens({ accessToken: json.data.accessToken, refreshToken: json.data.refreshToken });
        await refreshProfile();

        const roles = (json.data.user?.roles || []) as string[];
        toast.success("Welcome back!");
        if (roles.includes("admin")) navigate("/admin");
        else if (roles.includes("teacher")) navigate("/teacher");
        else navigate("/");
      } else {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
            role: validRole,
            class_name: validRole === "student" ? (className || null) : (className || null),
          }),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.data) throw new Error(json?.message || "Register failed");

        setTokens({ accessToken: json.data.accessToken, refreshToken: json.data.refreshToken });
        await refreshProfile();

        const roles = (json.data.user?.roles || []) as string[];
        toast.success("Account created!");
        if (roles.includes("admin")) navigate("/admin");
        else if (roles.includes("teacher")) navigate("/teacher");
        else navigate("/");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Auth failed";
      if (msg.toLowerCase().includes("failed to fetch")) {
        toast.error("Backend server unreachable. Start backend and try again.");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background transition-colors duration-500">
      {/* Theme toggle */}
      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      {/* ===== LEFT SIDE - Illustration ===== */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hidden lg:flex w-[42%] relative overflow-hidden items-center justify-center"
        style={{ background: config.bgGradient }}
      >
        {/* Floating glass shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[10%] w-32 h-32 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm"
            style={{ transform: "rotate(12deg)" }}
          />
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[20%] right-[8%] w-24 h-24 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
            style={{ transform: "rotate(-8deg)" }}
          />
          <motion.div
            animate={{ y: [0, 10, 0], x: [0, -8, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[55%] left-[18%] w-20 h-20 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
          />

          {/* Blur circles */}
          <div
            className="absolute top-[25%] right-[20%] w-48 h-48 rounded-full blur-[80px] opacity-60"
            style={{ background: config.glowColor }}
          />
          <div
            className="absolute bottom-[30%] left-[15%] w-36 h-36 rounded-full blur-[60px] opacity-40"
            style={{ background: config.glowColor }}
          />
        </div>

        {/* Center content */}
        <div className="relative z-10 text-center px-12">
          {/* Glowing icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative mx-auto mb-8"
          >
            <div
              className="absolute inset-0 w-28 h-28 mx-auto rounded-3xl blur-2xl opacity-50"
              style={{ background: config.gradient }}
            />
            <div
              className="relative w-28 h-28 mx-auto rounded-3xl flex items-center justify-center border border-white/20 backdrop-blur-sm"
              style={{ background: config.gradient }}
            >
              <RoleIcon className="w-14 h-14 text-white drop-shadow-lg" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl font-black text-foreground tracking-tight mb-3"
          >
            {config.heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="text-muted-foreground text-lg"
          >
            {config.subheading}
          </motion.p>

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm text-sm text-muted-foreground"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            Powered by LearnX
          </motion.div>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate("/auth")}
          className="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group z-10"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>
      </motion.div>

      {/* ===== RIGHT SIDE - Login Form ===== */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative"
      >
        {/* Mobile back button */}
        <button
          onClick={() => navigate("/auth")}
          className="lg:hidden absolute top-5 left-5 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        <div className="w-full max-w-[420px]">
          {waitingApproval ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-amber-100 dark:bg-amber-950/30">
                <Clock className="w-10 h-10 text-amber-500" />
              </div>
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">Waiting for Approval</h1>
              <p className="text-muted-foreground text-sm mb-6">Your account has been created. Please wait for your teacher to approve your account before you can log in.</p>
              <div className="rounded-2xl border border-amber-200/50 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-950/20 p-4 mb-6">
                <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">🔔 Your teacher will review and approve your account shortly.</p>
              </div>
              <button onClick={() => { setWaitingApproval(false); setIsLogin(true); }} className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors">
                ← Back to Sign In
              </button>
            </motion.div>
          ) : (
          <>
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg"
              style={{ background: config.gradient }}
            >
              <RoleIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              {isLogin ? `${config.label} Sign In` : `Create ${config.label} Account`}
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5">
              {isLogin ? "Enter your credentials to continue" : "Fill in your details to get started"}
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl p-7 shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.1)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      required={!isLogin}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              {validRole === "student" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block font-medium">
                      Class
                    </label>
                    <div className="relative">
                      <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        placeholder="e.g. CS-2026"
                        required={!isLogin}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block font-medium">
                      Roll No
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                        placeholder="e.g. 101"
                        required={!isLogin}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-muted/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm text-white shadow-lg hover:shadow-xl hover:brightness-110 disabled:opacity-50 transition-all duration-300 relative overflow-hidden group"
                style={{ background: config.gradient }}
              >
                <span className="relative z-10">{loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground">or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                window.location.href = `${API_BASE}/api/auth/google/login`;
              }}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-border/50 bg-muted/20 text-sm font-medium text-foreground hover:bg-muted/40 hover:border-border transition-all duration-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>

            <div className="mt-5 text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>

          {/* Demo Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-6 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-warning" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Quick Demo Access</h3>
            </div>
            <div className="space-y-2">
              {demoAccounts
                .filter((demo) => demo.role.toLowerCase() === validRole)
                .map((demo) => (
                <button
                  key={demo.role}
                  onClick={() => handleDemoLogin(demo.email, demo.password)}
                  disabled={loading}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-muted/20 border border-border/30 hover:bg-muted/40 hover:border-primary/20 transition-all duration-200 text-left group disabled:opacity-50"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ background: demo.gradient }}
                  >
                    <demo.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{demo.role}</p>
                    <p className="text-[11px] text-muted-foreground font-mono truncate">
                      {demo.email}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Login →
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
          </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
