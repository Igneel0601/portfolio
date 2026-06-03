import { NextResponse } from "next/server";
import { CONTACT } from "@/lib/content";

// Contact form → email via Resend's REST API (no SDK dependency). Needs
// RESEND_API_KEY in env. `from` = RESEND_EMAIL (a Resend-verified sender, e.g.
// "Vaibhav <hi@vergnyx.dev>"); falls back to Resend's onboarding address (test
// mode delivers only to the account owner) when RESEND_EMAIL is unset.
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string; company?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  // Honeypot — bots fill the hidden "company" field. Pretend success, drop it.
  if (body.company) return NextResponse.json({ ok: true });

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();
  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) {
    return NextResponse.json({ error: "validation" }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const from = process.env.RESEND_EMAIL || "Portfolio <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [CONTACT.email],
      reply_to: email,
      subject: `Portfolio contact — ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "send failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
