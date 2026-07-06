import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Branch } from '../branches/entities/branch.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const BCRYPT_COST = 12;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(Branch)
    private branchRepo: Repository<Branch>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────────
  // REGISTER (Superadmin creates users only — not public)
  // ─────────────────────────────────────────────────────────────────────────────
  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: { phone: dto.phone } });
    if (existing) throw new ConflictException('User with this phone already exists');

    const role = await this.roleRepo.findOne({ where: { name: dto.roleName } });
    if (!role) throw new BadRequestException(`Role '${dto.roleName}' not found`);

    let branch: Branch | null = null;
    if (dto.branchId) {
      branch = await this.branchRepo.findOne({ where: { id: dto.branchId } });
      if (!branch) throw new BadRequestException('Branch not found');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_COST);

    const user = this.userRepo.create({
      phone: dto.phone,
      name: dto.name,
      email: dto.email ?? undefined,
      password: passwordHash,
      tenantId: dto.tenantId ?? undefined,
      role,
      branch: branch ?? undefined,
      isActive: true,
      failedLoginAttempts: 0,
    });

    const saved = await this.userRepo.save(user);
    const { password, refreshTokenHash, ...result } = saved as any;
    return result;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────────────────────────────────────
  async login(dto: LoginDto, ip: string, userAgent: string) {
    // Load user with password (select: false fields need explicit select)
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .addSelect('user.refreshTokenHash')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.branch', 'branch')
      .where('user.phone = :phone', { phone: dto.phone })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid phone or password');
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remaining = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      throw new ForbiddenException(
        `Account is locked due to too many failed attempts. Try again in ${remaining} minute(s).`,
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      await this.handleFailedLogin(user);
      const attemptsLeft = MAX_FAILED_ATTEMPTS - user.failedLoginAttempts;
      throw new UnauthorizedException(
        attemptsLeft > 0
          ? `Invalid phone or password. ${attemptsLeft} attempt(s) remaining.`
          : 'Account locked due to too many failed attempts.',
      );
    }

    // Successful login — reset failed attempts
    await this.userRepo.update(user.id, {
      failedLoginAttempts: 0,
      lockUntil: null,
      lastLoginAt: new Date(),
      lastLoginIp: ip,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Store hashed refresh token in DB
    const hashedRt = await bcrypt.hash(tokens.refreshToken, BCRYPT_COST);
    await this.userRepo.update(user.id, { refreshTokenHash: hashedRt });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role?.name,
        tenantId: user.tenantId,
        branchId: user.branch?.id,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // REFRESH TOKEN
  // ─────────────────────────────────────────────────────────────────────────────
  async refreshTokens(userId: string, rawRefreshToken: string) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.refreshTokenHash')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.branch', 'branch')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Access denied. Please login again.');
    }

    // Compare incoming RT with stored hash
    const rtMatches = await bcrypt.compare(rawRefreshToken, user.refreshTokenHash);
    if (!rtMatches) {
      // Possible token reuse attack — revoke all tokens
      await this.userRepo.update(user.id, { refreshTokenHash: null });
      throw new UnauthorizedException('Refresh token is invalid or was already used. Please login again.');
    }

    // Generate new token pair (token rotation)
    const tokens = await this.generateTokens(user);
    const hashedRt = await bcrypt.hash(tokens.refreshToken, BCRYPT_COST);
    await this.userRepo.update(user.id, { refreshTokenHash: hashedRt });

    return tokens;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────────────────────────────────────────────
  async logout(userId: string) {
    // Revoke refresh token from DB — the user is logged out from all devices
    await this.userRepo.update(userId, { refreshTokenHash: null });
    return { message: 'Logged out successfully' };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // GET ME
  // ─────────────────────────────────────────────────────────────────────────────
  async getMe(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { role: true, branch: true },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role?.name,
      tenantId: user.tenantId,
      branchId: user.branch?.id,
      lastLoginAt: user.lastLoginAt,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────────────────────
  private async generateTokens(user: User & { role?: any; branch?: any }) {
    const payload = {
      sub: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role?.name,
      tenantId: user.tenantId,
      branchId: user.branch?.id || null,
    };

    const accessSecret = this.configService.get<string>('JWT_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!accessSecret || !refreshSecret) {
      throw new Error('JWT secrets are not configured!');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: '30d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async handleFailedLogin(user: User) {
    const newCount = (user.failedLoginAttempts || 0) + 1;
    const update: Partial<User> = { failedLoginAttempts: newCount };

    if (newCount >= MAX_FAILED_ATTEMPTS) {
      const lockUntil = new Date();
      lockUntil.setMinutes(lockUntil.getMinutes() + LOCK_DURATION_MINUTES);
      update.lockUntil = lockUntil;
    }

    await this.userRepo.update(user.id, update);
  }
}
