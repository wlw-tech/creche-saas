# 📋 Menu du Jour - Documentation Complète

## 🎯 Vue d'ensemble

La fonctionnalité **Menu du Jour** permet à l'administrateur de créer, modifier et publier les menus quotidiens de la crèche. Les enseignants et parents peuvent consulter les menus publiés.

### ✅ Fonctionnalités Implémentées

- ✅ **ADMIN**: Créer, modifier, publier et supprimer les menus
- ✅ **ENSEIGNANT**: Consulter les menus publiés
- ✅ **PARENT**: Consulter les menus publiés de leurs enfants
- ✅ **Allergènes**: Gestion complète des allergènes par menu
- ✅ **Statuts**: Brouillon (draft) et Publié
- ✅ **Pagination**: Support complet avec filtres
- ✅ **Historique**: Consultation des menus récents

---

## 🗄️ Modèle de Données

### Enum: StatutMenu
```prisma
enum StatutMenu {
  Brouillon  // Menu en cours de rédaction
  Publie     // Menu publié et visible
}
```

### Model: Menu
```prisma
model Menu {
  id           String       @id @default(uuid())
  date         DateTime     @unique              // Une date = un menu unique
  entree       String?                           // Plat d'entrée
  plat         String?                           // Plat principal
  dessert      String?                           // Dessert
  statut       StatutMenu   @default(Brouillon) // Brouillon ou Publié
  allergenes   MenuAllergen[]                    // Liste des allergènes
  creePar      String?                           // Utilisateur.id (admin)
  creeLe       DateTime     @default(now())
  modifieLe    DateTime     @updatedAt
  publieLe     DateTime?                         // Date de publication

  @@index([date])
  @@index([statut])
}

model MenuAllergen {
  id       String @id @default(uuid())
  menuId   String
  allergen String // Nom de l'allergène (ex: "Arachides", "Gluten", "Lait")
  menu     Menu   @relation(fields: [menuId], references: [id], onDelete: Cascade)

  @@unique([menuId, allergen])
  @@index([menuId])
}
```

---

## 🔌 Endpoints API

### 1️⃣ Créer un Menu (ADMIN uniquement)
```http
POST /api/menus
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "date": "2025-11-07",
  "entree": "Soupe de légumes",
  "plat": "Poulet rôti avec riz",
  "dessert": "Yaourt nature",
  "allergenes": ["Arachides", "Gluten", "Lait"]
}
```

**Réponse (201 Created):**
```json
{
  "id": "mnu_123abc",
  "date": "2025-11-07",
  "entree": "Soupe de légumes",
  "plat": "Poulet rôti avec riz",
  "dessert": "Yaourt nature",
  "statut": "Brouillon",
  "allergenes": ["Arachides", "Gluten", "Lait"],
  "creePar": "admin@wlw.ma",
  "creeLe": "2025-11-06T10:00:00Z",
  "modifieLe": "2025-11-06T10:00:00Z",
  "publieLe": null
}
```

### 2️⃣ Récupérer les Menus (Tous les rôles)
```http
GET /api/menus?page=1&pageSize=25&statut=Publie&date=2025-11-07
Authorization: Bearer <token>
```

**Filtres disponibles:**
- `date`: Filtrer par date exacte (YYYY-MM-DD)
- `dateMin`: Date de début (YYYY-MM-DD)
- `dateMax`: Date de fin (YYYY-MM-DD)
- `statut`: Brouillon ou Publie
- `page`: Numéro de page (défaut: 1)
- `pageSize`: Éléments par page (défaut: 25, max: 100)

**Réponse (200 OK):**
```json
{
  "data": [
    {
      "id": "mnu_123abc",
      "date": "2025-11-07",
      "entree": "Soupe de légumes",
      "plat": "Poulet rôti avec riz",
      "dessert": "Yaourt nature",
      "statut": "Publie",
      "allergenes": ["Arachides", "Gluten", "Lait"],
      "creePar": "admin@wlw.ma",
      "creeLe": "2025-11-06T10:00:00Z",
      "modifieLe": "2025-11-06T10:00:00Z",
      "publieLe": "2025-11-06T11:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 25,
  "hasNext": false
}
```

### 3️⃣ Récupérer le Menu du Jour
```http
GET /api/menus/today
Authorization: Bearer <token>
```

**Réponse (200 OK):** Menu du jour ou `null` si aucun

### 4️⃣ Récupérer un Menu par ID
```http
GET /api/menus/:id
Authorization: Bearer <token>
```

### 5️⃣ Mettre à Jour un Menu (ADMIN uniquement)
```http
PATCH /api/menus/:id
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "entree": "Soupe de tomates",
  "plat": "Poisson avec légumes",
  "dessert": "Fruit frais",
  "allergenes": ["Poisson", "Gluten"]
}
```

### 6️⃣ Publier un Menu (ADMIN uniquement)
```http
POST /api/menus/:id/publish
Authorization: Bearer <token_admin>
```

**Réponse:** Menu avec `statut: "Publie"` et `publieLe` défini

### 7️⃣ Supprimer un Menu (ADMIN uniquement, Brouillon seulement)
```http
DELETE /api/menus/:id
Authorization: Bearer <token_admin>
```

---

## 🔐 Contrôle d'Accès (RBAC)

| Rôle | GET | POST | PATCH | DELETE | Publish |
|------|-----|------|-------|--------|---------|
| **ADMIN** | ✅ Tous | ✅ Tous | ✅ Tous | ✅ Brouillon | ✅ |
| **ENSEIGNANT** | ✅ Publiés | ❌ | ❌ | ❌ | ❌ |
| **PARENT** | ✅ Publiés | ❌ | ❌ | ❌ | ❌ |

---

## 📝 Exemples d'Utilisation

### Flux Complet: Créer → Modifier → Publier

**1. Login Admin**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wlw.ma","password":"change_me"}'
```

**2. Créer un menu en brouillon**
```bash
curl -X POST http://localhost:3000/api/menus \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-11-07",
    "entree": "Soupe",
    "plat": "Poulet",
    "dessert": "Yaourt",
    "allergenes": ["Gluten"]
  }'
```

**3. Modifier le menu**
```bash
curl -X PATCH http://localhost:3000/api/menus/mnu_123 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"plat": "Poisson"}'
```

**4. Publier le menu**
```bash
curl -X POST http://localhost:3000/api/menus/mnu_123/publish \
  -H "Authorization: Bearer <token>"
```

---

## 🧪 Tests Recommandés

1. **Créer un menu** → Vérifier statut = "Brouillon"
2. **Modifier le menu** → Vérifier `modifieLe` mis à jour
3. **Publier le menu** → Vérifier statut = "Publie" et `publieLe` défini
4. **Consulter comme PARENT** → Vérifier que seuls les menus "Publie" sont visibles
5. **Supprimer un menu publié** → Vérifier erreur 400
6. **Supprimer un brouillon** → Vérifier succès

---

## 📚 Fichiers Modifiés

- ✅ `src/prisma/schema.prisma` - Ajout des modèles Menu et MenuAllergen
- ✅ `src/modules/menus/menus.controller.ts` - Endpoints API
- ✅ `src/modules/menus/menus.service.ts` - Logique métier
- ✅ `src/modules/menus/dto/create-menu.dto.ts` - DTOs
- ✅ `src/modules/menus/menus.module.ts` - Module
- ✅ `src/app.module.ts` - Intégration du module

---

## 🚀 Prochaines Étapes

1. Tester tous les endpoints via Swagger: http://localhost:3000/docs
2. Vérifier les filtres et la pagination
3. Tester le RBAC avec différents rôles
4. Ajouter des tests unitaires si nécessaire

