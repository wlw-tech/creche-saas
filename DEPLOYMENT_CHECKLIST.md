# 🚀 Checklist de Déploiement - Auth & Users

## ✅ Avant le Déploiement

### Code & Build

- [ ] Tous les fichiers compilent sans erreurs
  ```bash
  pnpm build
  ```

- [ ] Pas de warnings TypeScript
  ```bash
  pnpm lint
  ```

- [ ] Tests passent
  ```bash
  pnpm test:e2e
  ```

### Base de Données

- [ ] Migration appliquée
  ```bash
  pnpm prisma migrate deploy
  ```

- [ ] Prisma Client généré
  ```bash
  pnpm prisma generate
  ```

- [ ] Seed exécuté (si nécessaire)
  ```bash
  pnpm prisma db seed
  ```

### Configuration ENV

#### DEV (.env)

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/creche
NODE_ENV=development
ADMIN_EMAIL=admin@wlw.ma
ADMIN_PASSWORD=change_me
JWT_SECRET=super_secret_dev_key
```

- [ ] `.env` configuré localement
- [ ] `.env.example` à jour
- [ ] `.env` **jamais** commité

#### PROD (.env.production)

```bash
DATABASE_URL=postgresql://prod_user:prod_pass@prod_host:5432/creche
NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWKS_URL=https://your-project.supabase.co/auth/v1/.well-known/jwks.json
JWT_AUDIENCE=authenticated
JWT_ISSUER=https://your-project.supabase.co/auth/v1
JWT_SECRET=prod_secret_key_very_long_and_random
```

- [ ] Supabase configuré
- [ ] Clés API Supabase valides
- [ ] JWT_SECRET changé (min 32 caractères)
- [ ] DATABASE_URL pointant vers PROD

### Supabase (PROD)

- [ ] Projet Supabase créé
- [ ] Admin user créé dans Supabase
- [ ] Service Role key récupérée
- [ ] JWKS URL vérifiée
- [ ] Email provider configuré (pour invitations)

### Endpoints Testés

#### DEV

- [ ] POST /auth/login fonctionne
  ```bash
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@wlw.ma","password":"change_me"}'
  ```

- [ ] POST /admin/users/teachers/invite fonctionne
- [ ] GET /admin/users fonctionne
- [ ] POST /inscriptions/:id/accept fonctionne
- [ ] PATCH /inscriptions/:id/reject fonctionne

#### PROD

- [ ] JWT Supabase validé
- [ ] RolesGuard fonctionne
- [ ] Endpoints admin protégés
- [ ] Erreurs 403 si rôle insuffisant

### Documentation

- [ ] Swagger accessible: http://localhost:3000/docs
- [ ] Tous les endpoints documentés
- [ ] Exemples de payload/réponse présents
- [ ] Descriptions en français

### Sécurité

- [ ] JWT_SECRET changé en PROD
- [ ] Pas de secrets dans le code
- [ ] Rate-limiting activé
- [ ] CORS configuré si nécessaire
- [ ] HTTPS en PROD

### Monitoring

- [ ] Logs configurés
- [ ] Erreurs loggées
- [ ] Accès loggés (audit trail)

---

## 📋 Commandes de Déploiement

### DEV

```bash
# Installer les dépendances
pnpm install

# Configurer .env
cp .env.example .env
# Éditer .env avec les valeurs DEV

# Exécuter les migrations
pnpm prisma migrate dev

# Démarrer le serveur
pnpm start:dev

# Consulter Swagger
# http://localhost:3000/docs
```

### PROD

```bash
# Installer les dépendances
pnpm install --prod

# Configurer .env.production
# (Supabase, DATABASE_URL, JWT_SECRET, etc.)

# Exécuter les migrations
pnpm prisma migrate deploy

# Builder
pnpm build

# Démarrer
NODE_ENV=production pnpm start

# Vérifier la santé
curl http://localhost:3000/health
```

---

## 🔍 Vérifications Post-Déploiement

### Endpoints

- [ ] POST /auth/login retourne 200 + token
- [ ] POST /admin/users/teachers/invite retourne 201
- [ ] GET /admin/users retourne 200 + liste
- [ ] POST /inscriptions/:id/accept retourne 200
- [ ] PATCH /inscriptions/:id/reject retourne 200

### Erreurs

- [ ] 401 si token manquant
- [ ] 403 si rôle insuffisant
- [ ] 404 si ressource non trouvée
- [ ] 400 si données invalides

### Logs

- [ ] Connexions loggées
- [ ] Erreurs loggées
- [ ] Pas de secrets en logs

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

# Tester la connexion
pnpm prisma db execute --stdin < /dev/null
```

### Erreur: "JWT invalid"

```bash
# Vérifier JWT_SECRET
echo $JWT_SECRET

# Vérifier le token
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"token":"your_token"}'
```

### Erreur: "Supabase not configured"

```bash
# Vérifier les variables Supabase
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE
echo $SUPABASE_JWKS_URL
```

---

## 📞 Support

Pour toute question ou problème:

1. Consulter `AUTH_WORKFLOW_GUIDE.md`
2. Vérifier les logs: `pnpm start:dev 2>&1 | grep -i error`
3. Tester avec Postman: `POSTMAN_AUTH_COLLECTION.json`
4. Consulter Swagger: http://localhost:3000/docs

---

**Déploiement réussi! 🎉**

