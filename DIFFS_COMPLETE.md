# 📋 Diffs Complets - Implémentation API Inscriptions

## 1. `src/app.module.ts` - MODIFIÉ

```diff
// src/app.module.ts
- import { Module } from '@nestjs/common';
+ import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
  import { ConfigModule } from '@nestjs/config';
  import configuration from './config/configuration';
  import { PrismaModule } from './prisma/prisma.module';
  import { ClassesModule } from './modules/classes/classes.module';
  import { FamillesModule } from './modules/familles/familles.module';
+ import { InscriptionsModule } from './modules/inscriptions/inscriptions.module';
+ import { RateLimitModule } from './common/rate-limit/rate-limit.module';
+ import { CaptchaPlaceholderMiddleware } from './common/middlewares/captcha-placeholder.middleware';

  @Module({
    imports: [
      // Lit .env et expose ConfigService partout
      ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
      PrismaModule,
+     RateLimitModule,
      ClassesModule,
      FamillesModule,
+     InscriptionsModule,
    ],
  })
- export class AppModule {}
+ export class AppModule implements NestModule {
+   configure(consumer: MiddlewareConsumer) {
+     // Appliquer le middleware captcha placeholder sur /api/public/inscriptions
+     consumer
+       .apply(CaptchaPlaceholderMiddleware)
+       .forRoutes('api/public/inscriptions');
+   }
+ }
```

## 2. `package.json` - MODIFIÉ

```diff
  "dependencies": {
    "@nestjs/common": "^11.0.1",
    "@nestjs/config": "^4.0.2",
    "@nestjs/core": "^11.0.1",
    "@nestjs/mapped-types": "^2.1.0",
    "@nestjs/platform-express": "^11.0.1",
    "@nestjs/swagger": "^11.2.1",
+   "@nestjs/throttler": "^6.4.0",
    "@prisma/client": "^6.17.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.2",
    "prisma": "^6.17.1",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "swagger-ui-express": "^5.0.1"
  }
```

## 3. `src/modules/inscriptions/dto/create-inscription.dto.ts` - CRÉÉ

Fichier complet avec 214 lignes contenant:
- `FamilleDto` avec validation email, langue, adresse
- `TuteurDto` avec lien, contact, principal
- `EnfantDto` avec prenom, nom, dateNaissance, genre, photo
- `ConsentementsDto` avec photo, sortie
- `CreateInscriptionDto` principal avec nested validation

## 4. `src/modules/inscriptions/inscriptions.service.ts` - CRÉÉ

Fichier complet avec 130 lignes contenant:
- Méthode `apply()` avec transaction Prisma atomique
- Validation classe (existe + active)
- Upsert Famille sur emailPrincipal
- Création Tuteurs
- Find/Create Enfant
- Création Inscription (statut=Candidature)
- Gestion d'erreurs complète
- Logging avec NestJS Logger
- TODOs pour email et webhook

## 5. `src/modules/inscriptions/inscriptions.controller.ts` - CRÉÉ

Fichier complet avec 62 lignes contenant:
- Route `POST /api/public/inscriptions`
- Guard `@UseGuards(ThrottlerGuard)`
- Swagger documentation complète
- Exemple de réponse 201
- Exemple d'erreur 400

## 6. `src/modules/inscriptions/inscriptions.module.ts` - CRÉÉ

Fichier complet avec 16 lignes contenant:
- Import PrismaModule
- Déclaration InscriptionsController
- Déclaration InscriptionsService
- Export InscriptionsService

## 7. `src/common/rate-limit/rate-limit.module.ts` - CRÉÉ

Fichier complet avec 18 lignes contenant:
- Configuration ThrottlerModule
- 20 requêtes par 60 secondes
- Export ThrottlerModule

## 8. `src/common/middlewares/captcha-placeholder.middleware.ts` - CRÉÉ

Fichier complet avec 35 lignes contenant:
- Middleware NestJS pour hCaptcha
- Vérification header `x-captcha-token`
- Log warning si absent
- TODO pour intégration hCaptcha API

## 9. `test/inscriptions.e2e-spec.ts` - CRÉÉ

Fichier complet avec 290 lignes contenant:
- 5 tests e2e complets
- Setup avec AppModule
- Global prefix `/api`
- ValidationPipe global
- Tests:
  1. Happy path - création réussie
  2. Classe inexistante - 404
  3. Classe inactive - 400
  4. Email invalide - 400
  5. Upsert famille - même email

## 📊 Résumé des Changements

| Fichier | Type | Lignes | Description |
|---------|------|--------|-------------|
| `src/app.module.ts` | Modifié | +20 | Imports + middleware |
| `package.json` | Modifié | +1 | @nestjs/throttler |
| `src/modules/inscriptions/dto/create-inscription.dto.ts` | Créé | 214 | DTOs complets |
| `src/modules/inscriptions/inscriptions.service.ts` | Créé | 130 | Service avec transaction |
| `src/modules/inscriptions/inscriptions.controller.ts` | Créé | 62 | Contrôleur + Swagger |
| `src/modules/inscriptions/inscriptions.module.ts` | Créé | 16 | Module |
| `src/common/rate-limit/rate-limit.module.ts` | Créé | 18 | Rate-limit config |
| `src/common/middlewares/captcha-placeholder.middleware.ts` | Créé | 35 | Captcha middleware |
| `test/inscriptions.e2e-spec.ts` | Créé | 290 | Tests e2e (5/5 ✓) |

**Total:** 9 fichiers, ~826 lignes de code

## ✅ Validation

```bash
# Build
✓ pnpm build

# Tests
✓ pnpm test:e2e inscriptions
  - Test Suites: 1 passed
  - Tests: 5 passed

# Lint
✓ pnpm lint

# Git
✓ git commit
✓ git push origin main
```

---
**Commit Hash:** `9009f58`
**Date:** 2025-10-27

