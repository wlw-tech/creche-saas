# 📋 Résumé Complet des Endpoints v2

## 🔐 Authentification

| Endpoint | Méthode | Description | Rôle |
|----------|---------|-------------|------|
| `/auth/login` | POST | Login Admin (hardcodé) | Public |
| `/auth/login-user` | POST | Login Utilisateur | Public |
| `/auth/verify` | POST | Vérifier Token | Authentifié |

---

## 👥 Admin - Utilisateurs

| Endpoint | Méthode | Description | Rôle |
|----------|---------|-------------|------|
| `/admin/users` | POST | Créer Utilisateur | ADMIN |
| `/admin/users` | GET | Lister Utilisateurs | ADMIN |
| `/admin/users/:id` | GET | Détails Utilisateur | ADMIN |
| `/admin/users/:id` | PATCH | Modifier Utilisateur | ADMIN |
| `/admin/users/:id` | DELETE | Supprimer Utilisateur | ADMIN |

---

## 📚 Admin - Classes

| Endpoint | Méthode | Description | Rôle |
|----------|---------|-------------|------|
| `/admin/classes` | POST | Créer Classe | ADMIN |
| `/admin/classes` | GET | Lister Classes | ADMIN |
| `/admin/classes/:id` | GET | Détails Classe + Enfants | ADMIN |
| `/admin/classes/:id` | PATCH | Modifier Classe | ADMIN |
| `/admin/classes/:id` | DELETE | Supprimer Classe | ADMIN |

---

## 📍 Presences

| Endpoint | Méthode | Description | Rôle |
|----------|---------|-------------|------|
| `/presences` | GET | Voir Toutes Présences | ADMIN/ENSEIGNANT/PARENT |
| `/presences` | POST | Enregistrer Présence Enfant | ADMIN/ENSEIGNANT |
| `/presences/class` | POST | Enregistrer Présences Classe | ADMIN/ENSEIGNANT |

**Paramètres GET**:
- `classeId` - Filtrer par classe
- `enfantId` - Filtrer par enfant
- `date` - Filtrer par date (YYYY-MM-DD)
- `statut` - Filtrer par statut (Present, Absent, Justifie)
- `page` - Numéro de page
- `pageSize` - Nombre d'éléments par page

---

## 📝 Résumés Quotidiens

| Endpoint | Méthode | Description | Rôle |
|----------|---------|-------------|------|
| `/daily-resumes` | POST | Créer Résumé Enfant | ADMIN/ENSEIGNANT |
| `/daily-resumes` | GET | Voir Résumés | ADMIN/ENSEIGNANT/PARENT |
| `/daily-resumes/:id` | GET | Détails Résumé | ADMIN/ENSEIGNANT/PARENT |
| `/daily-resumes/:id` | PATCH | Modifier Résumé | ADMIN/ENSEIGNANT |
| `/daily-resumes/:id` | DELETE | Supprimer Résumé | ADMIN/ENSEIGNANT |

**Paramètres GET**:
- `enfantId` - Filtrer par enfant
- `classeId` - Filtrer par classe
- `date` - Filtrer par date
- `dateMin` - Date de début
- `dateMax` - Date de fin
- `page` - Numéro de page
- `pageSize` - Nombre d'éléments par page

**Champs Résumé**:
- `humeur` - Excellent, Bon, Moyen, Mauvais
- `appetit` - Excellent, Bon, Moyen, Mauvais
- `sieste` - Excellent, Bon, Moyen, Mauvais
- `participation` - Excellent, Bon, Moyen, Mauvais
- `activites` - Description des activités
- `observations` - Observations générales

---

## 🍽️ Menus

| Endpoint | Méthode | Description | Rôle |
|----------|---------|-------------|------|
| `/menus` | POST | Créer Menu | ADMIN |
| `/menus` | GET | Lister Menus | Authentifié |
| `/menus/today` | GET | Menu du Jour | Public |
| `/menus/:id` | GET | Détails Menu | Authentifié |
| `/menus/:id` | PATCH | Modifier Menu | ADMIN |
| `/menus/:id/publish` | POST | Publier Menu | ADMIN |
| `/menus/:id` | DELETE | Supprimer Menu | ADMIN |

**Paramètres GET**:
- `date` - Filtrer par date (YYYY-MM-DD)
- `dateMin` - Date de début
- `dateMax` - Date de fin
- `statut` - Filtrer par statut (Brouillon, Publie)
- `page` - Numéro de page
- `pageSize` - Nombre d'éléments par page

**Champs Menu**:
- `date` - Date du menu (YYYY-MM-DD)
- `entree` - Entrée
- `plat` - Plat principal
- `dessert` - Dessert
- `allergenes` - Liste des allergènes

---

## 👨‍👩‍👧 Parent Dashboard

| Endpoint | Méthode | Description | Rôle |
|----------|---------|-------------|------|
| `/parent/me` | GET | Mon Profil | PARENT |
| `/parent/me` | PATCH | Modifier Mon Profil | PARENT |
| `/parent/me/change-password` | POST | Changer Mon Mot de Passe | PARENT |
| `/parent/enfants/:enfantId/presences` | GET | Présences Mon Enfant | PARENT |
| `/parent/enfants/:enfantId/resume` | GET | Résumé Quotidien Mon Enfant | PARENT |
| `/parent/classes/:classeId/journal/latest` | GET | Journal Rapide Classe | PARENT |
| `/parent/classes/:classeId/menu` | GET | Menu du Jour Classe | PARENT |
| `/parent/events` | GET | Mes Événements | PARENT |

---

## 📊 Statuts et Énumérations

### Statut Présence
- `Present` - Présent
- `Absent` - Absent
- `Justifie` - Absent justifié

### Statut Menu
- `Brouillon` - Brouillon (non publié)
- `Publie` - Publié

### Niveau Humeur/Appétit/Sieste/Participation
- `Excellent` - Excellent
- `Bon` - Bon
- `Moyen` - Moyen
- `Mauvais` - Mauvais

### Rôle Utilisateur
- `ADMIN` - Administrateur
- `ENSEIGNANT` - Enseignant
- `PARENT` - Parent

### Statut Utilisateur
- `INVITED` - Invité (en attente d'activation)
- `ACTIVE` - Actif
- `DISABLED` - Désactivé

---

## 🔑 Authentification

### Admin (Hardcodé)
```json
{
  "email": "admin@wlw.ma",
  "password": "change_me"
}
```

### Utilisateurs (Créés par Admin)
- Endpoint: `POST /api/auth/login-user`
- Email: Défini lors de la création
- Mot de passe: Temporaire, généré lors de la création

### Token JWT
- Format: `Bearer TOKEN`
- Durée: 24 heures
- Payload: `{ email, role, userId }`

---

## 📝 Exemples de Body Request

### Créer Classe
```json
{
  "nom": "Petite Section",
  "trancheAge": "PS",
  "capacite": 20,
  "active": true
}
```

### Créer Utilisateur
```json
{
  "email": "prof@example.com",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "telephone": "+212612345678",
  "role": "ENSEIGNANT"
}
```

### Enregistrer Présence
```json
{
  "enfantId": "enf_123",
  "date": "2025-11-10",
  "statut": "Present",
  "arriveeA": "08:30",
  "departA": "17:00"
}
```

### Créer Résumé
```json
{
  "enfantId": "enf_123",
  "date": "2025-11-10",
  "humeur": "Excellent",
  "appetit": "Bon",
  "sieste": "Excellent",
  "participation": "Excellent",
  "activites": "Jeux libres, peinture",
  "observations": "Très actif"
}
```

### Créer Menu
```json
{
  "date": "2025-11-10",
  "entree": "Salade",
  "plat": "Poulet riz",
  "dessert": "Fruit",
  "allergenes": ["Arachides"]
}
```

---

## 🎯 Total Endpoints

- **Authentification**: 3
- **Admin - Utilisateurs**: 5
- **Admin - Classes**: 5
- **Presences**: 3
- **Résumés**: 5
- **Menus**: 7
- **Parent**: 8

**Total: 36 endpoints**

---

## 📞 Support

- 📖 Swagger: http://localhost:3000/api/docs
- 📮 Collection: `Creche-API-Complete-v2.postman_collection.json`
- 📖 Guide: `POSTMAN_COLLECTION_V2_GUIDE.md`

**Bonne chance!** 🚀

