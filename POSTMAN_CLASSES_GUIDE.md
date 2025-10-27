# 🚀 Postman Guide - Classes CRUD

## ⚡ Quick Setup (5 minutes)

### Étape 1: Démarrer le Serveur

```bash
cd creche-api
pnpm start:dev
```

Attendez: **"Listening on port 3000"** ✅

### Étape 2: Configurer Postman Environment

1. Ouvrez **Postman**
2. **Environments** → **Create New**
3. Remplissez:
   - **Name:** `Creche-API-Dev`
   - **Variable:** `base_url` = `http://localhost:3000/api`
4. **Save** et sélectionnez l'environment

---

## 🧪 Les 6 Endpoints Classes

### 1️⃣ CREATE - POST /api/classes

**URL:** `{{base_url}}/classes`

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Body (Copy-Paste):**
```json
{
  "nom": "Petite Section",
  "capacite": 20,
  "niveauScolaire": "PS",
  "description": "Classe pour enfants de 2-3 ans"
}
```

**Expected Response (Status 201):**
```json
{
  "id": "uuid-generated",
  "nom": "Petite Section",
  "capacite": 20,
  "niveauScolaire": "PS",
  "description": "Classe pour enfants de 2-3 ans",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

💡 **Copiez l'ID** pour les tests suivants

---

### 2️⃣ READ ALL - GET /api/classes

**URL:** `{{base_url}}/classes`

**Method:** GET

**Expected Response (Status 200):**
```json
{
  "value": [
    {
      "id": "uuid",
      "nom": "Petite Section",
      "capacite": 20,
      "niveauScolaire": "PS",
      "description": "Classe pour enfants de 2-3 ans",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "uuid",
      "nom": "Moyenne Section",
      "capacite": 25,
      "niveauScolaire": "MS",
      "description": "Classe pour enfants de 3-4 ans",
      "createdAt": "2024-01-15T10:31:00Z",
      "updatedAt": "2024-01-15T10:31:00Z"
    }
  ],
  "count": 2
}
```

---

### 3️⃣ READ STATS - GET /api/classes/:id/stats

**URL:** `{{base_url}}/classes/PASTE_ID_HERE/stats`

**Method:** GET

**Expected Response (Status 200):**
```json
{
  "id": "uuid",
  "nom": "Petite Section",
  "capacite": 20,
  "niveauScolaire": "PS",
  "totalEnfants": 5,
  "placesDisponibles": 15,
  "tauxOccupation": 25
}
```

---

### 4️⃣ READ ONE - GET /api/classes/:id

**URL:** `{{base_url}}/classes/PASTE_ID_HERE`

**Method:** GET

**Expected Response (Status 200):**
```json
{
  "id": "uuid",
  "nom": "Petite Section",
  "capacite": 20,
  "niveauScolaire": "PS",
  "description": "Classe pour enfants de 2-3 ans",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

### 5️⃣ UPDATE - PATCH /api/classes/:id

**URL:** `{{base_url}}/classes/PASTE_ID_HERE`

**Method:** PATCH

**Headers:**
```
Content-Type: application/json
```

**Body (Copy-Paste):**
```json
{
  "nom": "Petite Section - Groupe A",
  "capacite": 22,
  "description": "Classe mise à jour"
}
```

**Expected Response (Status 200):**
```json
{
  "id": "uuid",
  "nom": "Petite Section - Groupe A",
  "capacite": 22,
  "niveauScolaire": "PS",
  "description": "Classe mise à jour",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

---

### 6️⃣ DELETE - DELETE /api/classes/:id

**URL:** `{{base_url}}/classes/PASTE_ID_HERE`

**Method:** DELETE

**Expected Response (Status 204):**
```
(No content)
```

---

### 7️⃣ VERIFY DELETION - GET /api/classes/:id

**URL:** `{{base_url}}/classes/PASTE_ID_HERE`

**Method:** GET

**Expected Response (Status 404):**
```json
{
  "statusCode": 404,
  "message": "Classe avec l'ID PASTE_ID_HERE non trouvée",
  "error": "Not Found"
}
```

---

## 📊 Tableau Récapitulatif

| # | Endpoint | Méthode | Status | Description |
|---|----------|---------|--------|-------------|
| 1 | `/api/classes` | POST | 201 | Créer |
| 2 | `/api/classes` | GET | 200 | Lister tout |
| 3 | `/api/classes/:id/stats` | GET | 200 | Statistiques |
| 4 | `/api/classes/:id` | GET | 200 | Obtenir un |
| 5 | `/api/classes/:id` | PATCH | 200 | Mettre à jour |
| 6 | `/api/classes/:id` | DELETE | 204 | Supprimer |

---

## 🎯 Alternative Examples

### Create Classe Minimale

```json
{
  "nom": "Classe Test",
  "capacite": 15,
  "niveauScolaire": "PS"
}
```

### Create Classe Complète

```json
{
  "nom": "Grande Section",
  "capacite": 30,
  "niveauScolaire": "GS",
  "description": "Classe pour enfants de 4-5 ans - Préparation à l'école"
}
```

### Update Partiel

```json
{
  "capacite": 25
}
```

---

## 🔍 Error Examples

### Classe Non Trouvée (Status 404)

```json
{
  "statusCode": 404,
  "message": "Classe avec l'ID invalid-id non trouvée",
  "error": "Not Found"
}
```

### Données Invalides (Status 400)

```json
{
  "statusCode": 400,
  "message": [
    "nom must be a string",
    "capacite must be a number"
  ],
  "error": "Bad Request"
}
```

---

## 💡 Postman Tips

### Sauvegarder l'ID Automatiquement

**Onglet Tests:**
```javascript
if (pm.response.code === 201) {
  var jsonData = pm.response.json();
  pm.environment.set("classe_id", jsonData.id);
}
```

### Utiliser l'ID Sauvegardé

**URL:**
```
{{base_url}}/classes/{{classe_id}}/stats
```

### Valider la Réponse

**Onglet Tests:**
```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Response has id", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('id');
});

pm.test("Nom is correct", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.nom).to.equal("Petite Section");
});
```

---

## 🔗 Ressources

- **Swagger:** http://localhost:3000/docs
- **Prisma Studio:** `pnpm prisma:studio`
- **Documentation Familles:** POSTMAN_COPY_PASTE.md

---

**Bon testing! 🎉**

