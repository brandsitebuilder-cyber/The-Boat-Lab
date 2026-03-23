import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { PRODUCTS } from '../src/data/products';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { items } = req.body;
    
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey || secretKey === "sk_test_...") {
      console.error("Missing or default Stripe Secret Key");
      return res.status(500).json({ error: "Stripe API key is not configured. Please add STRIPE_SECRET_KEY to your Secrets." });
    }

    const stripe = new Stripe(secretKey);

    // Detect APP_URL from Vercel if not set
    let appUrl = process.env.APP_URL;
    if (!appUrl && process.env.VERCEL_URL) {
      appUrl = `https://${process.env.VERCEL_URL}`;
    }

    if (!appUrl) {
      console.error("Missing APP_URL environment variable");
      return res.status(500).json({ error: "Server configuration error: APP_URL is missing." });
    }

    // Server-Side Integrity: Look up products from our trusted catalog
    const lineItems = items.map((item: any) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (!product) {
        throw new Error(`Product with ID ${item.id} not found`);
      }
      
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity || 1,
      };
    });

    // Idempotency: Generate a unique key for this checkout attempt
    const idempotencyKey = (req.headers['x-idempotency-key'] as string) || crypto.randomUUID();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${appUrl.replace(/\/$/, "")}/success?clear_cart=true`,
      cancel_url: `${appUrl.replace(/\/$/, "")}/cancel`,
    }, {
      idempotencyKey
    });

    console.log("Stripe session created:", session.id);
    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error("Stripe error details:", error);
    return res.status(500).json({ error: "Payment initialization failed. Please try again later." });
  }
}
