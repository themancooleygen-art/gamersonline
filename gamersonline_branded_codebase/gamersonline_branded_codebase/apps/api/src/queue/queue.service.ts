import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { RedisService } from "../redis.service";
@Injectable()
export class QueueService {
  constructor(private readonly prisma: PrismaService, private readonly redisService: RedisService) {}
  async joinQueue(params: { userId: string; queueType: "SOLO" | "DUO" | "FIVE_STACK" | "SCRIM"; region: string; partySize: number; }) {
    const user = await this.prisma.user.findUnique({ where: { id: params.userId }, include: { profile: true } });
    if (!user) throw new BadRequestException("User not found.");
    if (user.status !== "ACTIVE") throw new BadRequestException("User is not eligible for queue entry.");
    const ticket = await this.prisma.queueTicket.create({ data: { userId: user.id, queueType: params.queueType, region: params.region, partySize: params.partySize, mmrSnapshot: user.profile?.elo ?? 1000, trustSnapshot: user.trustScore } });
    await this.redisService.getClient().lpush(`queue:${params.region}:${params.queueType}`, ticket.id);
    return { message: "Queue ticket created.", ticket };
  }
  async leaveQueue(ticketId: string) { return this.prisma.queueTicket.update({ where: { id: ticketId }, data: { status: "CANCELED" } }); }
  async getTicketStatus(ticketId: string) { return this.prisma.queueTicket.findUnique({ where: { id: ticketId } }); }
}
