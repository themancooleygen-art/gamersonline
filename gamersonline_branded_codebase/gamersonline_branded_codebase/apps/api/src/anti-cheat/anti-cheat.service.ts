import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
@Injectable()
export class AntiCheatService {
  constructor(private readonly prisma: PrismaService) {}
  async ingestEvent(params: { userId: string; sessionId: string; signalType: string; severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; source: string; rawPayload: Record<string, unknown>; }) {
    const event = await this.prisma.antiCheatEvent.create({ data: params });
    if (params.severity === "HIGH" || params.severity === "CRITICAL") {
      await this.prisma.adminCase.create({ data: { userId: params.userId, antiCheatEventId: event.id, title: `Auto-created from signal: ${params.signalType}`, severity: params.severity, status: "OPEN" } });
    }
    return { message: "Anti-cheat event recorded.", event };
  }
}
