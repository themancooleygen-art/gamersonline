import { Module } from "@nestjs/common";
import { AntiCheatController } from "./anti-cheat.controller";
import { AntiCheatService } from "./anti-cheat.service";
import { PrismaService } from "../prisma.service";
@Module({ controllers: [AntiCheatController], providers: [AntiCheatService, PrismaService] })
export class AntiCheatModule {}
