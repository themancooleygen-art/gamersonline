import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}
  async signup(params: { email: string; password: string; gamerTag: string; region: string; }) {
    const existing = await this.prisma.user.findFirst({ where: { OR: [{ email: params.email }, { gamerTag: params.gamerTag }] } });
    if (existing) throw new BadRequestException("Email or gamer tag already in use.");
    const passwordHash = await bcrypt.hash(params.password, 10);
    const user = await this.prisma.user.create({ data: { email: params.email, passwordHash, gamerTag: params.gamerTag, region: params.region, status: "ACTIVE", profile: { create: {} }, subscriptions: { create: { plan: "FREE", status: "ACTIVE" } } }, include: { profile: true, subscriptions: true } });
    const token = await this.jwtService.signAsync({ sub: user.id, email: user.email, gamerTag: user.gamerTag });
    return { token, user };
  }
  async login(params: { email: string; password: string; }) {
    const user = await this.prisma.user.findUnique({ where: { email: params.email }, include: { profile: true, subscriptions: true } });
    if (!user) throw new UnauthorizedException("Invalid credentials.");
    const ok = await bcrypt.compare(params.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException("Invalid credentials.");
    const token = await this.jwtService.signAsync({ sub: user.id, email: user.email, gamerTag: user.gamerTag });
    return { token, user };
  }
  async me(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub }, include: { profile: true, subscriptions: true } });
      if (!user) throw new UnauthorizedException("User not found.");
      return { user };
    } catch {
      throw new UnauthorizedException("Invalid token.");
    }
  }
}
