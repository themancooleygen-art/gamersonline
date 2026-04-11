import { Module } from "@nestjs/common";
import { AdminCasesController } from "./admin-cases.controller";
import { AdminCasesService } from "./admin-cases.service";
import { PrismaService } from "../prisma.service";
@Module({ controllers: [AdminCasesController], providers: [AdminCasesService, PrismaService] })
export class AdminCasesModule {}
