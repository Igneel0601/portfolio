"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { CONTACT, CONTACT_PAGE } from "@/lib/content";

// Shared /contact body — validating form + direct-links rail (from the
// wireframe). NOTE: the send is currently SIMULATED (no backend) — it animates
// a send sequence but doesn't deliver. Wire a real /api/contact (Resend) or a
// mailto handoff before relying on it.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Values = { name: string; email: string; message: string; company: string };
type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "name required — even a fake one";
  else if (v.name.trim().length < 2) e.name = "that's not a name";
  if (!v.email.trim()) e.email = "email required";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "that's not a valid email";
  if (!v.message.trim()) e.message = "say something";
  else if (v.message.trim().length < 10) e.message = "a few more words (min 10)";
  return e;
}

function SendLog({ done }: { done: boolean }) {
  const lines = [
    `$ ./send.sh --to ${CONTACT.email}`,
    "[ ok ] validating fields",
    "[ ok ] honeypot clear",
    "[ .. ] delivering message…",
  ];
  return (
    <div className="ct-sendlog">
      {lines.map((l, i) => (
        <div className="ct-sendline" style={{ animationDelay: `${i * 0.18}s` }} key={i}>
          {l}
        </div>
      ))}
      <div className="ct-sendline" style={{ animationDelay: "0.85s" }}>
        {done ? "[ ok ] queued in 0.31s" : "delivering…"}
      </div>
    </div>
  );
}

export function ContactPage() {
  const [v, setV] = useState<Values>({ name: "", email: "", message: "", company: "" });
  const [touched, setTouched] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const errors = validate(v);
  const hasErr = Object.keys(errors).length > 0;

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV((p) => ({ ...p, [k]: e.target.value }));
  const blur = (k: Field) => () => setTouched((p) => ({ ...p, [k]: "1" }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: "1", email: "1", message: "1" });
    if (hasErr) return;
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      if (!res.ok) throw new Error("send failed");
      setState("sent");
    } catch {
      setState("error");
    }
  };
  const reset = () => {
    setV({ name: "", email: "", message: "", company: "" });
    setTouched({});
    setState("idle");
  };

  const links = [
    { k: "email", v: CONTACT.email, href: `mailto:${CONTACT.email}`, ext: false },
    { k: "github", v: "github.com/Igneel0601", href: CONTACT.github, ext: true },
    { k: "linkedin", v: "linkedin.com/in/…", href: CONTACT.linkedin, ext: true },
    { k: "x", v: "x.com/…", href: CONTACT.x, ext: true },
  ];

  return (
    <main className="flex-1">
      <section className="page-shell contact pt-[clamp(1.25rem,2.5vw,1.75rem)]">
        <div className="l-eyebrow text-ink-dim mt-2">{CONTACT_PAGE.eyebrow}</div>
        <h1 className="t-display mt-3">
          contact<span className="text-accent">.</span>
        </h1>
        <p className="t-lead mt-4 max-w-[28ch] text-ink-soft italic">A working inbox and a few faster ways to reach me — for full-time roles or freelance.</p>

        <div className="ab-cmd c-sm">
          <span className="ab-prompt">$</span> mail -s &quot;hello&quot;
          <span>
            <span className="ab-sep">·</span>avg reply ~1 business day
          </span>
        </div>

        <div className="ct-grid">
          {/* form */}
          <div className="ct-formwrap">
            {state === "sent" ? (
              <div className="ct-sent">
                <SendLog done />
                <div className="ct-sentbig">
                  message sent<span className="text-accent">.</span>
                </div>
                <p className="ct-sentnote">
                  It&apos;s in the queue. I usually reply within a day or two — if it&apos;s
                  urgent, just email me directly.
                </p>
                <button className="ct-btn ghost" onClick={reset}>
                  $ send another
                </button>
              </div>
            ) : state === "sending" ? (
              <div className="ct-sent">
                <SendLog done={false} />
              </div>
            ) : state === "error" ? (
              <div className="ct-sent">
                <div className="ct-sendlog">
                  <div className="ct-sendline" style={{ color: "var(--status-dead)" }}>
                    ✗ delivery failed
                  </div>
                </div>
                <div className="ct-sentbig">
                  that didn&apos;t go through<span className="text-accent">.</span>
                </div>
                <p className="ct-sentnote">
                  Something broke on the way out. Email me directly at{" "}
                  <a href={`mailto:${CONTACT.email}`} className="ab-link no-pop">
                    {CONTACT.email}
                  </a>
                  .
                </p>
                <button className="ct-btn ghost" onClick={reset}>
                  $ try again
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={v.company}
                  onChange={set("company")}
                  style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
                />
                <div className={"ct-field" + (touched.name && errors.name ? " err" : "")}>
                  <label htmlFor="f-name" className="ct-label">
                    <span>name</span>
                    {touched.name && errors.name ? (
                      <span className="ct-err">✗ {errors.name}</span>
                    ) : (
                      <span className="ct-hint">what to call you</span>
                    )}
                  </label>
                  <input
                    id="f-name"
                    className="ct-input"
                    type="text"
                    autoComplete="name"
                    placeholder="ada lovelace"
                    value={v.name}
                    onChange={set("name")}
                    onBlur={blur("name")}
                  />
                </div>

                <div className={"ct-field" + (touched.email && errors.email ? " err" : "")}>
                  <label htmlFor="f-email" className="ct-label">
                    <span>email</span>
                    {touched.email && errors.email ? (
                      <span className="ct-err">✗ {errors.email}</span>
                    ) : (
                      <span className="ct-hint">for my reply</span>
                    )}
                  </label>
                  <input
                    id="f-email"
                    className="ct-input"
                    type="email"
                    autoComplete="email"
                    placeholder="you@domain.dev"
                    value={v.email}
                    onChange={set("email")}
                    onBlur={blur("email")}
                  />
                </div>

                <div className={"ct-field" + (touched.message && errors.message ? " err" : "")}>
                  <label htmlFor="f-msg" className="ct-label">
                    <span>message</span>
                    {touched.message && errors.message ? (
                      <span className="ct-err">✗ {errors.message}</span>
                    ) : (
                      <span className="ct-hint">{v.message.trim().length}/10+</span>
                    )}
                  </label>
                  <textarea
                    id="f-msg"
                    className="ct-input area"
                    rows={5}
                    placeholder="tell me what you're building…"
                    value={v.message}
                    onChange={set("message")}
                    onBlur={blur("message")}
                  />
                </div>

                <div className="ct-actions">
                  <button className="btn term-a" type="submit">
                    $ send message →
                  </button>
                  <span className="ct-nospam">no spam. no list. just me.</span>
                </div>
              </form>
            )}
          </div>

          {/* direct-links rail */}
          <aside className="ct-rail">
            <div className="ct-avail">
              <span className="ct-availdot" aria-hidden />
              <div>
                <div className="ct-availt">{CONTACT_PAGE.availability.title}</div>
                <div className="ct-avails">{CONTACT_PAGE.availability.sub}</div>
              </div>
            </div>

            <div className="ct-links">
              {links.map((d) => (
                <a
                  key={d.k}
                  href={d.href}
                  className="ct-link no-pop"
                  target={d.ext ? "_blank" : undefined}
                  rel={d.ext ? "noopener" : undefined}
                >
                  <span className="ct-k">{d.k}</span>
                  <span className="ct-v">{d.v}</span>
                  {d.ext ? (
                    <ExternalLink className="i-xs ct-ar" aria-hidden />
                  ) : (
                    <span className="ct-ar" aria-hidden>
                      @
                    </span>
                  )}
                </a>
              ))}
            </div>

            <div className="ab-rail ct-metarail">
              {CONTACT_PAGE.meta.map((m) => (
                <div className="ab-row" key={m.k}>
                  <span className="ab-k">{m.k}</span>
                  <span className="ab-v">{m.v}</span>
                </div>
              ))}
            </div>

            <p className="ct-ps">
              Not sure what to say? Skim{" "}
              <Link href="/now" className="ab-link no-pop">
                /now
              </Link>{" "}
              first — it&apos;s a decent conversation starter.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
