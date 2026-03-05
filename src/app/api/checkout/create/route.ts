import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      clubId,
      clubName,
      hostProfileId,
      hostName,
      guestsCount,
      requested_date,
      requested_date_2,
      requested_date_3,
    } = body || {};

    if (!clubId || !hostProfileId || !requested_date || !guestsCount) {
      return NextResponse.json(
        { error: "Missing booking details." },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Identify signed-in user (guest)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    }

    // Get booking fee from clubs
    const { data: club, error: clubErr } = await supabase
      .from("clubs")
      .select("id,booking_fee_gbp,guests_max,name")
      .eq("id", clubId)
      .single();

    if (clubErr || !club) {
      return NextResponse.json(
        { error: "Club not found." },
        { status: 404 }
      );
    }

    const guestsMax = club.guests_max === 2 ? 2 : 1;
    const safeGuestsCount = guestsMax === 1 ? 1 : guestsCount === 2 ? 2 : 1;

    const bookingFee = Number(club.booking_fee_gbp || 0);
    if (bookingFee <= 0) {
      return NextResponse.json(
        { error: "Booking fee not set for this club yet." },
        { status: 400 }
      );
    }

    const bookingFeeTotal = bookingFee * safeGuestsCount;

    // Create booking request row first (draft)
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();

    const { data: br, error: brErr } = await supabase
      .from("booking_requests")
      .insert({
        guest_user_id: user.id,
        host_profile_id: hostProfileId,
        club_id: clubId,
        guests_count: safeGuestsCount,
        requested_date,
        requested_date_2: requested_date_2 || null,
        requested_date_3: requested_date_3 || null,
        status: "draft",
        expires_at: expiresAt,
        booking_fee_total_gbp: bookingFeeTotal,
      })
      .select("id")
      .single();

    if (brErr || !br) {
      return NextResponse.json(
        { error: brErr?.message || "Failed to create booking request." },
        { status: 500 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    // Stripe Checkout Session with manual capture (authorisation hold)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email ?? undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "gbp",
            unit_amount: Math.round(bookingFeeTotal * 100),
            product_data: {
              name: `Members Time booking fee`,
              description: `${clubName || club.name} · Host ${hostName || "Member host"} · ${safeGuestsCount} guest(s)`,
            },
          },
        },
      ],
      payment_intent_data: {
        capture_method: "manual",
        metadata: {
          booking_request_id: br.id,
          club_id: clubId,
          host_profile_id: hostProfileId,
          guest_user_id: user.id,
        },
      },
      metadata: {
        booking_request_id: br.id,
      },
      success_url: `${siteUrl}/search?payment=success&br=${encodeURIComponent(
        br.id
      )}`,
      cancel_url: `${siteUrl}/search?payment=cancelled&br=${encodeURIComponent(
        br.id
      )}`,
    });

    // Save session id (we will fill payment_intent_id via webhook)
    const { error: updErr } = await supabase
      .from("booking_requests")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", br.id);

    if (updErr) {
      // not fatal, but nice to have
      console.warn("Failed to store session id:", updErr.message);
    }

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error." },
      { status: 500 }
    );
  }
}
