# 👨‍💼 Admin Classes Management - Guide Complet

## 🔐 Authentification Admin

### Identifiants Admin (DEV)
```
Email: admin@wlw.ma
Password: change_me
```

### Endpoint de Login
```
POST /api/auth/login
```

### Exemple de Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wlw.ma",
    "password": "change_me"
  }'
```

### Réponse
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}
```

### Utiliser le Token dans les Requêtes
```bash
curl -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  http://localhost:3000/api/admin/classes
```

---

## 📚 Endpoints Admin Classes

### 1. POST /api/admin/classes
**Description**: Créer une nouvelle classe

**Headers**:
```
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json
```

**Body**:
```json
{
  "nom": "Petite Section",
  "capacite": 15,
  "trancheAge": "2-3 ans",
  "active": true
}
```

**Réponse (201)**:
```json
{
  "id": "cls_1",
  "nom": "Petite Section",
  "capacite": 15,
  "trancheAge": "2-3 ans",
  "active": true,
  "journauxClasse": [],
  "evenements": []
}
```

---

### 2. GET /api/admin/classes
**Description**: Récupérer toutes les classes

**Headers**:
```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Réponse (200)**:
```json
[
  {
    "id": "cls_1",
    "nom": "Petite Section",
    "capacite": 15,
    "trancheAge": "2-3 ans",
    "active": true,
    "journauxClasse": [],
    "evenements": []
  }
]
```

---

### 3. GET /api/admin/classes/:id
**Description**: Récupérer une classe par ID

**URL**:
```
GET /api/admin/classes/cls_1
```

**Réponse (200)**:
```json
{
  "id": "cls_1",
  "nom": "Petite Section",
  "capacite": 15,
  "trancheAge": "2-3 ans",
  "active": true,
  "journauxClasse": [],
  "evenements": []
}
```

---

### 4. PATCH /api/admin/classes/:id
**Description**: Modifier une classe

**Body**:
```json
{
  "nom": "Petite Section A",
  "capacite": 20
}
```

**Réponse (200)**:
```json
{
  "id": "cls_1",
  "nom": "Petite Section A",
  "capacite": 20,
  "trancheAge": "2-3 ans",
  "active": true
}
```

---

### 5. DELETE /api/admin/classes/:id
**Description**: Supprimer une classe

**Réponse (204)**: No Content

---

### 6. GET /api/admin/classes/:classeId/enfants
**Description**: Récupérer tous les enfants d'une classe avec leur statut de présence

**URL**:
```
GET /api/admin/classes/cls_1/enfants
```

**Réponse (200)**:
```json
{
  "classeId": "cls_1",
  "classeNom": "Petite Section",
  "date": "2025-11-09",
  "totalEnfants": 3,
  "enfants": [
    {
      "id": "enf_1",
      "prenom": "Alice",
      "nom": "Dupont",
      "dateNaissance": "2022-05-15",
      "presence": {
        "id": "pres_1",
        "statut": "Present",
        "arriveeA": "08:30",
        "departA": "17:00"
      }
    },
    {
      "id": "enf_2",
      "prenom": "Bob",
      "nom": "Martin",
      "dateNaissance": "2022-06-20",
      "presence": null
    }
  ]
}
```

---

### 7. POST /api/admin/classes/:classeId/enseignants/:enseignantId
**Description**: Assigner un enseignant à une classe

**URL**:
```
POST /api/admin/classes/cls_1/enseignants/ens_1
```

**Réponse (201)**:
```json
{
  "id": "ec_1",
  "enseignantId": "ens_1",
  "classeId": "cls_1",
  "dateDebut": "2025-11-09T00:00:00Z",
  "enseignant": {
    "id": "ens_1",
    "utilisateur": {
      "id": "user_1",
      "prenom": "Ahmed",
      "nom": "Dupont",
      "email": "ahmed@mail.com"
    }
  },
  "classe": {
    "id": "cls_1",
    "nom": "Petite Section"
  }
}
```

**Erreurs**:
- `400 Bad Request` - Enseignant déjà assigné à cette classe
- `404 Not Found` - Classe ou enseignant non trouvé

---

### 8. DELETE /api/admin/classes/:classeId/enseignants/:enseignantId
**Description**: Retirer un enseignant d'une classe

**URL**:
```
DELETE /api/admin/classes/cls_1/enseignants/ens_1
```

**Réponse (204)**: No Content

---

## 🧪 Exemples cURL

### Créer une classe
```bash
curl -X POST http://localhost:3000/api/admin/classes \
  -H "Authorization: Bearer <ADMIN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Petite Section",
    "capacite": 15,
    "trancheAge": "2-3 ans"
  }'
```

### Lister toutes les classes
```bash
curl -H "Authorization: Bearer <ADMIN_JWT>" \
  http://localhost:3000/api/admin/classes
```

### Récupérer les enfants d'une classe
```bash
curl -H "Authorization: Bearer <ADMIN_JWT>" \
  http://localhost:3000/api/admin/classes/cls_1/enfants
```

### Assigner un enseignant
```bash
curl -X POST \
  -H "Authorization: Bearer <ADMIN_JWT>" \
  http://localhost:3000/api/admin/classes/cls_1/enseignants/ens_1
```

### Retirer un enseignant
```bash
curl -X DELETE \
  -H "Authorization: Bearer <ADMIN_JWT>" \
  http://localhost:3000/api/admin/classes/cls_1/enseignants/ens_1
```

---

## 📊 Statuts de Présence

Les enfants peuvent avoir les statuts suivants:
- `Present` - Enfant présent
- `Absent` - Enfant absent
- `Justifie` - Absence justifiée
- `null` - Pas de présence enregistrée

---

## 🔍 Dépannage

### 403 Forbidden
- Vérifier que le JWT contient `role: ADMIN`
- Vérifier que l'utilisateur existe en base de données
- Vérifier que le statut est `ACTIVE`

### 404 Not Found
- Vérifier que la classe existe
- Vérifier que l'enseignant existe
- Vérifier les IDs

### 409 Conflict
- Enseignant déjà assigné à cette classe
- Retirer d'abord l'enseignant avant de le réassigner

---

## 📋 Checklist - Avant de Tester

- [ ] JWT Token admin valide
- [ ] Admin créé en base de données
- [ ] Classes créées
- [ ] Enseignants créés
- [ ] Enfants assignés aux classes
- [ ] Présences enregistrées

---

## 🎯 Flux Complet

### 1. Créer une classe
```bash
POST /api/admin/classes
```

### 2. Créer un enseignant (via Users endpoint)
```bash
POST /api/admin/users/invite-teacher
```

### 3. Assigner l'enseignant à la classe
```bash
POST /api/admin/classes/:classeId/enseignants/:enseignantId
```

### 4. Voir les enfants de la classe
```bash
GET /api/admin/classes/:classeId/enfants
```

### 5. Voir les présences du jour
Les présences sont incluses dans la réponse de l'étape 4

---

## 📞 Support

- **API Docs**: http://localhost:3000/api/docs
- **Postman**: Importer `Creche-Complete-API.postman_collection.json`

