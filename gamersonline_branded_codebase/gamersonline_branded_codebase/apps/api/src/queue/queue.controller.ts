import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { QueueService } from "./queue.service";
@Controller("queue")
export class QueueController {
  constructor(private readonly queueService: QueueService) {}
  @Post("join")
  joinQueue(@Body() body: { userId: string; queueType: "SOLO" | "DUO" | "FIVE_STACK" | "SCRIM"; region: string; partySize: number; }) { return this.queueService.joinQueue(body); }
  @Post("leave/:ticketId")
  leaveQueue(@Param("ticketId") ticketId: string) { return this.queueService.leaveQueue(ticketId); }
  @Get("status/:ticketId")
  getTicketStatus(@Param("ticketId") ticketId: string) { return this.queueService.getTicketStatus(ticketId); }
}
