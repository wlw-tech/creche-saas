# 📄 Code Source Complet - Fichiers Clés

## 🎯 Fichiers Principaux

### 1. `src/modules/inscriptions/inscriptions.controller.ts` (62 lignes)

```typescript
@ApiTags('Public/Inscriptions')
@Controller('public/inscriptions')
export class InscriptionsController {
  constructor(private readonly inscriptionsService: InscriptionsService) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer une nouvelle inscription',
    description: 'Endpoint public pour créer une inscription...'
  })
  @ApiCreatedResponse({
    description: 'Inscription créée avec succès',
    schema: {
      example: {
        applicationId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        statut: 'Candidature',
      },
    },
  })
  async create(@Body() createInscriptionDto: CreateInscriptionDto) {
    return this.inscriptionsService.apply(createInscriptionDto);
  }
}
```

### 2. `src/modules/inscriptions/inscriptions.service.ts` (159 lignes)

**Méthode principale:**
```typescript
async apply(dto: CreateInscriptionDto) {
  // 1. Valider classe (existe + active)
  const classe = await this.prisma.classe.findUnique({
    where: { id: dto.classeIdSouhaitee },
  });

  if (!classe) {
    throw new NotFoundException(`Classe non trouvée`);
  }

  if (!classe.active) {
    throw new BadRequestException(`Classe n'est pas disponible`);
  }

  // 2. Transaction atomique
  const result = await this.prisma.$transaction(async (tx) => {
    // Upsert Famille
    const famille = await tx.famille.upsert({
      where: { emailPrincipal: dto.famille.emailPrincipal },
      update: { ... },
      create: { ... },
    });

    // Créer Tuteurs
    const tuteurs = await Promise.all(
      dto.tuteurs.map((tuteurDto) =>
        tx.tuteur.create({
          data: {
            familleId: famille.id,
            lien: tuteurDto.lien,
            ...
          },
        }),
      ),
    );

    // Find/Create Enfant
    let enfant = await tx.enfant.findFirst({
      where: {
        familleId: famille.id,
        prenom: dto.enfant.prenom,
        nom: dto.enfant.nom,
        dateNaissance: new Date(dto.enfant.dateNaissance),
      },
    });

    if (!enfant) {
      enfant = await tx.enfant.create({
        data: {
          familleId: famille.id,
          prenom: dto.enfant.prenom,
          nom: dto.enfant.nom,
          dateNaissance: new Date(dto.enfant.dateNaissance),
          genre: dto.enfant.genre,
          photoUrl: dto.enfant.photoUrl,
        },
      });
    }

    // Créer Inscription
    const inscription = await tx.inscription.create({
      data: {
        enfantId: enfant.id,
        classeId: classe.id,
        statut: 'Candidature',
      },
    });

    return {
      applicationId: inscription.id,
      statut: inscription.statut,
    };
  });

  return result;
}
```

### 3. `src/modules/inscriptions/dto/create-inscription.dto.ts` (214 lignes)

**Structure:**
```typescript
export class FamilleDto {
  @IsEmail()
  emailPrincipal: string;

  @IsOptional()
  @IsEnum(['fr', 'ar'])
  languePreferee?: Langue;

  @IsOptional()
  @IsString()
  adresseFacturation?: string;
}

export class TuteurDto {
  @IsEnum(LienTuteur)
  lien: LienTuteur;

  @IsString()
  prenom: string;

  @IsString()
  nom: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsBoolean()
  principal?: boolean;
}

export class EnfantDto {
  @IsString()
  prenom: string;

  @IsString()
  nom: string;

  @IsISO8601()
  dateNaissance: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string | null;
}

export class ConsentementsDto {
  @IsOptional()
  @IsBoolean()
  photo?: boolean;

  @IsOptional()
  @IsBoolean()
  sortie?: boolean;
}

export class CreateInscriptionDto {
  @ValidateNested()
  @Type(() => FamilleDto)
  famille: FamilleDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TuteurDto)
  tuteurs: TuteurDto[];

  @ValidateNested()
  @Type(() => EnfantDto)
  enfant: EnfantDto;

  @IsString()
  classeIdSouhaitee: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ConsentementsDto)
  consentements?: ConsentementsDto;

  @IsOptional()
  @IsString()
  commentaire?: string;
}
```

### 4. `src/app.module.ts` - Modifications

```typescript
import { InscriptionsModule } from './modules/inscriptions/inscriptions.module';
import { RateLimitModule } from './common/rate-limit/rate-limit.module';
import { CaptchaPlaceholderMiddleware } from './common/middlewares/captcha-placeholder.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PrismaModule,
    RateLimitModule,
    ClassesModule,
    FamillesModule,
    InscriptionsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CaptchaPlaceholderMiddleware)
      .forRoutes('api/public/inscriptions');
  }
}
```

### 5. `src/common/rate-limit/rate-limit.module.ts` (18 lignes)

```typescript
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,  // 60 secondes
        limit: 20,   // 20 requêtes
      },
    ]),
  ],
  exports: [ThrottlerModule],
})
export class RateLimitModule {}
```

### 6. `src/common/middlewares/captcha-placeholder.middleware.ts` (35 lignes)

```typescript
@Injectable()
export class CaptchaPlaceholderMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CaptchaPlaceholderMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-captcha-token'];
    
    if (!token) {
      this.logger.warn('Missing hCaptcha token in request');
    }

    // TODO: Vérifier le token avec hCaptcha API
    // const isValid = await this.verifyCaptcha(token);
    // if (!isValid) {
    //   throw new BadRequestException('Invalid captcha');
    // }

    next();
  }
}
```

## 📊 Statistiques

| Fichier | Lignes | Type |
|---------|--------|------|
| create-inscription.dto.ts | 214 | DTO |
| inscriptions.service.ts | 159 | Service |
| inscriptions.controller.ts | 62 | Controller |
| inscriptions.module.ts | 16 | Module |
| rate-limit.module.ts | 18 | Config |
| captcha-placeholder.middleware.ts | 35 | Middleware |
| inscriptions.e2e-spec.ts | 290 | Tests |

**Total:** ~826 lignes

## 🧪 Tests E2E

```typescript
describe('Inscriptions (e2e)', () => {
  it('should create an inscription with valid data (happy path)', async () => {
    const payload = { ... };
    const response = await request(app.getHttpServer())
      .post('/api/public/inscriptions')
      .send(payload)
      .expect(201);

    expect(response.body).toHaveProperty('applicationId');
    expect(response.body.statut).toBe('Candidature');
  });

  it('should return 404 when classe does not exist', async () => {
    const payload = { ... };
    const response = await request(app.getHttpServer())
      .post('/api/public/inscriptions')
      .send(payload);

    expect(response.status).toBe(404);
  });

  // ... 3 autres tests
});
```

## 🔗 Fichiers Complets

Pour voir les fichiers complets:
- `src/modules/inscriptions/dto/create-inscription.dto.ts`
- `src/modules/inscriptions/inscriptions.service.ts`
- `src/modules/inscriptions/inscriptions.controller.ts`
- `src/modules/inscriptions/inscriptions.module.ts`
- `src/common/rate-limit/rate-limit.module.ts`
- `src/common/middlewares/captcha-placeholder.middleware.ts`
- `test/inscriptions.e2e-spec.ts`

---

**Tous les fichiers sont disponibles dans le repository GitHub!**

**Repository:** https://github.com/wlw-tech/creche-saas.git

