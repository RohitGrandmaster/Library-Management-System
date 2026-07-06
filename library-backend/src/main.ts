import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const isProduction = process.env.NODE_ENV === 'production';

  // ── Logging (Pino) ──────────────────────────────────────────────────────────
  app.useLogger(app.get(Logger));

  // ── Security Headers (Helmet) ───────────────────────────────────────────────
  // Enables: CSP, XSS filter, HSTS, X-Frame-Options, X-Content-Type-Options
  // Disables: X-Powered-By (hides NestJS/Express fingerprint)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
        },
      },
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      frameguard: { action: 'deny' },
      noSniff: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );

  // ── Cache-Control for Protected API Routes ──────────────────────────────────
  // Prevents browsers from caching API responses
  app.use((req: any, res: any, next: any) => {
    if (req.path.startsWith('/api')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
    }
    next();
  });

  // ── CORS — Restricted Origins ───────────────────────────────────────────────
  // NEVER use '*' — only allow known frontend domains
  const allowedOrigins = isProduction
    ? [
        'https://admin.smartlibrary.com',
        'https://app.smartlibrary.com',
        'https://superadmin.smartlibrary.com',
      ]
    : ['http://localhost:3000', 'http://localhost:3001'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // ── Global API Prefix & Versioning ─────────────────────────────────────────
  app.setGlobalPrefix('api/v1', {
    exclude: ['health', 'api/docs'], // Health check and Swagger remain at root
  });

  // ── Global Validation Pipe ──────────────────────────────────────────────────
  // whitelist: strips unknown fields (prevents mass-assignment attacks)
  // forbidNonWhitelisted: rejects requests with unknown fields
  // transform: auto-transforms request DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Global Exception Filter ─────────────────────────────────────────────────
  app.useGlobalFilters(new AllExceptionsFilter());

  // ── Swagger (API Docs) ──────────────────────────────────────────────────────
  // Disable Swagger in production to avoid exposing API surface
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('Library Management API')
      .setDescription('Smart Library 360 — Banking-Level Secured APIs')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`✅ Application running on: http://localhost:${port}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  if (!isProduction) {
    console.log(`📖 Swagger Docs: http://localhost:${port}/api/docs`);
  }
}
bootstrap();
