import { Body, Controller, Post } from "@nestjs/common";
import { BillingService } from "./billing.service";
@Controller("billing")
export class BillingController {
  constructor(private readonly billingService: BillingService) {}
  @Post("checkout-session")
  createCheckoutSession(@Body() body: { userId: string; plan: "PRO" | "ORGANIZER"; }) { return this.billingService.createCheckoutSession(body); }
  @Post("webhook")
  handleWebhook(@Body() body: Record<string, unknown>) { return this.billingService.handleWebhook(body); }
}
