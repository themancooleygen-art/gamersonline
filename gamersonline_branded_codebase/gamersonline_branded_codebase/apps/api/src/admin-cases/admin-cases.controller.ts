import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AdminCasesService } from "./admin-cases.service";
@Controller("admin/cases")
export class AdminCasesController {
  constructor(private readonly adminCasesService: AdminCasesService) {}
  @Get() listCases() { return this.adminCasesService.listCases(); }
  @Post() createCase(@Body() body: { userId: string; title: string; severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; antiCheatEventId?: string; }) { return this.adminCasesService.createCase(body); }
  @Post(":caseId/action") actionCase(@Param("caseId") caseId: string, @Body() body: { assignedAdmin?: string; status?: "OPEN" | "IN_REVIEW" | "ACTIONED" | "APPEALED" | "CLOSED"; resolution?: string; }) { return this.adminCasesService.actionCase(caseId, body); }
}
