import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const sendMock = vi.fn().mockResolvedValue({ status: 200, text: "OK" });
const initMock = vi.fn();

vi.mock("@emailjs/browser", () => ({
  default: {
    init: initMock,
    send: (...args: unknown[]) => sendMock(...args),
  },
}));

describe("sendWelcomeEmail", () => {
  beforeEach(() => {
    sendMock.mockClear();
    initMock.mockClear();
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "service_test");
    vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "template_test");
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "pk_test");
    vi.stubEnv("VITE_PUBLIC_APP_URL", "https://learnx.example.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("calls EmailJS with magic link (no password fields)", async () => {
    vi.resetModules();
    const { sendWelcomeEmail } = await import("./emailService");
    const result = await sendWelcomeEmail({
      to_email: "newuser@example.com",
      to_name: "Test User",
      user_email: "newuser@example.com",
      role: "Teacher",
      welcomeToken: "a".repeat(64),
    });

    expect(result.ok).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(1);
    const templateParams = sendMock.mock.calls[0][2] as Record<string, string>;
    expect(templateParams.magic_link).toContain("/auth/welcome?token=");
    expect(templateParams.dashboard_url).toBe(templateParams.magic_link);
    expect(templateParams).not.toHaveProperty("password");
    expect(templateParams).not.toHaveProperty("user_password");
    expect(sendMock).toHaveBeenCalledWith(
      "service_test",
      "template_test",
      expect.objectContaining({
        to_email: "newuser@example.com",
        email: "newuser@example.com",
        name: "Test User",
        role: "Teacher",
      }),
      expect.objectContaining({ publicKey: "pk_test" })
    );
  });

  it("returns error when EmailJS responds non-200", async () => {
    sendMock.mockResolvedValueOnce({ status: 400, text: "Template error" });
    vi.resetModules();
    const { sendWelcomeEmail } = await import("./emailService");
    const result = await sendWelcomeEmail({
      to_email: "a@b.com",
      to_name: "A",
      user_email: "a@b.com",
      role: "Student",
      welcomeToken: "b".repeat(64),
    });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/400|EmailJS failed/i);
  });
});
