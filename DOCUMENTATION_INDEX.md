# 📚 Index de Documentation - Crèche API

## 🎯 Démarrage Rapide

### Pour les Développeurs

1. **Première fois?** → Lire `AUTH_WORKFLOW_GUIDE.md`
2. **Tester les endpoints?** → Importer `POSTMAN_AUTH_COLLECTION.json` dans Postman
3. **Déployer?** → Suivre `DEPLOYMENT_CHECKLIST.md`

### Pour les DevOps

1. **Configuration?** → Voir `.env.example`
2. **Déploiement?** → Lire `DEPLOYMENT_CHECKLIST.md`
3. **Supabase?** → Consulter `SUPABASE_INTEGRATION_TODO.md`

---

## 📖 Documentation Complète

### 1. Architecture & Workflow

**Fichier:** `AUTH_WORKFLOW_GUIDE.md`

Contient:
- ✅ Architecture générale
- ✅ Modèle de données
- ✅ Flux d'authentification (DEV/PROD)
- ✅ Flux d'inscription
- ✅ Flux d'invitation enseignant
- ✅ Configuration ENV
- ✅ Tous les endpoints avec exemples
- ✅ Exemples curl/Postman
- ✅ Critères d'acceptation

**Quand l'utiliser:**
- Comprendre l'architecture
- Tester les endpoints
- Configurer l'environnement

---

### 2. Implémentation Complète

**Fichier:** `AUTH_IMPLEMENTATION_SUMMARY.md`

Contient:
- ✅ Résumé du travail effectué
- ✅ Fichiers créés/modifiés
- ✅ Modules & services
- ✅ Guards & sécurité
- ✅ Endpoints implémentés
- ✅ Flux métier
- ✅ Statistiques
- ✅ Prochaines étapes

**Quand l'utiliser:**
- Voir ce qui a été fait
- Comprendre la structure du code
- Planifier les prochaines étapes

---

### 3. Intégration Supabase

**Fichier:** `SUPABASE_INTEGRATION_TODO.md`

Contient:
- ✅ Configuration Supabase
- ✅ TODO pour SupabaseAdminService
- ✅ TODO pour JWT validation (PROD)
- ✅ TODO pour Email service
- ✅ TODO pour Refresh tokens
- ✅ TODO pour Tests
- ✅ TODO pour Audit trail
- ✅ Code snippets prêts à coller

**Quand l'utiliser:**
- Implémenter Supabase en production
- Ajouter email service
- Ajouter refresh tokens

---

### 4. Déploiement

**Fichier:** `DEPLOYMENT_CHECKLIST.md`

Contient:
- ✅ Checklist avant déploiement
- ✅ Configuration ENV (DEV/PROD)
- ✅ Commandes de déploiement
- ✅ Vérifications post-déploiement
- ✅ Troubleshooting

**Quand l'utiliser:**
- Avant de déployer
- Vérifier la configuration
- Dépanner les problèmes

---

### 5. Configuration

**Fichier:** `.env.example`

Contient:
- ✅ Template de configuration
- ✅ Variables DEV
- ✅ Variables PROD
- ✅ Commentaires explicatifs

**Quand l'utiliser:**
- Créer `.env` local
- Configurer production

---

### 6. Tests Postman

**Fichier:** `POSTMAN_AUTH_COLLECTION.json`

Contient:
- ✅ Collection Postman complète
- ✅ Tous les endpoints
- ✅ Variables (base_url, accessToken, etc)
- ✅ Exemples de payload

**Quand l'utiliser:**
- Tester les endpoints
- Valider l'implémentation
- Documenter les API

---

## 🗂️ Structure du Code

```
src/
├── common/
│   ├── decorators/
│   │   └── roles.decorator.ts          # @Roles(), @AllowedStatuses()
│   ├── guards/
│   │   ├── jwt-auth.guard.ts           # Validation JWT
│   │   └── roles.guard.ts              # Vérification rôles/statuts
│   └── services/
│       └── supabase-admin.service.ts   # Gestion Supabase (mockable)
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts          # POST /auth/login
│   │   ├── auth.module.ts
│   │   └── dto/
│   │       └── login.dto.ts
│   ├── users/
│   │   ├── users.controller.ts         # Admin endpoints
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── dto/
│   │       └── create-user.dto.ts
│   └── inscriptions/
│       ├── inscriptions-accept.controller.ts
│       ├── inscriptions-accept.service.ts
│       └── dto/
│           └── accept-inscription.dto.ts
└── prisma/
    ├── schema.prisma                   # Modèles + migrations
    └── migrations/
        └── 20251028002514_add_auth_users_model/
```

---

## 🔄 Flux de Travail

### 1. Développement Local

```bash
# Cloner le repo
git clone https://github.com/wlw-tech/creche-saas.git
cd creche-api

# Installer les dépendances
pnpm install

# Configurer .env
cp .env.example .env
# Éditer .env avec les valeurs locales

# Exécuter les migrations
pnpm prisma migrate dev

# Démarrer le serveur
pnpm start:dev

# Consulter Swagger
# http://localhost:3000/docs
```

### 2. Tester les Endpoints

```bash
# Importer POSTMAN_AUTH_COLLECTION.json dans Postman
# Ou utiliser curl:

# 1. Connexion
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wlw.ma","password":"change_me"}' \
  | jq -r '.accessToken')

# 2. Inviter enseignant
curl -X POST http://localhost:3000/api/admin/users/teachers/invite \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"prof@wlw.ma","prenom":"Ahmed","nom":"Dupont"}'
```

### 3. Déployer

```bash
# Suivre DEPLOYMENT_CHECKLIST.md
# 1. Configurer .env.production
# 2. Exécuter migrations
# 3. Builder
# 4. Démarrer
```

---

## 🆘 Aide Rapide

### Erreur: "Cannot find module"
→ Exécuter `pnpm install && pnpm prisma generate`

### Erreur: "Database connection failed"
→ Vérifier `DATABASE_URL` dans `.env`

### Erreur: "JWT invalid"
→ Vérifier `JWT_SECRET` et le token

### Erreur: "Supabase not configured"
→ Consulter `SUPABASE_INTEGRATION_TODO.md`

### Endpoint retourne 403
→ Vérifier le rôle et le statut de l'utilisateur

---

## 📞 Ressources

- **GitHub:** https://github.com/wlw-tech/creche-saas
- **Swagger:** http://localhost:3000/docs
- **Prisma Studio:** `pnpm prisma studio`
- **Supabase:** https://supabase.com

---

## ✅ Checklist de Lecture

- [ ] Lire `AUTH_WORKFLOW_GUIDE.md`
- [ ] Importer `POSTMAN_AUTH_COLLECTION.json`
- [ ] Tester les endpoints localement
- [ ] Lire `AUTH_IMPLEMENTATION_SUMMARY.md`
- [ ] Consulter `SUPABASE_INTEGRATION_TODO.md`
- [ ] Suivre `DEPLOYMENT_CHECKLIST.md`

---

**Prêt à commencer! 🚀**

