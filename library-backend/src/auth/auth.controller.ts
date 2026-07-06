import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Ip,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─── POST /api/v1/auth/login ─────────────────────────────────────────────────
  // Rate limited: 5 requests per minute per IP (brute force protection)
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Login with phone and password' })
  @ApiResponse({ status: 200, description: 'Returns access + refresh tokens' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 423, description: 'Account locked' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async login(
    @Body() loginDto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.login(loginDto, ip, userAgent || 'unknown');
  }

  // ─── POST /api/v1/auth/register ──────────────────────────────────────────────
  // Only superadmin can register new users
  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new user (superadmin only)' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // ─── POST /api/v1/auth/refresh ───────────────────────────────────────────────
  // Uses separate Refresh Token JWT strategy (30 day expiry)
  @Public()
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get new access token using refresh token' })
  async refresh(@Req() req: any) {
    const userId = req.user.sub;
    const rawRefreshToken = req.user.refreshToken;
    return this.authService.refreshTokens(userId, rawRefreshToken);
  }

  // ─── POST /api/v1/auth/logout ────────────────────────────────────────────────
  // Revokes refresh token from DB — any subsequent refresh will fail
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout — revokes refresh token' })
  async logout(@CurrentUser() user: any) {
    return this.authService.logout(user.userId);
  }

  // ─── GET /api/v1/auth/me ─────────────────────────────────────────────────────
  // Returns current user info from JWT
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged in user info' })
  async getMe(@CurrentUser() user: any) {
    return this.authService.getMe(user.userId);
  }
}
