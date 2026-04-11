import { Body, Controller, Post } from "@nestjs/common";
import { LauncherService } from "./launcher.service";
@Controller("launcher")
export class LauncherController {
  constructor(private readonly launcherService: LauncherService) {}
  @Post("validate-session") validateSession(@Body() body: { userId: string; deviceFingerprint: string; launcherVersion: string; sessionToken: string; }) { return this.launcherService.validateSession(body); }
}
