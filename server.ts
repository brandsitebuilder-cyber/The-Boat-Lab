import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// Export the app for Vercel serverless functions
export const app = express();
const PORT = 3000;

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
    console.log("Checkout request received for items:", items?.map((i: any) => i.name));
    
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

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      })),
      mode: "payment",
      success_url: `${appUrl.replace(/\/$/, "")}/success`,
      cancel_url: `${appUrl.replace(/\/$/, "")}/cancel`,
    });

    console.log("Stripe session created:", session.id);
    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error details:", error);
    res.status(500).json({ error: error.message });
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
