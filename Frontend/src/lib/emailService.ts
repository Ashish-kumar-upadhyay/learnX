import emailjs from "@emailjs/browser";

/** Set the same IDs in frontend/.env (VITE_*). EmailJS template "To email" should be {{email}} or {{to_email}}. */
const SERVICE_ID =
  (import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined)?.trim() || "service_k8e0522";
const TEMPLATE_ID =
  (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined)?.trim() || "template_j6ni287";
const PUBLIC_KEY =
  (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined)?.trim() || "3yiyAP6dVp6A8p9Uj";

let inited = false;
function ensureEmailJsInit() {
  if (inited || !PUBLIC_KEY) return;
  emailjs.init({ publicKey: PUBLIC_KEY });
  inited = true;
}

/** Public site URL for links inside emails (Vercel). Local admin UI should still send production links. */
export function getPublicAppOrigin(): string {
  const env = (import.meta.env.VITE_PUBLIC_APP_URL as string | undefined)?.trim();
  if (env) return env.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "https://learnx.vercel.app";
}

export function buildWelcomeMagicLink(welcomeToken: string): string {
  const base = getPublicAppOrigin();
  return `${base}/auth/welcome?token=${encodeURIComponent(welcomeToken)}`;
}

export interface WelcomeEmailParams {
  to_email: string;
  to_name: string;
  user_email: string;
  role: string;
  /** One-time token from API after user is created */
  welcomeToken: string;
}

export async function sendWelcomeEmail(
  params: WelcomeEmailParams
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      return { ok: false, error: "EmailJS config missing (service/template/public key)." };
    }
    if (!params.welcomeToken?.trim()) {
      return { ok: false, error: "Welcome token missing — cannot build sign-in link." };
    }

    ensureEmailJsInit();

    const magicLink = buildWelcomeMagicLink(params.welcomeToken);
    const signInUrl = `${getPublicAppOrigin()}/auth`;

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        name: params.to_name,
        email: params.to_email,
        to_email: params.to_email,
        to_name: params.to_name,
        user_email: params.user_email,
        role: params.role,
        platform_name: "LearnX",
        login_url: signInUrl,
        magic_link: magicLink,
        dashboard_url: magicLink,
        button_url: magicLink,
        subject: `Welcome to LearnX — ${params.role}`,
        message: `Hi ${params.to_name}, your LearnX account is ready. Use the secure button in this email to sign in (no password shown here).`,
      },
      { publicKey: PUBLIC_KEY }
    );

    if (response.status === 200) {
      return { ok: true };
    } else {
      return { ok: false, error: `EmailJS failed (${response.status}): ${response.text || "Unknown error"}` };
    }
  } catch (err) {
    if (typeof err === "object" && err !== null) {
      const e = err as any;
      const status = e?.status ? String(e.status) : "";
      const text = e?.text ? String(e.text) : "";
      if (status || text) {
        return { ok: false, error: `EmailJS error ${status}${text ? `: ${text}` : ""}` };
      }
    }
    if (err instanceof Error) {
      return { ok: false, error: err.message };
    }
    return { ok: false, error: "Unknown EmailJS error" };
  }
}
