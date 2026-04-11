import { Body, Controller, Get, Headers, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("signup")
  signup(@Body() body: { email: string; password: string; gamerTag: string; region: string; }) { return this.authService.signup(body); }
  @Post("login")
  login(@Body() body: { email: string; password: string; }) { return this.authService.login(body); }
  @Get("me")
  async me(@Headers("authorization") authorization?: string) { const token = authorization?.replace("Bearer ", ""); if (!token) throw new UnauthorizedException("Missing token."); return this.authService.me(token); }
}
