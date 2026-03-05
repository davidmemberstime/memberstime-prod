import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  const supabase = createClient();

  // When checkout completes, the PaymentIntent is created/authorised (manual capture).
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const bookingRequestId = (session.metadata?.booking_request_id ||
      (session.metadata as any)?.booking_request_id) as string | undefined;

    const paymentIntentId = session.payment_intent as string | null;

    if (bookingRequestId && paymentIntentId) {
      await supabase
        .from("booking_requests")
        .update({
          stripe_payment_intent_id: paymentIntentId,
          status: "authorised_pending_host",
        })
        .eq("id", bookingRequestId);
    }
  }

  // If captured later, Stripe will emit payment_intent.succeeded (capture)
  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const bookingRequestId = (pi.metadata?.booking_request_id || "") as string;

    if (bookingRequestId) {
      await supabase
        .from("booking_requests")
        .update({ status: "paid_confirmed" })
        .eq("id", bookingRequestId);
    }
  }

  // If cancelled (decline/expire), you'll see payment_intent.canceled
  if (event.type === "payment_intent.canceled") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const bookingRequestId = (pi.metadata?.booking_request_id || "") as string;

    if (bookingRequestId) {
      // Keep whatever status you set in your decline/expire route, do not overwrite.
      // But if it’s still authorised, mark cancelled.
      const { data } = await supabase
        .from("booking_requests")
        .select("status")
        .eq("id", bookingRequestId)
        .single();

      if (data?.status === "authorised_pending_host") {
        await supabase
          .from("booking_requests")
          .update({ status: "cancelled" })
          .eq("id", bookingRequestId);
      }
    }
  }

  return NextResponse.json({ received: true });
}
