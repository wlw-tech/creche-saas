/**
 * SWAGGER COMPLETE CONFIGURATION
 * Fichier prêt à copier-coller dans src/main.ts
 * 
 * Contient la documentation complète de tous les endpoints
 * avec les cas de succès, erreurs et rôles requis
 */

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('🏥 Crèche SaaS API - Documentation Complète')
    .setDescription(`
      # 📚 Documentation Complète de l'API Crèche SaaS
      
      ## 🔐 Authentification
      - **Admin**: Email: admin@wlw.ma | Password: change_me
      - **Utilisateurs**: Créés par l'admin avec mot de passe temporaire
      
      ## 👥 Rôles
      - **ADMIN**: Accès complet à tous les endpoints
      - **ENSEIGNANT**: Accès aux classes assignées et présences
      - **PARENT**: Accès aux enfants et informations publiques
      
      ## 📊 Statuts Utilisateur
      - **INVITED**: En attente d'activation
      - **ACTIVE**: Utilisateur actif
      - **DISABLED**: Utilisateur désactivé
      
      ## 📋 Statuts Présence
      - **Present**: Enfant présent
      - **Absent**: Enfant absent
      - **Justifie**: Absence justifiée
      
      ## 🎯 Cas d'Usage Principaux
      1. **Admin Login** → Obtenir token admin
      2. **Créer Utilisateurs** → Inviter enseignants/parents
      3. **Gérer Classes** → CRUD complet
      4. **Enregistrer Présences** → Quotidien
      5. **Créer Menus** → Publier pour parents
      6. **Créer Résumés** → Journaliers par enfant
      7. **Parent Dashboard** → Consulter infos enfants
    `)
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Token obtenu via /api/auth/login',
      },
      'bearer',
    )
    .addTag('Auth', 'Endpoints d\'authentification')
    .addTag('Admin/Users', 'Gestion des utilisateurs (ADMIN)')
    .addTag('Admin/Classes', 'Gestion des classes (ADMIN)')
    .addTag('Presences', 'Gestion des présences')
    .addTag('Menus', 'Gestion des menus')
    .addTag('Daily-Resumes', 'Résumés quotidiens des enfants')
    .addTag('Class-Daily-Summaries', 'Résumés collectifs des classes')
    .addTag('Parent', 'Dashboard parent')
    .addTag('Inscriptions', 'Gestion des inscriptions')
    .addTag('Events', 'Gestion des événements')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}

/**
 * ============================================================================
 * ENDPOINTS DOCUMENTATION
 * ============================================================================
 */

/**
 * 🔐 AUTH ENDPOINTS
 * ============================================================================
 */

/**
 * POST /api/auth/login
 * 
 * Connexion Admin (DEV uniquement)
 * 
 * RÔLE REQUIS: Aucun (public)
 * 
 * REQUEST BODY:
 * {
 *   "email": "admin@wlw.ma",
 *   "password": "change_me"
 * }
 * 
 * SUCCESS (200):
 * {
 *   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "userId": "admin_dev",
 *   "role": "ADMIN",
 *   "email": "admin@wlw.ma"
 * }
 * 
 * ERRORS:
 * - 400: Email ou mot de passe incorrect
 * - 400: Endpoint non disponible en production
 */

/**
 * POST /api/auth/login-user
 * 
 * Connexion Utilisateur (Enseignant/Parent)
 * 
 * RÔLE REQUIS: Aucun (public)
 * 
 * REQUEST BODY:
 * {
 *   "email": "teacher@example.com",
 *   "password": "tempPassword123"
 * }
 * 
 * SUCCESS (200):
 * {
 *   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "userId": "usr_123",
 *   "role": "ENSEIGNANT",
 *   "email": "teacher@example.com"
 * }
 * 
 * ERRORS:
 * - 400: Email ou mot de passe incorrect
 * - 400: Utilisateur non trouvé
 */

/**
 * POST /api/auth/change-password
 * 
 * Changer le mot de passe
 * 
 * RÔLE REQUIS: ADMIN, ENSEIGNANT, PARENT (authentifié)
 * 
 * REQUEST BODY:
 * {
 *   "oldPassword": "tempPassword123",
 *   "newPassword": "newPassword456",
 *   "confirmPassword": "newPassword456"
 * }
 * 
 * SUCCESS (200):
 * {
 *   "success": true,
 *   "message": "Mot de passe changé avec succès"
 * }
 * 
 * ERRORS:
 * - 400: Ancien mot de passe incorrect
 * - 400: Les mots de passe ne correspondent pas
 * - 401: Non authentifié
 */

/**
 * ============================================================================
 * 👥 ADMIN/USERS ENDPOINTS
 * ============================================================================
 */

/**
 * POST /api/admin/users
 * 
 * Créer un utilisateur (Enseignant ou Parent)
 * 
 * RÔLE REQUIS: ADMIN
 * 
 * REQUEST BODY:
 * {
 *   "email": "teacher@example.com",
 *   "prenom": "Ahmed",
 *   "nom": "Dupont",
 *   "role": "ENSEIGNANT"
 * }
 * 
 * SUCCESS (201):
 * {
 *   "utilisateurId": "usr_789",
 *   "email": "teacher@example.com",
 *   "role": "ENSEIGNANT",
 *   "statut": "INVITED",
 *   "invited": true
 * }
 * 
 * ERRORS:
 * - 400: Email déjà utilisé
 * - 400: Données invalides
 * - 401: Non authentifié
 * - 403: Accès refusé (ADMIN requis)
 */

/**
 * GET /api/admin/users
 * 
 * Lister les utilisateurs
 * 
 * RÔLE REQUIS: ADMIN
 * 
 * QUERY PARAMETERS:
 * - role: ADMIN | ENSEIGNANT | PARENT (optionnel)
 * - statut: INVITED | ACTIVE | DISABLED (optionnel)
 * - q: Recherche par email/prénom/nom (optionnel)
 * - page: Numéro de page (optionnel, défaut: 1)
 * - limit: Nombre d'éléments par page (optionnel, défaut: 10)
 * 
 * SUCCESS (200):
 * {
 *   "data": [
 *     {
 *       "id": "usr_123",
 *       "email": "prof@mail.com",
 *       "prenom": "Ahmed",
 *       "nom": "Dupont",
 *       "role": "ENSEIGNANT",
 *       "statut": "ACTIVE"
 *     }
 *   ],
 *   "pagination": {
 *     "page": 1,
 *     "limit": 10,
 *     "total": 50,
 *     "pages": 5
 *   }
 * }
 * 
 * ERRORS:
 * - 401: Non authentifié
 * - 403: Accès refusé (ADMIN requis)
 */

/**
 * GET /api/admin/users/:id
 * 
 * Obtenir un utilisateur
 * 
 * RÔLE REQUIS: ADMIN
 * 
 * SUCCESS (200):
 * {
 *   "id": "usr_123",
 *   "email": "prof@mail.com",
 *   "prenom": "Ahmed",
 *   "nom": "Dupont",
 *   "role": "ENSEIGNANT",
 *   "statut": "ACTIVE",
 *   "creeLe": "2025-11-01T10:00:00Z"
 * }
 * 
 * ERRORS:
 * - 404: Utilisateur non trouvé
 * - 401: Non authentifié
 * - 403: Accès refusé (ADMIN requis)
 */

/**
 * PATCH /api/admin/users/:id/status
 * 
 * Mettre à jour le statut d'un utilisateur
 * 
 * RÔLE REQUIS: ADMIN
 * 
 * REQUEST BODY:
 * {
 *   "statut": "ACTIVE"
 * }
 * 
 * SUCCESS (200):
 * {
 *   "id": "usr_123",
 *   "email": "prof@mail.com",
 *   "statut": "ACTIVE",
 *   "activeLe": "2025-11-01T10:00:00Z"
 * }
 * 
 * ERRORS:
 * - 404: Utilisateur non trouvé
 * - 400: Statut invalide
 * - 401: Non authentifié
 * - 403: Accès refusé (ADMIN requis)
 */

/**
 * DELETE /api/admin/users/:id
 * 
 * Supprimer un utilisateur
 * 
 * RÔLE REQUIS: ADMIN
 * 
 * SUCCESS (200):
 * {
 *   "message": "Utilisateur supprimé avec succès",
 *   "id": "usr_123"
 * }
 * 
 * ERRORS:
 * - 404: Utilisateur non trouvé
 * - 401: Non authentifié
 * - 403: Accès refusé (ADMIN requis)
 */

/**
 * ============================================================================
 * ⚙️ ADMIN/CLASSES ENDPOINTS
 * ============================================================================
 */

/**
 * POST /api/admin/classes
 * 
 * Créer une classe
 * 
 * RÔLE REQUIS: ADMIN
 * 
 * REQUEST BODY:
 * {
 *   "nom": "Petite Section",
 *   "capacite": 15,
 *   "trancheAge": "2-3 ans",
 *   "active": true
 * }
 * 
 * SUCCESS (201):
 * {
 *   "id": "cls_123",
 *   "nom": "Petite Section",
 *   "capacite": 15,
 *   "trancheAge": "2-3 ans",
 *   "active": true,
 *   "creeLe": "2025-11-01T10:00:00Z"
 * }
 * 
 * ERRORS:
 * - 400: Données invalides
 * - 401: Non authentifié
 * - 403: Accès refusé (ADMIN requis)
 */

/**
 * GET /api/admin/classes
 * 
 * Lister toutes les classes
 * 
 * RÔLE REQUIS: ADMIN
 * 
 * SUCCESS (200):
 * [
 *   {
 *     "id": "cls_123",
 *     "nom": "Petite Section",
 *     "capacite": 15,
 *     "trancheAge": "2-3 ans",
 *     "active": true
 *   }
 * ]
 * 
 * ERRORS:
 * - 401: Non authentifié
 * - 403: Accès refusé (ADMIN requis)
 */

/**
 * GET /api/admin/classes/:id
 * 
 * Obtenir une classe
 * 
 * RÔLE REQUIS: ADMIN
 * 
 * SUCCESS (200):
 * {
 *   "id": "cls_123",
 *   "nom": "Petite Section",
 *   "capacite": 15,
 *   "trancheAge": "2-3 ans",
 *   "active": true,
 *   "enseignants": [
 *     {
 *       "id": "ens_1",
 *       "utilisateur": {
 *         "prenom": "Ahmed",
 *         "nom": "Dupont"
 *       }
 *     }
 *   ]
 * }
 * 
 * ERRORS:
 * - 404: Classe non trouvée
 * - 401: Non authentifié
 * - 403: Accès refusé (ADMIN requis)
 */

/**
 * PATCH /api/admin/classes/:id
 * 
 * Modifier une classe
 * 
 * RÔLE REQUIS: ADMIN
 * 
 * REQUEST BODY:
 * {
 *   "nom": "Petite Section A",
 *   "capacite": 20
 * }
 * 
 * SUCCESS (200):
 * {
 *   "id": "cls_123",
 *   "nom": "Petite Section A",
 *   "capacite": 20,
 *   "trancheAge": "2-3 ans",
 *   "active": true
 * }
 * 
 * ERRORS:
 * - 404: Classe non trouvée
 * - 400: Données invalides
 * - 401: Non authentifié
 * - 403: Accès refusé (ADMIN requis)
 */

/**
 * DELETE /api/admin/classes/:id
 * 
 * Supprimer une classe
 * 
 * RÔLE REQUIS: ADMIN
 * 
 * SUCCESS (200):
 * {
 *   "message": "Classe supprimée avec succès",
 *   "id": "cls_123"
 * }
 * 
 * ERRORS:
 * - 404: Classe non trouvée
 * - 401: Non authentifié
 * - 403: Accès refusé (ADMIN requis)
 */

/**
 * GET /api/admin/classes/:classeId/enfants
 * 
 * Voir tous les enfants d'une classe avec statut de présence
 * 
 * RÔLE REQUIS: ADMIN
 * 
 * QUERY PARAMETERS:
 * - date: Date pour filtrer les présences (optionnel, format: YYYY-MM-DD)
 * 
 * SUCCESS (200):
 * {
 *   "data": [
 *     {
 *       "id": "enf_1",
 *       "prenom": "Alice",
 *       "nom": "Dupont",
 *       "dateNaissance": "2020-05-15",
 *       "presenceAujourdhui": {
 *         "id": "pres_1",
 *         "date": "2025-11-09",
 *         "statut": "Present",
 *         "arriveeA": "08:30",
 *         "departA": "17:00"
 *       }
 *     }
 *   ],
 *   "total": 15,
 *   "presents": 14,
 *   "absents": 1
 * }
 * 
 * ERRORS:
 * - 404: Classe non trouvée
 * - 401: Non authentifié
 * - 403: Accès refusé (ADMIN requis)
 */

/**
 * POST /api/admin/classes/:classeId/enseignants/:enseignantId
 * 
 * Assigner un enseignant à une classe
 * 
 * RÔLE REQUIS: ADMIN
 * 
 * SUCCESS (200):
 * {
 *   "message": "Enseignant assigné à la classe avec succès",
 *   "enseignantId": "ens_123",
 *   "utilisateurId": "usr_456",
 *   "classeId": "cls_789",
 *   "classe": {
 *     "id": "cls_789",
 *     "nom": "Petite Section"
 *   }
 * }
 * 
 * ERRORS:
 * - 404: Utilisateur ou classe non trouvé
 * - 400: L'utilisateur n'est pas un enseignant
 * - 401: Non authentifié
 * - 403: Accès refusé (ADMIN requis)
 */

/**
 * DELETE /api/admin/classes/:classeId/enseignants/:enseignantId
 * 
 * Retirer un enseignant d'une classe
 * 
 * RÔLE REQUIS: ADMIN
 * 
 * SUCCESS (200):
 * {
 *   "message": "Enseignant retiré de la classe avec succès"
 * }
 * 
 * ERRORS:
 * - 404: Enseignant ou classe non trouvé
 * - 401: Non authentifié
 * - 403: Accès refusé (ADMIN requis)
 */

/**
 * ============================================================================
 * 📍 PRESENCES ENDPOINTS
 * ============================================================================
 */

/**
 * GET /api/presences
 * 
 * Récupérer les présences
 * 
 * RÔLE REQUIS: ADMIN, ENSEIGNANT, PARENT
 * 
 * RBAC:
 * - ADMIN: Toutes les présences
 * - ENSEIGNANT: Présences de ses classes
 * - PARENT: Présences de ses enfants
 * 
 * QUERY PARAMETERS:
 * - enfantId: Filtrer par enfant (optionnel)
 * - classeId: Filtrer par classe (optionnel)
 * - dateMin: Date minimum (optionnel, format: YYYY-MM-DD)
 * - dateMax: Date maximum (optionnel, format: YYYY-MM-DD)
 * - statut: Present | Absent | Justifie (optionnel)
 * - page: Numéro de page (optionnel, défaut: 1)
 * - pageSize: Nombre d'éléments par page (optionnel, défaut: 30)
 * 
 * SUCCESS (200):
 * {
 *   "data": [
 *     {
 *       "id": "pres_1",
 *       "date": "2025-11-09",
 *       "statut": "Present",
 *       "arriveeA": "08:30",
 *       "departA": "17:00",
 *       "enfant": {
 *         "id": "enf_1",
 *         "prenom": "Alice",
 *         "nom": "Dupont"
 *       }
 *     }
 *   ],
 *   "pagination": {
 *     "page": 1,
 *     "pageSize": 30,
 *     "total": 100,
 *     "hasNext": true
 *   }
 * }
 * 
 * ERRORS:
 * - 401: Non authentifié
 * - 403: Accès refusé
 */

/**
 * POST /api/presences
 * 
 * Enregistrer une présence
 * 
 * RÔLE REQUIS: ADMIN, ENSEIGNANT
 * 
 * RBAC:
 * - ADMIN: Peut enregistrer pour tous les enfants
 * - ENSEIGNANT: Peut enregistrer pour ses classes
 * 
 * REQUEST BODY:
 * {
 *   "enfantId": "enf_1",
 *   "date": "2025-11-09",
 *   "statut": "Present",
 *   "arriveeA": "08:30",
 *   "departA": "17:00"
 * }
 * 
 * SUCCESS (201):
 * {
 *   "id": "pres_1",
 *   "date": "2025-11-09",
 *   "statut": "Present",
 *   "arriveeA": "08:30",
 *   "departA": "17:00",
 *   "enfantId": "enf_1"
 * }
 * 
 * ERRORS:
 * - 400: Données invalides
 * - 401: Non authentifié
 * - 403: Accès refusé
 * - 404: Enfant non trouvé
 */

/**
 * POST /api/presences/class
 * 
 * Enregistrer les présences d'une classe
 * 
 * RÔLE REQUIS: ADMIN, ENSEIGNANT
 * 
 * REQUEST BODY:
 * {
 *   "classeId": "cls_1",
 *   "date": "2025-11-09",
 *   "presences": [
 *     {
 *       "enfantId": "enf_1",
 *       "statut": "Present",
 *       "arriveeA": "08:30",
 *       "departA": "17:00"
 *     }
 *   ]
 * }
 * 
 * SUCCESS (201):
 * {
 *   "message": "Présences enregistrées avec succès",
 *   "count": 15,
 *   "classeId": "cls_1",
 *   "date": "2025-11-09"
 * }
 * 
 * ERRORS:
 * - 400: Données invalides
 * - 401: Non authentifié
 * - 403: Accès refusé
 * - 404: Classe non trouvée
 */

/**
 * ============================================================================
 * 🍽️ MENUS ENDPOINTS
 * ============================================================================
 */

/**
 * POST /api/menus
 * 
 * Créer un menu
 * 
 * RÔLE REQUIS: ADMIN
 * 
 * REQUEST BODY:
 * {
 *   "date": "2025-11-09",
 *   "entree": "Soupe de légumes",
 *   "plat": "Poulet rôti avec riz",
 *   "dessert": "Yaourt nature",
 *   "allergenes": ["Arachides", "Gluten", "Lait"]
 * }
 * 
 * SUCCESS (201):
 * {
 *   "id": "menu_1",
 *   "date": "2025-11-09",
 *   "entree": "Soupe de légumes",
 *   "plat": "Poulet rôti avec riz",
 *   "dessert": "Yaourt nature",
 *   "statut": "Brouillon",
 *   "allergenes": ["Arachides", "Gluten", "Lait"]
 * }
 * 
 * ERRORS:
 * - 400: Un menu existe déjà pour cette date
 * - 400: Données invalides
 * - 401: Non authentifié
 * - 403: Accès refusé (ADMIN requis)
 */

/**
 * GET /api/menus
 * 
 * Récupérer les menus
 * 
 * RÔLE REQUIS: ADMIN, ENSEIGNANT, PARENT
 * 
 * RBAC:
 * - ADMIN: Tous les menus
 * - ENSEIGNANT/PARENT: Menus publiés uniquement
 * 
 * QUERY PARAMETERS:
 * - date: Filtrer par date (optionnel, format: YYYY-MM-DD)
 * - statut: Brouillon | Publie (optionnel)
 * - page: Numéro de page (optionnel, défaut: 1)
 * - pageSize: Nombre d'éléments par page (optionnel, défaut: 10)
 * 
 * SUCCESS (200):
 * {
 *   "data": [
 *     {
 *       "id": "menu_1",
 *       "date": "2025-11-09",
 *       "entree": "Soupe de légumes",
 *       "plat": "Poulet rôti avec riz",
 *       "dessert": "Yaourt nature",
 *       "statut": "Publie",
 *       "allergenes": ["Arachides", "Gluten", "Lait"]
 *     }
 *   ],
 *   "pagination": {
 *     "page": 1,
 *     "pageSize": 10,
 *     "total": 30,
 *     "hasNext": true
 *   }
 * }
 * 
 * ERRORS:
 * - 401: Non authentifié
 */

/**
 * GET /api/menus/today
 * 
 * Récupérer le menu du jour
 * 
 * RÔLE REQUIS: Aucun (public)
 * 
 * SUCCESS (200):
 * {
 *   "id": "menu_1",
 *   "date": "2025-11-09",
 *   "entree": "Soupe de légumes",
 *   "plat": "Poulet rôti avec riz",
 *   "dessert": "Yaourt nature",
 *   "statut": "Publie"
 * }
 * 
 * ERRORS:
 * - 404: Aucun menu pour aujourd'hui
 */

/**
 * GET /api/menus/:id
 * 
 * Obtenir un menu
 * 
 * RÔLE REQUIS: ADMIN, ENSEIGNANT, PARENT
 * 
 * SUCCESS (200):
 * {
 *   "id": "menu_1",
 *   "date": "2025-11-09",
 *   "entree": "Soupe de légumes",
 *   "plat": "Poulet rôti avec riz",
 *   "dessert": "Yaourt nature",
 *   "statut": "Publie",
 *   "allergenes": ["Arachides", "Gluten", "Lait"]
 * }
 * 
 * ERRORS:
 * - 404: Menu non trouvé
 * - 401: Non authentifié
 */

/**
 * PATCH /api/menus/:id
 * 
 * Modifier un menu
 * 
 * RÔLE REQUIS: ADMIN
 * 
 * REQUEST BODY:
 * {
 *   "entree": "Soupe de tomates",
 *   "plat": "Poulet rôti avec légumes"
 * }
 * 
 * SUCCESS (200):
 * {
 *   "id": "menu_1",
 *   "date": "2025-11-09",
 *   "entree": "Soupe de tomates",
 *   "plat": "Poulet rôti avec légumes",
 *   "dessert": "Yaourt nature",
 *   "statut": "Brouillon"
 * }
 * 
 * ERRORS:
 * - 404: Menu non trouvé
 * - 400: Données invalides
 * - 401: Non authentifié
 * - 403: Accès refusé (ADMIN requis)
 */

/**
 * POST /api/menus/:id/publish
 * 
 * Publier un menu
 * 
 * RÔLE REQUIS: ADMIN
 * 
 * SUCCESS (200):
 * {
 *   "id": "menu_1",
 *   "date": "2025-11-09",
 *   "statut": "Publie",
 *   "publieLe": "2025-11-09T08:00:00Z"
 * }
 * 
 * ERRORS:
 * - 404: Menu non trouvé
 * - 400: Menu déjà publié
 * - 401: Non authentifié
 * - 403: Accès refusé (ADMIN requis)
 */

/**
 * DELETE /api/menus/:id
 * 
 * Supprimer un menu
 * 
 * RÔLE REQUIS: ADMIN
 * 
 * SUCCESS (200):
 * {
 *   "message": "Menu supprimé avec succès",
 *   "id": "menu_1"
 * }
 * 
 * ERRORS:
 * - 404: Menu non trouvé
 * - 401: Non authentifié
 * - 403: Accès refusé (ADMIN requis)
 */

/**
 * ============================================================================
 * 📝 DAILY-RESUMES ENDPOINTS
 * ============================================================================
 */

/**
 * POST /api/daily-resumes
 * 
 * Créer un résumé quotidien
 * 
 * RÔLE REQUIS: ADMIN, ENSEIGNANT
 * 
 * REQUEST BODY:
 * {
 *   "enfantId": "enf_1",
 *   "date": "2025-11-09",
 *   "humeur": "Excellent",
 *   "appetit": "Bon",
 *   "sieste": "Excellent",
 *   "participation": "Excellent",
 *   "activites": "Jeux libres, peinture, chansons",
 *   "observations": "Très actif et joyeux"
 * }
 * 
 * SUCCESS (201):
 * {
 *   "id": "resume_1",
 *   "enfantId": "enf_1",
 *   "date": "2025-11-09",
 *   "humeur": "Excellent",
 *   "appetit": "Bon",
 *   "sieste": "Excellent",
 *   "participation": "Excellent",
 *   "activites": "Jeux libres, peinture, chansons",
 *   "observations": "Très actif et joyeux",
 *   "statut": "Brouillon"
 * }
 * 
 * ERRORS:
 * - 400: Données invalides
 * - 401: Non authentifié
 * - 403: Accès refusé
 * - 404: Enfant non trouvé
 */

/**
 * GET /api/daily-resumes
 * 
 * Récupérer les résumés quotidiens
 * 
 * RÔLE REQUIS: ADMIN, ENSEIGNANT, PARENT
 * 
 * RBAC:
 * - ADMIN: Tous les résumés
 * - ENSEIGNANT: Résumés de ses classes
 * - PARENT: Résumés de ses enfants
 * 
 * QUERY PARAMETERS:
 * - enfantId: Filtrer par enfant (optionnel)
 * - classeId: Filtrer par classe (optionnel)
 * - dateMin: Date minimum (optionnel, format: YYYY-MM-DD)
 * - dateMax: Date maximum (optionnel, format: YYYY-MM-DD)
 * - statut: Brouillon | Publie (optionnel)
 * - page: Numéro de page (optionnel, défaut: 1)
 * - pageSize: Nombre d'éléments par page (optionnel, défaut: 30)
 * 
 * SUCCESS (200):
 * {
 *   "data": [
 *     {
 *       "id": "resume_1",
 *       "enfantId": "enf_1",
 *       "date": "2025-11-09",
 *       "humeur": "Excellent",
 *       "statut": "Publie",
 *       "enfant": {
 *         "prenom": "Alice",
 *         "nom": "Dupont"
 *       }
 *     }
 *   ],
 *   "pagination": {
 *     "page": 1,
 *     "pageSize": 30,
 *     "total": 100,
 *     "hasNext": true
 *   }
 * }
 * 
 * ERRORS:
 * - 401: Non authentifié
 * - 403: Accès refusé
 */

/**
 * GET /api/daily-resumes/:id
 * 
 * Obtenir un résumé quotidien
 * 
 * RÔLE REQUIS: ADMIN, ENSEIGNANT, PARENT
 * 
 * SUCCESS (200):
 * {
 *   "id": "resume_1",
 *   "enfantId": "enf_1",
 *   "date": "2025-11-09",
 *   "humeur": "Excellent",
 *   "appetit": "Bon",
 *   "sieste": "Excellent",
 *   "participation": "Excellent",
 *   "activites": "Jeux libres, peinture, chansons",
 *   "observations": "Très actif et joyeux",
 *   "statut": "Publie"
 * }
 * 
 * ERRORS:
 * - 404: Résumé non trouvé
 * - 401: Non authentifié
 * - 403: Accès refusé
 */

/**
 * PATCH /api/daily-resumes/:id
 * 
 * Modifier un résumé quotidien
 * 
 * RÔLE REQUIS: ADMIN, ENSEIGNANT
 * 
 * REQUEST BODY:
 * {
 *   "humeur": "Très bon",
 *   "observations": "Enfant très actif"
 * }
 * 
 * SUCCESS (200):
 * {
 *   "id": "resume_1",
 *   "enfantId": "enf_1",
 *   "date": "2025-11-09",
 *   "humeur": "Très bon",
 *   "observations": "Enfant très actif",
 *   "statut": "Brouillon"
 * }
 * 
 * ERRORS:
 * - 404: Résumé non trouvé
 * - 400: Données invalides
 * - 401: Non authentifié
 * - 403: Accès refusé
 */

/**
 * POST /api/daily-resumes/:id/publish
 * 
 * Publier un résumé quotidien
 * 
 * RÔLE REQUIS: ADMIN, ENSEIGNANT
 * 
 * SUCCESS (200):
 * {
 *   "id": "resume_1",
 *   "enfantId": "enf_1",
 *   "date": "2025-11-09",
 *   "statut": "Publie",
 *   "publieLe": "2025-11-09T17:00:00Z"
 * }
 * 
 * ERRORS:
 * - 404: Résumé non trouvé
 * - 400: Résumé déjà publié
 * - 401: Non authentifié
 * - 403: Accès refusé
 */

/**
 * DELETE /api/daily-resumes/:id
 * 
 * Supprimer un résumé quotidien
 * 
 * RÔLE REQUIS: ADMIN, ENSEIGNANT
 * 
 * SUCCESS (200):
 * {
 *   "message": "Résumé supprimé avec succès",
 *   "id": "resume_1"
 * }
 * 
 * ERRORS:
 * - 404: Résumé non trouvé
 * - 401: Non authentifié
 * - 403: Accès refusé
 */

/**
 * ============================================================================
 * 👨‍👩‍👧 PARENT ENDPOINTS
 * ============================================================================
 */

/**
 * GET /api/parent/me
 * 
 * Récupérer mon profil
 * 
 * RÔLE REQUIS: PARENT
 * 
 * SUCCESS (200):
 * {
 *   "id": "user_123",
 *   "email": "parent@example.com",
 *   "prenom": "Jean",
 *   "nom": "Dupont",
 *   "telephone": "06 12 34 56 78",
 *   "adresse": "Rue Atlas, Marrakech",
 *   "langue": "fr",
 *   "tuteurId": "tuteur_123",
 *   "familleId": "fam_123",
 *   "enfants": [
 *     {
 *       "id": "enf_1",
 *       "prenom": "Alice",
 *       "nom": "Dupont",
 *       "dateNaissance": "2020-05-15",
 *       "classeId": "cls_1"
 *     }
 *   ]
 * }
 * 
 * ERRORS:
 * - 401: Non authentifié
 * - 403: Accès refusé (PARENT requis)
 */

/**
 * PATCH /api/parent/me
 * 
 * Modifier mon profil
 * 
 * RÔLE REQUIS: PARENT
 * 
 * REQUEST BODY:
 * {
 *   "telephone": "06 98 76 54 32",
 *   "adresse": "Rue Nouvelle, Marrakech"
 * }
 * 
 * SUCCESS (200):
 * {
 *   "id": "tuteur_123",
 *   "prenom": "Jean",
 *   "nom": "Dupont",
 *   "telephone": "06 98 76 54 32",
 *   "adresse": "Rue Nouvelle, Marrakech"
 * }
 * 
 * ERRORS:
 * - 400: Données invalides
 * - 401: Non authentifié
 * - 403: Accès refusé (PARENT requis)
 */

/**
 * GET /api/parent/enfants/:enfantId/presences
 * 
 * Récupérer les présences de mon enfant
 * 
 * RÔLE REQUIS: PARENT
 * 
 * QUERY PARAMETERS:
 * - dateMin: Date minimum (optionnel, format: YYYY-MM-DD)
 * - dateMax: Date maximum (optionnel, format: YYYY-MM-DD)
 * - page: Numéro de page (optionnel, défaut: 1)
 * - pageSize: Nombre d'éléments par page (optionnel, défaut: 30)
 * 
 * SUCCESS (200):
 * {
 *   "data": [
 *     {
 *       "id": "pres_1",
 *       "date": "2025-11-09",
 *       "statut": "Present",
 *       "arriveeA": "08:30",
 *       "departA": "17:00"
 *     }
 *   ],
 *   "pagination": {
 *     "page": 1,
 *     "pageSize": 30,
 *     "total": 100,
 *     "hasNext": true
 *   }
 * }
 * 
 * ERRORS:
 * - 404: Enfant non trouvé
 * - 401: Non authentifié
 * - 403: Accès refusé (PARENT requis)
 */

/**
 * GET /api/parent/classes/:classeId/menu
 * 
 * Récupérer le menu du jour d'une classe
 * 
 * RÔLE REQUIS: PARENT
 * 
 * QUERY PARAMETERS:
 * - date: Date du menu (optionnel, format: YYYY-MM-DD, défaut: aujourd'hui)
 * 
 * SUCCESS (200):
 * {
 *   "id": "menu_1",
 *   "date": "2025-11-09",
 *   "petit_dejeuner": "Lait, pain, beurre",
 *   "collation_matin": "Fruit",
 *   "dejeuner": "Poulet, riz, légumes",
 *   "collation_apres_midi": "Yaourt",
 *   "gouter": "Gâteau, jus",
 *   "notes": "Aucune allergie",
 *   "publieLe": "2025-11-09T08:00:00Z"
 * }
 * 
 * ERRORS:
 * - 404: Menu non trouvé
 * - 401: Non authentifié
 * - 403: Accès refusé (PARENT requis)
 */

/**
 * GET /api/parent/enfants/:enfantId/resume
 * 
 * Récupérer le résumé quotidien de mon enfant
 * 
 * RÔLE REQUIS: PARENT
 * 
 * QUERY PARAMETERS:
 * - date: Date du résumé (optionnel, format: YYYY-MM-DD, défaut: aujourd'hui)
 * 
 * SUCCESS (200):
 * {
 *   "id": "resume_1",
 *   "date": "2025-11-09",
 *   "humeur": "Excellent",
 *   "appetit": "Bon",
 *   "sieste": "Excellent",
 *   "participation": "Excellent",
 *   "activites": "Jeux libres, peinture, chansons",
 *   "observations": "Très actif et joyeux",
 *   "publieLe": "2025-11-09T17:00:00Z"
 * }
 * 
 * ERRORS:
 * - 404: Résumé non trouvé
 * - 401: Non authentifié
 * - 403: Accès refusé (PARENT requis)
 */

/**
 * GET /api/parent/classes/:classeId/journal/latest
 * 
 * Récupérer le dernier résumé publié de la classe
 * 
 * RÔLE REQUIS: PARENT
 * 
 * SUCCESS (200):
 * {
 *   "id": "journal_1",
 *   "date": "2025-11-09",
 *   "activites": "Jeux libres, peinture",
 *   "apprentissages": "Couleurs, formes",
 *   "humeurGroupe": "Excellente",
 *   "observations": "Groupe très actif",
 *   "publieLe": "2025-11-09T17:00:00Z"
 * }
 * 
 * ERRORS:
 * - 404: Résumé non trouvé
 * - 401: Non authentifié
 * - 403: Accès refusé (PARENT requis)
 */

/**
 * GET /api/parent/events
 * 
 * Récupérer mes événements
 * 
 * RÔLE REQUIS: PARENT
 * 
 * QUERY PARAMETERS:
 * - page: Numéro de page (optionnel, défaut: 1)
 * - pageSize: Nombre d'éléments par page (optionnel, défaut: 20)
 * 
 * SUCCESS (200):
 * {
 *   "data": [
 *     {
 *       "id": "evt_1",
 *       "titre": "Réunion parents-enseignants",
 *       "description": "Salle bleue",
 *       "startAt": "2025-11-30T14:00:00Z",
 *       "endAt": "2025-11-30T16:00:00Z",
 *       "classeId": "cls_1"
 *     }
 *   ],
 *   "pagination": {
 *     "page": 1,
 *     "pageSize": 20,
 *     "total": 50,
 *     "hasNext": true
 *   }
 * }
 * 
 * ERRORS:
 * - 401: Non authentifié
 * - 403: Accès refusé (PARENT requis)
 */

export default setupSwagger;

