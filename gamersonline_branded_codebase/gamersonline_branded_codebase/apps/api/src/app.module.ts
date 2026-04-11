import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { HealthController } from "./health.controller";
import { PrismaService } from "./prisma.service";
import { QueueModule } from "./queue/queue.module";
import { AdminCasesModule } from "./admin-cases/admin-cases.module";
import { AntiCheatModule } from "./anti-cheat/anti-cheat.module";
import { LauncherModule } from "./launcher/launcher.module";
import { AuthModule } from "./auth/auth.module";
import { BillingModule } from "./billing/billing.module";
import { RedisService } from "./redis.service";
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), JwtModule.register({ global: true, secret: process.env.JWT_SECRET || "change-me", signOptions: { expiresIn: "7d" } }), QueueModule, AdminCasesModule, AntiCheatModule, LauncherModule, AuthModule, BillingModule],
  controllers: [HealthController],
  providers: [PrismaService, RedisService],
})
export class AppModule {}
