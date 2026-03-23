import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import crypto from "crypto";
import { PRODUCTS } from "./src/data/products";

dotenv.config();

// Export the app for Vercel serverless functions
export const app = express();
const PORT = 3000;

// Webhook must be registered BEFORE express.json() so it can receive the raw body
app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!secretKey || !webhookSecret) {
    console.error("Missing Stripe keys for webhook");
    return res.status(400).send("Webhook configuration error");
  }

  const stripeInstance = new Stripe(secretKey);
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    // Verify the webhook signature
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      signature as string,
      webhookSecret
    );
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: Signature verification failed`);
  }

  // Handle the event (idempotency is handled by Stripe sending the same event ID, 
  // but in a real DB you'd check if event.id was already processed)
  console.log(`✅ Success: Webhook received! Event type: ${event.type}, ID: ${event.id}`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`💰 Payment received for session: ${session.id}`);
    // Fulfill the order here (e.g., update DB, send email)
  }

  res.json({ received: true });
});

app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== "sk_test_...",
    hasAppUrl: !!process.env.APP_URL || !!process.env.VERCEL_URL,
    nodeEnv: process.env.NODE_ENV || "development"
  });
});

app.post("/api/checkout", async (req, res) => {
  try {
    const { items } = req.body;
    console.log("Checkout request received for items:", items?.map((i: any) => i.id));
    
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey || secretKey === "sk_test_...") {
      console.error("Missing or default Stripe Secret Key");
      return res.status(500).json({ error: "Stripe API key is not configured. Please add STRIPE_SECRET_KEY to your Secrets." });
    }

    // Initialize Stripe inside the handler to ensure it picks up the latest env vars
    const stripeInstance = new Stripe(secretKey);

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
    const idempotencyKey = req.headers['x-idempotency-key'] as string || crypto.randomUUID();

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${appUrl.replace(/\/$/, "")}/success`,
      cancel_url: `${appUrl.replace(/\/$/, "")}/cancel`,
    }, {
      idempotencyKey
    });

    console.log("Stripe session created:", session.id);
    res.json({ url: session.url });
  } catch (error: any) {
    // Error Handling: Log the real error server-side, but sanitize the client response
    console.error("Stripe error details:", error);
    res.status(500).json({ error: "Payment initialization failed. Please try again later." });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      // Don't serve index.html for API routes
      if (req.path.startsWith("/api/")) return;
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  // Error handler to ensure JSON responses even on crashes
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  });

  // Only listen if not on Vercel (Vercel handles listening)
  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`APP_URL is set to: ${process.env.APP_URL || "NOT SET"}`);
      console.log(`STRIPE_SECRET_KEY is configured: ${!!process.env.STRIPE_SECRET_KEY}`);
    });
  }
}

startServer();
