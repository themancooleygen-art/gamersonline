import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import Stripe from "stripe";
@Injectable()
export class BillingService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_replace_me", { apiVersion: "2024-04-10" as any });
  constructor(private readonly prisma: PrismaService) {}
  async createCheckoutSession(params: { userId: string; plan: "PRO" | "ORGANIZER"; }) {
    const user = await this.prisma.user.findUnique({ where: { id: params.userId } });
    const priceLookup: Record<string, number> = { PRO: 1200, ORGANIZER: 7900 };
    const session = await this.stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price_data: { currency: "usd", product_data: { name: `GamersOnline ${params.plan}` }, unit_amount: priceLookup[params.plan], recurring: { interval: "month" } }, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/dashboard?billing=success`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/billing?billing=canceled`,
      customer_email: user?.email,
      metadata: { userId: params.userId, plan: params.plan }
    });
    return { url: session.url, id: session.id };
  }
  async handleWebhook(body: Record<string, unknown>) { return { received: true, note: "Replace this with raw-body Stripe signature verification and subscription syncing.", body }; }
}
