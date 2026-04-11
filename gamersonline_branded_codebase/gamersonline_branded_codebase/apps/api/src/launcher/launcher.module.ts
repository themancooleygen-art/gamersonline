import { Module } from "@nestjs/common";
import { LauncherController } from "./launcher.controller";
import { LauncherService } from "./launcher.service";
import { PrismaService } from "../prisma.service";
@Module({ controllers: [LauncherController], providers: [LauncherService, PrismaService] })
export class LauncherModule {}
