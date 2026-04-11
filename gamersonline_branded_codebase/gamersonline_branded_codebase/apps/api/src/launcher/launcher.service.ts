import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
@Injectable()
export class LauncherService {
  constructor(private readonly prisma: PrismaService) {}
  async validateSession(params: { userId: string; deviceFingerprint: string; launcherVersion: string; sessionToken: string; }) {
    const user = await this.prisma.user.findUnique({ where: { id: params.userId } });
    if (!user) throw new BadRequestException("User not found.");
    const trustedDevice = !user.deviceFingerprint || user.deviceFingerprint === params.deviceFingerprint;
    return { ok: trustedDevice, userId: params.userId, trustedDevice, launcherVersion: params.launcherVersion, message: trustedDevice ? "Session is eligible for queue gating." : "Device fingerprint mismatch. Route to restricted access or review." };
  }
}
