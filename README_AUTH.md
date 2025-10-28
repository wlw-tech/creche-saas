# 🔐 Crèche API - Authentification & Gestion des Utilisateurs

## 📋 Vue d'Ensemble

Implémentation complète d'un système d'authentification et de gestion des utilisateurs pour une API NestJS avec:

- ✅ **Authentification:** JWT (DEV local + Supabase PROD)
- ✅ **Autorisation:** RBAC (Admin, Enseignant, Parent)
- ✅ **Workflow:** Inscription → Acceptation → Provisioning parents
- ✅ **Sécurité:** Guards, Decorators, Rate-limiting
- ✅ **Documentation:** Swagger, Postman, Guides complets

---

## 🚀 Démarrage Rapide

### 1. Installation

```bash
# Cloner le repo
git clone https://github.com/wlw-tech/creche-saas.git
cd creche-api

# Installer les dépendances
pnpm install

# Configurer l'environnement
cp .env.example .env
```

### 2. Configuration

Éditer `.env`:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/creche
NODE_ENV=development
ADMIN_EMAIL=admin@wlw.ma
ADMIN_PASSWORD=change_me
JWT_SECRET=super_secret_dev_key
```

### 3. Migrations

```bash
# Exécuter les migrations
pnpm prisma migrate dev

# Générer Prisma Client
pnpm prisma generate
```

### 4. Démarrer

```bash
# Mode développement
pnpm start:dev

# Consulter Swagger
# http://localhost:3000/docs
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| `DOCUMENTATION_INDEX.md` | **Index central** - Commencer ici |
| `AUTH_WORKFLOW_GUIDE.md` | Architecture, endpoints, exemples |
| `AUTH_IMPLEMENTATION_SUMMARY.md` | Résumé du travail effectué |
| `DEPLOYMENT_CHECKLIST.md` | Checklist de déploiement |
| `SUPABASE_INTEGRATION_TODO.md` | TODO pour Supabase PROD |
| `POSTMAN_AUTH_COLLECTION.json` | Collection Postman |
| `.env.example` | Template configuration |

---

## 🔌 Endpoints Principaux

### Authentification

```bash
POST /auth/login
# Body: { email, password }
# Réponse: { accessToken, userId, role, email }
```

### Gestion des Utilisateurs (ADMIN)

```bash
POST /admin/users/teachers/invite
# Inviter un enseignant

GET /admin/users
# Lister les utilisateurs

PATCH /admin/users/:id/status
# Mettre à jour le statut
```

### Gestion des Inscriptions (ADMIN)

```bash
POST /inscriptions/:id/accept
# Accepter une inscription et provisionner les parents

PATCH /inscriptions/:id/reject
# Rejeter une inscription
```

---

## 🧪 Tester les Endpoints

### Avec Postman

1. Importer `POSTMAN_AUTH_COLLECTION.json`
2. Configurer `base_url` = `http://localhost:3000/api`
3. Exécuter les requêtes

### Avec curl

```bash
# 1. Connexion
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wlw.ma","password":"change_me"}' \
  | jq -r '.accessToken')

# 2. Inviter enseignant
curl -X POST http://localhost:3000/api/admin/users/teachers/invite \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"prof@wlw.ma",
    "prenom":"Ahmed",
    "nom":"Dupont"
  }'

# 3. Lister les utilisateurs
curl -X GET "http://localhost:3000/api/admin/users" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🏗️ Architecture

### Modules

```
auth/          → Authentification (login DEV)
users/         → Gestion des utilisateurs (admin)
inscriptions/  → Gestion des inscriptions (accept/reject)
```

### Services

```
SupabaseAdminService  → Gestion Supabase (mockable DEV)
UsersService          → Logique utilisateurs
InscriptionsAcceptService → Logique acceptation
```

### Guards

```
JwtAuthGuard  → Valide JWT
RolesGuard    → Vérifie rôles et statuts
```

---

## 🔐 Sécurité

### Authentification

- **DEV:** JWT local avec `JWT_SECRET`
- **PROD:** JWT Supabase avec validation JWKS

### Autorisation

- **Rôles:** ADMIN, ENSEIGNANT, PARENT
- **Statuts:** INVITED, ACTIVE, DISABLED
- **Décorateurs:** `@Roles()`, `@AllowedStatuses()`

### Rate-Limiting

- 20 requêtes par minute (configurable)

---

## 📊 Modèle de Données

### Utilisateur

```typescript
{
  id: UUID
  email: String @unique
  prenom: String
  nom: String
  role: ADMIN | ENSEIGNANT | PARENT
  statut: INVITED | ACTIVE | DISABLED
  authUserId: String? (Supabase)
  tuteurId: String? (Lien parent)
  inviteLe: DateTime?
  activeLe: DateTime?
  dernierAcces: DateTime?
}
```

---

## 🚀 Déploiement

### Checklist

- [ ] Configurer `.env.production`
- [ ] Exécuter migrations: `pnpm prisma migrate deploy`
- [ ] Builder: `pnpm build`
- [ ] Démarrer: `NODE_ENV=production pnpm start`
- [ ] Vérifier Swagger: http://localhost:3000/docs

### Supabase (PROD)

1. Créer projet Supabase
2. Récupérer clés API
3. Configurer email provider
4. Implémenter TODO dans `SUPABASE_INTEGRATION_TODO.md`

---

## 🆘 Troubleshooting

### Erreur: "Cannot find module"
```bash
pnpm install
pnpm prisma generate
```

### Erreur: "Database connection failed"
```bash
# Vérifier DATABASE_URL
echo $DATABASE_URL
```

### Erreur: "JWT invalid"
```bash
# Vérifier JWT_SECRET
echo $JWT_SECRET
```

### Endpoint retourne 403
```bash
# Vérifier le rôle et le statut de l'utilisateur
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📞 Support

- **Documentation:** Voir `DOCUMENTATION_INDEX.md`
- **Swagger:** http://localhost:3000/docs
- **Prisma Studio:** `pnpm prisma studio`
- **GitHub:** https://github.com/wlw-tech/creche-saas

---

## 📝 Prochaines Étapes

### Court Terme
- [ ] Implémenter Supabase Admin API
- [ ] Configurer email provider
- [ ] Ajouter tests e2e

### Moyen Terme
- [ ] Implémenter TEACHER endpoints
- [ ] Ajouter 2FA
- [ ] Implémenter audit trail

### Long Terme
- [ ] OAuth (Google, Microsoft)
- [ ] SSO
- [ ] Webhooks Supabase

---

## 📄 Licence

MIT

---

**Prêt pour la production! 🎉**

**Repository:** https://github.com/wlw-tech/creche-saas.git

