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
  app.use(
    helmet({
      contentSecurityPolicy: isProduction
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc:  ["'self'"],
              styleSrc:   ["'self'", "'unsafe-inline'"],
              imgSrc:     ["'self'", 'data:', 'https:'],
              // ✅ In production: only allow your own domain + frontend domain
              connectSrc: ["'self'", 'https://admin.smartlibrary.com'],
              frameSrc:   ["'none'"],
              objectSrc:  ["'none'"],
            },
          }
        : false, // ✅ Disable CSP in development — it was blocking all cross-origin fetches!
      hsts: isProduction
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
      frameguard:     { action: 'deny' },
      noSniff:        true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );

  // ── Cache-Control for Protected API Routes ──────────────────────────────────
  app.use((req: any, res: any, next: any) => {
    if (req.path.startsWith('/api')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
    }
    next();
  });

  // ── CORS ───────────────────────────────────────────────────────────────────
  // Development: allow all origins (origin: true mirrors request origin)
  // Production: only known frontend domains
  const allowedOrigins = isProduction
    ? [
        'https://admin.smartlibrary.com',
        'https://app.smartlibrary.com',
        'https://superadmin.smartlibrary.com',
      ]
    : true;

  app.enableCors({
    origin:     allowedOrigins,
    credentials: true,
    methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    // ✅ Added 'Cache-Control' and 'Pragma' — required for CORS preflight to pass
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Cache-Control',
      'Pragma',
      'Accept',
    ],
    exposedHeaders: ['Authorization'],
  });

  // ── Global API Prefix & Versioning ─────────────────────────────────────────
  app.setGlobalPrefix('api/v1', {
    exclude: ['health', 'api/docs'],
  });

  // ── Global Validation Pipe ──────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:            true,
      transform:            true,
      forbidNonWhitelisted: true,
      transformOptions:     { enableImplicitConversion: true },
    }),
  );

  // ── Global Exception Filter ─────────────────────────────────────────────────
  app.useGlobalFilters(new AllExceptionsFilter());

  // ── Swagger (API Docs) ──────────────────────────────────────────────────────
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

  // ✅ Fixed: PORT default is 3001 (was incorrectly 3000)
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`✅ Backend running on: http://localhost:${port}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  if (!isProduction) {
    console.log(`📖 Swagger Docs: http://localhost:${port}/api/docs`);
    console.log(`🔗 CORS: Allowing all origins in development`);
  }
}
bootstrap();
