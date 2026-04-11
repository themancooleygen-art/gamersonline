import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
@Injectable()
export class AdminCasesService {
  constructor(private readonly prisma: PrismaService) {}
  async listCases() { return this.prisma.adminCase.findMany({ orderBy: { createdAt: "desc" }, include: { user: true, antiCheatEvent: true } }); }
  async createCase(params: { userId: string; title: string; severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; antiCheatEventId?: string; }) { return this.prisma.adminCase.create({ data: params }); }
  async actionCase(caseId: string, params: { assignedAdmin?: string; status?: "OPEN" | "IN_REVIEW" | "ACTIONED" | "APPEALED" | "CLOSED"; resolution?: string; }) { return this.prisma.adminCase.update({ where: { id: caseId }, data: params }); }
}
