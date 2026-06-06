import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendWelcomeEmail } from "@/lib/email";

export const runtime = "nodejs";

interface ClerkEmail {
  id: string;
  email_address: string;
}

interface ClerkUserPayload {
  id: string;
  email_addresses?: ClerkEmail[];
  primary_email_address_id?: string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  image_url?: string | null;
}

interface ClerkWebhookEvent {
  type: string;
  data: ClerkUserPayload;
}

function primaryEmail(user: ClerkUserPayload): string {
  if (!user.email_addresses?.length) return "";
  if (user.primary_email_address_id) {
    const match = user.email_addresses.find((e) => e.id === user.primary_email_address_id);
    if (match) return match.email_address;
  }
  return user.email_addresses[0].email_address;
}

function fullName(user: ClerkUserPayload): string | null {
  const parts = [user.first_name, user.last_name].filter(Boolean);
  return parts.length ? parts.join(" ") : null;
}

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SIGNING_SECRET is not set");
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  // Svix signature headers (set by Clerk)
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();

  let event: ClerkWebhookEvent;
  try {
    event = new Webhook(secret).verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const user = event.data;

  switch (event.type) {
    case "user.created": {
      const email = primaryEmail(user);
      const { error } = await supabase.from("users").upsert(
        [{ id: user.id, email, full_name: fullName(user), username: user.username ?? null, avatar_url: user.image_url ?? null }],
        { onConflict: "id" }
      );
      if (error) {
        console.error("Supabase upsert failed:", error);
        return NextResponse.json({ error: "DB upsert failed" }, { status: 500 });
      }
      // Fire welcome email — non-blocking, failures are logged but not surfaced
      void sendWelcomeEmail(email, user.first_name ?? "there");
      return NextResponse.json({ ok: true, action: event.type, id: user.id });
    }

    case "user.updated": {
      const { error } = await supabase.from("users").upsert(
        [{ id: user.id, email: primaryEmail(user), full_name: fullName(user), username: user.username ?? null, avatar_url: user.image_url ?? null }],
        { onConflict: "id" }
      );
      if (error) {
        console.error("Supabase upsert failed:", error);
        return NextResponse.json({ error: "DB upsert failed" }, { status: 500 });
      }
      return NextResponse.json({ ok: true, action: event.type, id: user.id });
    }

    case "user.deleted": {
      const { error } = await supabase.from("users").delete().eq("id", user.id);
      if (error) {
        console.error("Supabase delete failed:", error);
        return NextResponse.json({ error: "DB delete failed" }, { status: 500 });
      }
      return NextResponse.json({ ok: true, action: "user.deleted", id: user.id });
    }

    default:
      // Ignore other event types — return 200 so Clerk doesn't retry.
      return NextResponse.json({ ok: true, ignored: event.type });
  }
}
