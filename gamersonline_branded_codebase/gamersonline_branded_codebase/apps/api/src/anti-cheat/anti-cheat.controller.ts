import { Body, Controller, Post } from "@nestjs/common";
import { AntiCheatService } from "./anti-cheat.service";
@Controller("anti-cheat")
export class AntiCheatController {
  constructor(private readonly antiCheatService: AntiCheatService) {}
  @Post("events") ingestEvent(@Body() body: { userId: string; sessionId: string; signalType: string; severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; source: string; rawPayload: Record<string, unknown>; }) { return this.antiCheatService.ingestEvent(body); }
}
