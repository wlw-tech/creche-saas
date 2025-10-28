# 🔧 TODO - Intégration Supabase Complète

## 📋 Tâches à Faire

### 1. Configuration Supabase

- [ ] Créer projet Supabase: https://supabase.com
- [ ] Récupérer `SUPABASE_URL`
- [ ] Récupérer `SUPABASE_SERVICE_ROLE` (Admin API key)
- [ ] Récupérer `SUPABASE_JWKS_URL`
- [ ] Configurer email provider (SMTP ou Resend)
- [ ] Créer admin user dans Supabase

### 2. Implémenter SupabaseAdminService

**Fichier:** `src/common/services/supabase-admin.service.ts`

#### TODO 1: createUserInvite()
```typescript
// Remplacer le mock par:
async createUserInvite(email: string): Promise<{ userId: string; email: string; invited: boolean }> {
  try {
    const { data, error } = await this.supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/auth/callback`,
    });
    
    if (error) throw error;
    
    return {
      userId: data.user.id,
      email: data.user.email,
      invited: true,
    };
  } catch (error) {
    this.logger.error(`Failed to invite user ${email}:`, error);
    throw new BadRequestException('Failed to send invitation');
  }
}
```

#### TODO 2: sendPasswordReset()
```typescript
async sendPasswordReset(email: string): Promise<void> {
  try {
    const { error } = await this.supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${process.env.FRONTEND_URL}/auth/reset-password`,
      },
    });
    
    if (error) throw error;
  } catch (error) {
    this.logger.error(`Failed to send reset link to ${email}:`, error);
    throw new BadRequestException('Failed to send reset link');
  }
}
```

#### TODO 3: linkMagicLink()
```typescript
async linkMagicLink(email: string): Promise<string> {
  try {
    const { data, error } = await this.supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${process.env.FRONTEND_URL}/auth/callback`,
      },
    });
    
    if (error) throw error;
    
    return data.properties.action_link;
  } catch (error) {
    this.logger.error(`Failed to generate magic link for ${email}:`, error);
    throw new BadRequestException('Failed to generate magic link');
  }
}
```

#### TODO 4: userExists()
```typescript
async userExists(email: string): Promise<boolean> {
  try {
    const { data, error } = await this.supabaseAdmin.auth.admin.listUsers();
    
    if (error) throw error;
    
    return data.users.some(u => u.email === email);
  } catch (error) {
    this.logger.error(`Failed to check user existence for ${email}:`, error);
    return false;
  }
}
```

#### TODO 5: getUserIdByEmail()
```typescript
async getUserIdByEmail(email: string): Promise<string | null> {
  try {
    const { data, error } = await this.supabaseAdmin.auth.admin.listUsers();
    
    if (error) throw error;
    
    const user = data.users.find(u => u.email === email);
    return user?.id || null;
  } catch (error) {
    this.logger.error(`Failed to get user ID for ${email}:`, error);
    return null;
  }
}
```

### 3. Implémenter JWT Validation (PROD)

**Fichier:** `src/common/guards/jwt-auth.guard.ts`

#### TODO: Valider JWT Supabase en PROD
```typescript
async canActivate(context: ExecutionContext): Promise<boolean> {
  const request = context.switchToHttp().getRequest();
  const token = this.extractTokenFromHeader(request);

  if (!token) {
    throw new UnauthorizedException('No token provided');
  }

  try {
    if (process.env.NODE_ENV === 'production') {
      // TODO: Valider JWT Supabase
      // 1. Récupérer JWKS depuis SUPABASE_JWKS_URL
      // 2. Vérifier signature du token
      // 3. Vérifier audience et issuer
      const decoded = await this.verifySupabaseJWT(token);
      request.user = decoded;
    } else {
      // DEV: Valider JWT local
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      request.user = decoded;
    }

    return true;
  } catch (error) {
    throw new UnauthorizedException('Invalid token');
  }
}

private async verifySupabaseJWT(token: string): Promise<any> {
  // TODO: Implémenter validation JWT Supabase
  // Utiliser jsonwebtoken.verify() avec JWKS
}
```

### 4. Implémenter Email Service

**Fichier:** `src/common/services/email.service.ts` (À créer)

```typescript
// TODO: Créer service email
// Options:
// 1. Resend (recommandé)
// 2. SendGrid
// 3. Mailgun
// 4. SMTP natif

// Exemple avec Resend:
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendInvitation(email: string, magicLink: string): Promise<void> {
    await this.resend.emails.send({
      from: this.configService.get('SENDER_EMAIL'),
      to: email,
      subject: 'Invitation - Crèche WLW',
      html: `<a href="${magicLink}">Accepter l'invitation</a>`,
    });
  }
}
```

### 5. Intégrer Email dans Services

**Fichiers à modifier:**
- `src/modules/users/users.service.ts`
- `src/modules/inscriptions/inscriptions-accept.service.ts`

```typescript
// TODO: Ajouter EmailService et envoyer emails après invitation
constructor(
  private prisma: PrismaService,
  private supabaseAdmin: SupabaseAdminService,
  private emailService: EmailService, // TODO: Ajouter
) {}

// Dans inviteTeacher():
const magicLink = await this.supabaseAdmin.linkMagicLink(email);
await this.emailService.sendInvitation(email, magicLink);

// Dans acceptAndProvision():
for (const tuteur of tuteurs) {
  if (tuteur.email) {
    const magicLink = await this.supabaseAdmin.linkMagicLink(tuteur.email);
    await this.emailService.sendInvitation(tuteur.email, magicLink);
  }
}
```

### 6. Implémenter Refresh Tokens

**Fichier:** `src/modules/auth/auth.service.ts` (À créer)

```typescript
// TODO: Ajouter refresh token logic
// 1. Stocker refresh token en base
// 2. Implémenter POST /auth/refresh
// 3. Valider refresh token
// 4. Générer nouveau access token
```

### 7. Ajouter Tests

**Fichiers à créer:**
- `src/modules/auth/auth.service.spec.ts`
- `src/modules/users/users.service.spec.ts`
- `src/modules/inscriptions/inscriptions-accept.service.spec.ts`
- `src/common/guards/jwt-auth.guard.spec.ts`
- `src/common/guards/roles.guard.spec.ts`

```bash
# TODO: Exécuter
pnpm test
```

### 8. Ajouter Audit Trail

**Fichier:** `src/common/services/audit.service.ts` (À créer)

```typescript
// TODO: Logger toutes les actions:
// - Connexions
// - Invitations
// - Acceptations/Rejets
// - Changements de statut
```

### 9. Configuration CORS

**Fichier:** `src/main.ts`

```typescript
// TODO: Configurer CORS pour frontend
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

### 10. Déploiement

```bash
# TODO: Avant déploiement
1. Configurer .env.production avec clés Supabase
2. Exécuter migrations: pnpm prisma migrate deploy
3. Tester endpoints avec Postman
4. Vérifier logs
5. Monitorer erreurs
```

---

## 🔑 Variables ENV Requises

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWKS_URL=https://your-project.supabase.co/auth/v1/.well-known/jwks.json

# JWT
JWT_AUDIENCE=authenticated
JWT_ISSUER=https://your-project.supabase.co/auth/v1
JWT_SECRET=prod_secret_key_min_32_chars

# Email
RESEND_API_KEY=re_xxxxx
SENDER_EMAIL=noreply@wlw.ma
FRONTEND_URL=https://app.wlw.ma

# Database
DATABASE_URL=postgresql://prod_user:prod_pass@prod_host:5432/creche
```

---

## 📚 Ressources

- [Supabase Auth Admin API](https://supabase.com/docs/reference/javascript/auth-admin-api)
- [Supabase JWT Verification](https://supabase.com/docs/guides/auth/jwts)
- [Resend Email API](https://resend.com/docs)
- [jsonwebtoken npm](https://www.npmjs.com/package/jsonwebtoken)

---

**Prêt à intégrer Supabase! 🚀**

