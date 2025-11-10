# 📚 Guide d'Utilisation - Documentation Swagger Complète

## 📁 Fichiers Créés

### 1. **SWAGGER_COMPLETE_CONFIG.ts**
- **Type**: Fichier TypeScript prêt à copier-coller
- **Contenu**: Configuration Swagger complète avec tous les endpoints documentés
- **Utilisation**: À intégrer dans `src/main.ts`

### 2. **SWAGGER_ENDPOINTS_DOCUMENTATION.md**
- **Type**: Fichier Markdown lisible
- **Contenu**: Documentation complète de tous les endpoints
- **Utilisation**: À consulter pour comprendre les endpoints

### 3. **SWAGGER_USAGE_GUIDE.md** (ce fichier)
- **Type**: Guide d'utilisation
- **Contenu**: Instructions pour utiliser les fichiers Swagger

---

## 🚀 Comment Utiliser

### Option 1: Utiliser le Fichier TypeScript (Recommandé)

#### Étape 1: Copier la Configuration
1. Ouvrir `SWAGGER_COMPLETE_CONFIG.ts`
2. Copier tout le contenu

#### Étape 2: Intégrer dans src/main.ts
1. Ouvrir `src/main.ts`
2. Ajouter l'import:
```typescript
import { setupSwagger } from './swagger.config';
```

3. Ajouter l'appel dans la fonction `bootstrap()`:
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ... autres configurations ...
  
  // Ajouter cette ligne
  setupSwagger(app);
  
  await app.listen(3000);
}
```

#### Étape 3: Redémarrer le Serveur
```bash
npm run start:dev
```

#### Étape 4: Accéder à Swagger
- Ouvrir: http://localhost:3000/api/docs
- Vous verrez la documentation complète avec tous les endpoints

---

### Option 2: Consulter la Documentation Markdown

1. Ouvrir `SWAGGER_ENDPOINTS_DOCUMENTATION.md`
2. Consulter les endpoints par catégorie:
   - 🔐 Auth Endpoints
   - 👥 Admin/Users Endpoints
   - ⚙️ Admin/Classes Endpoints
   - 📍 Presences Endpoints
   - 🍽️ Menus Endpoints
   - 📝 Daily-Resumes Endpoints
   - 👨‍👩‍👧 Parent Endpoints

---

## 📋 Structure de la Documentation

Chaque endpoint est documenté avec:

### 1. **Titre et Description**
```
POST /api/auth/login
Connexion Admin (DEV uniquement)
```

### 2. **Rôle Requis**
```
Rôle Requis: Public
```

### 3. **Request Body** (si applicable)
```json
{
  "email": "admin@wlw.ma",
  "password": "change_me"
}
```

### 4. **Success Response** (200, 201)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}
```

### 5. **Error Responses**
```
- 400: Email ou mot de passe incorrect
- 400: Endpoint non disponible en production
```

---

## 🔐 Authentification

### Admin Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wlw.ma",
    "password": "change_me"
  }'
```

### Utiliser le Token
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3000/api/admin/classes
```

---

## 👥 Rôles et Permissions

### ADMIN
- ✅ Accès complet à tous les endpoints
- ✅ Gestion des utilisateurs
- ✅ Gestion des classes
- ✅ Gestion des menus
- ✅ Gestion des résumés

### ENSEIGNANT
- ✅ Enregistrer les présences de ses classes
- ✅ Créer les résumés quotidiens
- ✅ Consulter les menus publiés
- ❌ Pas d'accès aux autres classes

### PARENT
- ✅ Consulter les présences de ses enfants
- ✅ Consulter les résumés de ses enfants
- ✅ Consulter les menus publiés
- ✅ Consulter les événements
- ❌ Pas d'accès aux autres enfants

---

## 📊 Cas d'Usage Principaux

### 1. Admin Login
```
POST /api/auth/login
→ Obtenir token admin
```

### 2. Créer un Utilisateur
```
POST /api/admin/users
→ Créer enseignant ou parent
```

### 3. Créer une Classe
```
POST /api/admin/classes
→ Créer une nouvelle classe
```

### 4. Assigner un Enseignant
```
POST /api/admin/classes/:classeId/enseignants/:enseignantId
→ Assigner enseignant à classe
```

### 5. Enregistrer les Présences
```
POST /api/presences
→ Enregistrer présence d'un enfant
```

### 6. Créer un Menu
```
POST /api/menus
→ Créer menu du jour
```

### 7. Publier un Menu
```
POST /api/menus/:id/publish
→ Publier menu pour parents
```

### 8. Créer un Résumé
```
POST /api/daily-resumes
→ Créer résumé quotidien enfant
```

### 9. Publier un Résumé
```
POST /api/daily-resumes/:id/publish
→ Publier résumé pour parents
```

### 10. Parent Consulte Infos
```
GET /api/parent/me
GET /api/parent/enfants/:id/presences
GET /api/parent/classes/:id/menu
GET /api/parent/enfants/:id/resume
```

---

## 🧪 Tester avec Postman

### 1. Importer la Collection
- Ouvrir Postman
- Cliquer "Import"
- Sélectionner `Creche-Admin-API.postman_collection.json`

### 2. Login Admin
- Aller à "🔐 Authentication" → "Login Admin"
- Cliquer "Send"
- Le token est automatiquement sauvegardé

### 3. Tester les Endpoints
- Tous les endpoints utilisent le token automatiquement
- Modifier les paramètres selon vos besoins
- Cliquer "Send"

---

## 🔍 Filtres et Pagination

### Filtres Disponibles

#### Presences
```
GET /api/presences?enfantId=xxx&dateMin=2025-11-01&dateMax=2025-11-30&page=1&pageSize=30
```

#### Menus
```
GET /api/menus?date=2025-11-09&statut=Publie&page=1&pageSize=10
```

#### Daily-Resumes
```
GET /api/daily-resumes?enfantId=xxx&dateMin=2025-11-01&dateMax=2025-11-30&page=1&pageSize=30
```

#### Users
```
GET /api/admin/users?role=ENSEIGNANT&statut=ACTIVE&q=Ahmed&page=1&limit=10
```

---

## ⚠️ Codes d'Erreur Courants

| Code | Signification | Solution |
|------|---------------|----------|
| 400 | Bad Request | Vérifier les données envoyées |
| 401 | Unauthorized | Vérifier le token JWT |
| 403 | Forbidden | Vérifier le rôle requis |
| 404 | Not Found | Vérifier l'ID de la ressource |
| 409 | Conflict | Ressource déjà existante |

---

## 📝 Exemples de Requêtes

### Créer un Utilisateur
```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "prenom": "Ahmed",
    "nom": "Dupont",
    "role": "ENSEIGNANT"
  }'
```

### Créer une Classe
```bash
curl -X POST http://localhost:3000/api/admin/classes \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Petite Section",
    "capacite": 15,
    "trancheAge": "2-3 ans",
    "active": true
  }'
```

### Enregistrer une Présence
```bash
curl -X POST http://localhost:3000/api/presences \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "enfantId": "enf_1",
    "date": "2025-11-09",
    "statut": "Present",
    "arriveeA": "08:30",
    "departA": "17:00"
  }'
```

### Créer un Menu
```bash
curl -X POST http://localhost:3000/api/menus \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-11-09",
    "entree": "Soupe de légumes",
    "plat": "Poulet rôti avec riz",
    "dessert": "Yaourt nature",
    "allergenes": ["Arachides", "Gluten", "Lait"]
  }'
```

---

## 🎯 Checklist de Déploiement

- [ ] Lire `SWAGGER_ENDPOINTS_DOCUMENTATION.md`
- [ ] Intégrer `SWAGGER_COMPLETE_CONFIG.ts` dans `src/main.ts`
- [ ] Redémarrer le serveur
- [ ] Accéder à http://localhost:3000/api/docs
- [ ] Tester le login admin
- [ ] Tester les endpoints admin
- [ ] Tester les endpoints parent
- [ ] Vérifier les filtres et pagination
- [ ] Vérifier les codes d'erreur

---

## 📞 Support

- **Documentation Complète**: `SWAGGER_ENDPOINTS_DOCUMENTATION.md`
- **Configuration Swagger**: `SWAGGER_COMPLETE_CONFIG.ts`
- **Collection Postman**: `Creche-Admin-API.postman_collection.json`
- **API Docs**: http://localhost:3000/api/docs
- **GitHub**: github.com:wlw-tech/creche-saas.git

---

## 🎉 Résumé

Vous avez maintenant:
- ✅ Documentation complète de tous les endpoints
- ✅ Fichier Swagger prêt à intégrer
- ✅ Exemples de requêtes
- ✅ Guide des rôles et permissions
- ✅ Codes d'erreur et solutions
- ✅ Collection Postman

**Prêt pour les tests et le déploiement!** 🚀

---

**Dernière mise à jour**: 2025-11-10

