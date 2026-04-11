import { Module } from "@nestjs/common";
import { QueueController } from "./queue.controller";
import { QueueService } from "./queue.service";
import { PrismaService } from "../prisma.service";
import { RedisService } from "../redis.service";
@Module({ controllers: [QueueController], providers: [QueueService, PrismaService, RedisService] })
export class QueueModule {}
