# 🧪 Comment Tester le CRUD Familles avec Postman

## 📋 Table des Matières
1. [Configuration Initiale](#configuration-initiale)
2. [Tester les Endpoints](#tester-les-endpoints)
3. [Scénarios de Test Complets](#scénarios-de-test-complets)
4. [Conseils et Astuces](#conseils-et-astuces)

---

## 🚀 Configuration Initiale

### Étape 1: Démarrer le Serveur

```bash
# Terminal 1: Démarrer le serveur NestJS
cd creche-api
pnpm start:dev

# Attendez le message: "Listening on port 3000"
```

### Étape 2: Ouvrir Postman

1. Téléchargez et installez [Postman](https://www.postman.com/downloads/)
2. Ouvrez Postman
3. Créez un nouvel **Environment**:
   - Cliquez sur **Environments** (en bas à gauche)
   - Cliquez sur **Create New**
   - Nommez-le: `Creche-API-Dev`
   - Ajoutez les variables:
     ```
     base_url: http://localhost:3000/api
     famille_id: (sera rempli automatiquement)
     ```
   - Cliquez sur **Save**

### Étape 3: Créer une Collection

1. Cliquez sur **Collections** → **Create New**
2. Nommez-la: `Creche Familles CRUD`
3. Cliquez sur **Create**

---

## 🧪 Tester les Endpoints

### 1️⃣ **CREATE - POST /api/familles**

**Configuration:**
- **Method:** POST
- **URL:** `{{base_url}}/familles`
- **Headers:** 
  ```
  Content-Type: application/json
  ```

**Body (raw JSON):**
```json
{
  "emailPrincipal": "famille.test@example.com",
  "languePreferee": "fr",
  "adresseFacturation": "123 Rue de la Paix, Casablanca",
  "tuteurs": [
    {
      "lien": "Mere",
      "telephone": "+212612345678",
      "email": "fatima@example.com"
    },
    {
      "lien": "Pere",
      "telephone": "+212687654321",
      "email": "ahmed@example.com"
    }
  ]
}
```

**Tests (onglet Tests):**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has id", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
});

// Sauvegarder l'ID pour les tests suivants
var jsonData = pm.response.json();
pm.environment.set("famille_id", jsonData.id);
```

**Réponse attendue:**
```json
{
  "id": "uuid-generated",
  "emailPrincipal": "famille.test@example.com",
  "languePreferee": "fr",
  "adresseFacturation": "123 Rue de la Paix, Casablanca",
  "tuteurs": [
    {
      "id": "uuid",
      "familleId": "uuid-generated",
      "lien": "Mere",
      "telephone": "+212612345678",
      "email": "fatima@example.com",
      "principal": false
    }
  ],
  "enfants": []
}
```

---

### 2️⃣ **READ ALL - GET /api/familles**

**Configuration:**
- **Method:** GET
- **URL:** `{{base_url}}/familles`

**Réponse attendue:**
```json
{
  "value": [
    {
      "id": "uuid",
      "emailPrincipal": "famille.a@example.com",
      "languePreferee": "fr",
      "adresseFacturation": null,
      "tuteurs": [...],
      "enfants": [...]
    }
  ],
  "count": 3
}
```

---

### 3️⃣ **READ ONE - GET /api/familles/:id**

**Configuration:**
- **Method:** GET
- **URL:** `{{base_url}}/familles/{{famille_id}}`

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has correct email", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.emailPrincipal).to.equal("famille.test@example.com");
});
```

---

### 4️⃣ **READ STATS - GET /api/familles/:id/stats**

**Configuration:**
- **Method:** GET
- **URL:** `{{base_url}}/familles/{{famille_id}}/stats`

**Réponse attendue:**
```json
{
  "id": "uuid",
  "emailPrincipal": "famille.test@example.com",
  "languePreferee": "fr",
  "totalEnfants": 0,
  "enfantsActifs": 0,
  "totalTuteurs": 2
}
```

---

### 5️⃣ **UPDATE - PATCH /api/familles/:id**

**Configuration:**
- **Method:** PATCH
- **URL:** `{{base_url}}/familles/{{famille_id}}`
- **Headers:** 
  ```
  Content-Type: application/json
  ```

**Body (raw JSON):**
```json
{
  "emailPrincipal": "famille.test.updated@example.com",
  "languePreferee": "ar",
  "adresseFacturation": "456 Avenue Hassan II, Rabat"
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Email was updated", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.emailPrincipal).to.equal("famille.test.updated@example.com");
});
```

---

### 6️⃣ **DELETE - DELETE /api/familles/:id**

**Configuration:**
- **Method:** DELETE
- **URL:** `{{base_url}}/familles/{{famille_id}}`

**Tests:**
```javascript
pm.test("Status code is 204", function () {
    pm.response.to.have.status(204);
});
```

---

## 🎯 Scénarios de Test Complets

### Scénario 1: Test Complet CRUD

1. **Créer une famille** (POST)
   - Copier l'ID de la réponse
   - Vérifier que les tuteurs sont créés

2. **Lister toutes les familles** (GET)
   - Vérifier que la nouvelle famille est dans la liste

3. **Obtenir une famille spécifique** (GET :id)
   - Utiliser l'ID copié
   - Vérifier les détails

4. **Obtenir les statistiques** (GET :id/stats)
   - Vérifier le nombre de tuteurs

5. **Mettre à jour la famille** (PATCH)
   - Changer l'email et la langue
   - Vérifier les modifications

6. **Supprimer la famille** (DELETE)
   - Vérifier le status 204

7. **Vérifier la suppression** (GET :id)
   - Devrait retourner 404

### Scénario 2: Test d'Erreurs

1. **Email déjà utilisé** (POST)
   - Créer deux familles avec le même email
   - Devrait retourner 400

2. **Famille non trouvée** (GET :id)
   - Utiliser un ID invalide
   - Devrait retourner 404

3. **Données invalides** (POST)
   - Envoyer un email invalide
   - Devrait retourner 400

---

## 💡 Conseils et Astuces

### Utiliser des Variables d'Environment

```javascript
// Dans Pre-request Script:
pm.environment.set("email_test", 
  "famille." + Date.now() + "@example.com"
);

// Dans le Body:
"emailPrincipal": "{{email_test}}"
```

### Automatiser avec des Scripts

**Pre-request Script (avant chaque requête):**
```javascript
// Générer un email unique
if (!pm.environment.get("email_test")) {
    pm.environment.set("email_test", 
      "famille." + Date.now() + "@example.com"
    );
}
```

**Tests (après chaque requête):**
```javascript
// Sauvegarder l'ID automatiquement
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("famille_id", jsonData.id);
}
```

### Importer depuis Swagger

1. Allez sur `http://localhost:3000/docs`
2. Cliquez sur le bouton **Swagger UI**
3. Cliquez sur **Download** (en haut à droite)
4. Importez le fichier dans Postman

---

## 🔍 Codes d'Erreur

| Code | Signification |
|------|---------------|
| **201** | Famille créée ✅ |
| **200** | Requête réussie ✅ |
| **204** | Suppression réussie ✅ |
| **400** | Email déjà utilisé ou données invalides ❌ |
| **404** | Famille non trouvée ❌ |
| **500** | Erreur serveur ❌ |

---

## 📚 Ressources Supplémentaires

- **Swagger Documentation:** http://localhost:3000/docs
- **Prisma Studio:** `pnpm prisma:studio` → http://localhost:5555
- **Guide Complet:** Voir `POSTMAN_GUIDE_FAMILLES.md`

---

**Bon testing! 🎉**

