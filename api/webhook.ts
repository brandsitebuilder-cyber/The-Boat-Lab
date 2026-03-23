import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Disable Vercel's default body parser to get the raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!secretKey || !webhookSecret) {
    console.error("Missing Stripe keys for webhook");
    return res.status(400).send("Webhook configuration error");
  }

  const stripe = new Stripe(secretKey);
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).send("Missing stripe-signature header");
  }

  let event;

  try {
    const rawBody = await buffer(req);
    
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature as string,
      webhookSecret
    );
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: Signature verification failed`);
  }

  // Handle the event
  console.log(`✅ Success: Webhook received! Event type: ${event.type}, ID: ${event.id}`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`💰 Payment received for session: ${session.id}`);
    // Fulfill the order here (e.g., update DB, send email)
  }

  return res.status(200).json({ received: true });
}
