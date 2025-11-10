import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('🏫 Crèche SaaS API - Documentation Complète')
    .setDescription(
      `
# 🏫 Crèche SaaS API - Documentation Complète

API complète pour la gestion d'une crèche avec:
- 👥 Gestion des utilisateurs (Admin, Enseignants, Parents)
- 📚 Gestion des classes
- 👶 Gestion des enfants et présences
- 🍽️ Gestion des menus
- 📝 Résumés quotidiens
- 📅 Événements et calendrier

## 🔐 Authentification

### Admin (DEV uniquement)
\`\`\`json
{
  "email": "admin@wlw.ma",
  "password": "change_me"
}
\`\`\`

### Utilisateurs (Teachers/Parents)
\`\`\`json
{
  "email": "user@example.com",
  "password": "temporary_password_from_db"
}
\`\`\`

## 👥 Rôles et Permissions

| Rôle | Permissions |
|------|-------------|
| **ADMIN** | Accès complet à tous les endpoints |
| **ENSEIGNANT** | Gestion des classes assignées, présences, résumés |
| **PARENT** | Accès lecture aux enfants, présences, menus |

## 📊 Codes de Réponse

| Code | Signification |
|------|---------------|
| 200 | OK - Succès |
| 201 | Created - Ressource créée |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Token manquant/invalide |
| 403 | Forbidden - Rôle insuffisant |
| 404 | Not Found - Ressource non trouvée |
| 409 | Conflict - Ressource déjà existante |

## 🔗 Endpoints Disponibles

### Auth (3 endpoints)
- POST /api/auth/login - Connexion admin
- POST /api/auth/login-user - Connexion utilisateur
- POST /api/auth/change-password - Changer mot de passe

### Admin/Users (5 endpoints)
- POST /api/admin/users - Créer utilisateur
- GET /api/admin/users - Lister utilisateurs
- GET /api/admin/users/:id - Détails utilisateur
- PATCH /api/admin/users/:id/status - Changer statut
- DELETE /api/admin/users/:id - Supprimer utilisateur

### Admin/Classes (8 endpoints)
- POST /api/admin/classes - Créer classe
- GET /api/admin/classes - Lister classes
- GET /api/admin/classes/:id - Détails classe
- PATCH /api/admin/classes/:id - Modifier classe
- DELETE /api/admin/classes/:id - Supprimer classe
- GET /api/admin/classes/:id/enfants - Enfants de la classe
- POST /api/admin/classes/:classeId/enseignants/:enseignantId - Assigner enseignant
- DELETE /api/admin/classes/:classeId/enseignants/:enseignantId - Retirer enseignant

### Presences (3 endpoints)
- GET /api/presences - Lister présences
- POST /api/presences - Créer présence
- POST /api/presences/class - Présences par classe

### Menus (7 endpoints)
- POST /api/menus - Créer menu
- GET /api/menus - Lister menus
- GET /api/menus/today - Menu du jour
- GET /api/menus/:id - Détails menu
- PATCH /api/menus/:id - Modifier menu
- POST /api/menus/:id/publish - Publier menu
- DELETE /api/menus/:id - Supprimer menu

### Daily-Resumes (6 endpoints)
- POST /api/daily-resumes - Créer résumé
- GET /api/daily-resumes - Lister résumés
- GET /api/daily-resumes/:id - Détails résumé
- PATCH /api/daily-resumes/:id - Modifier résumé
- POST /api/daily-resumes/:id/publish - Publier résumé
- DELETE /api/daily-resumes/:id - Supprimer résumé

### Parent (7 endpoints)
- GET /api/parent/me - Profil parent
- PATCH /api/parent/me - Modifier profil
- GET /api/parent/enfants/:id/presences - Présences enfant
- GET /api/parent/classes/:id/menu - Menu classe
- GET /api/parent/enfants/:id/resume - Résumé enfant
- GET /api/parent/classes/:id/journal/latest - Journal classe
- GET /api/parent/events - Événements

## 📝 Exemples de Requêtes

### Login Admin
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "admin@wlw.ma",
    "password": "change_me"
  }'
\`\`\`

### Créer Classe
\`\`\`bash
curl -X POST http://localhost:3000/api/admin/classes \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "nom": "Classe A",
    "niveau": "PS",
    "capacite": 20
  }'
\`\`\`

### Créer Menu
\`\`\`bash
curl -X POST http://localhost:3000/api/menus \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "date": "2025-11-10",
    "entree": "Salade",
    "plat": "Poulet riz",
    "dessert": "Fruit",
    "allergenes": ["Arachides"]
  }'
\`\`\`

## ⚠️ Cas d'Erreur Courants

### 400 Bad Request
\`\`\`json
{
  "statusCode": 400,
  "message": "Email ou mot de passe incorrect",
  "error": "Bad Request"
}
\`\`\`

### 401 Unauthorized
\`\`\`json
{
  "statusCode": 401,
  "message": "Token invalide ou expiré",
  "error": "Unauthorized"
}
\`\`\`

### 403 Forbidden
\`\`\`json
{
  "statusCode": 403,
  "message": "Rôle insuffisant pour accéder à cette ressource",
  "error": "Forbidden"
}
\`\`\`

### 404 Not Found
\`\`\`json
{
  "statusCode": 404,
  "message": "Ressource non trouvée",
  "error": "Not Found"
}
\`\`\`

### 409 Conflict
\`\`\`json
{
  "statusCode": 409,
  "message": "Email déjà utilisé",
  "error": "Conflict"
}
\`\`\`
      `,
    )
    .setVersion('1.0.0')
    .setContact(
      'Support',
      'https://github.com/wlw-tech/creche-saas',
      'support@creche-saas.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtenu après login (24h expiry)',
      },
      'bearer',
    )
    .addTag('🔐 Auth', 'Endpoints d\'authentification')
    .addTag('👥 Admin/Users', 'Gestion des utilisateurs (Admin)')
    .addTag('⚙️ Admin/Classes', 'Gestion des classes (Admin)')
    .addTag('📍 Presences', 'Gestion des présences')
    .addTag('🍽️ Menus', 'Gestion des menus')
    .addTag('📝 Daily-Resumes', 'Résumés quotidiens des enfants')
    .addTag('👨‍👩‍👧 Parent', 'Endpoints pour les parents')
    .addTag('👨‍👩‍👧 Familles', 'Gestion des familles')
    .addTag('📋 Inscriptions', 'Gestion des inscriptions')
    .addTag('📅 Events', 'Gestion des événements')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  console.log('✅ Swagger documentation available at http://localhost:3000/api/docs');
}

