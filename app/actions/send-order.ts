"use server";

import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Valid email is required"),
  type: z.string().min(1),
  palette: z.array(z.string()).min(1, "Pick at least one colour"),
  budget: z.string().min(1),
  idea: z.string().max(2000).optional().default(""),
});

export type SendOrderResult =
  | { ok: true }
  | { ok: false; error: "config" | "send" | "validation"; message: string };

export async function sendOrder(formData: FormData): Promise<SendOrderResult> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    type: formData.get("type"),
    palette: formData.getAll("palette").map((v) => String(v)),
    budget: formData.get("budget"),
    idea: formData.get("idea") || "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "validation",
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_EMAIL;

  if (!apiKey || apiKey === "re_xxx" || !from || !to) {
    return { ok: false, error: "config", message: "Email not configured." };
  }

  const { name, email, type, palette, budget, idea } = parsed.data;

  const html = `
    <h2 style="font-family: serif; color: #C46B6B;">New custom order request 🪡</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>What:</strong> ${escapeHtml(type)}</p>
    <p><strong>Palette:</strong> ${palette.map(escapeHtml).join(", ")}</p>
    <p><strong>Budget:</strong> ${escapeHtml(budget)}</p>
    <p><strong>Idea:</strong></p>
    <blockquote style="border-left: 3px solid #E08A8A; padding-left: 12px; color: #5C4438;">
      ${escapeHtml(idea).replace(/\n/g, "<br>")}
    </blockquote>
  `;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `🧶 New custom order from ${name}`,
    html,
  });

  if (error) {
    return { ok: false, error: "send", message: "Send failed" };
  }

  return { ok: true };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
