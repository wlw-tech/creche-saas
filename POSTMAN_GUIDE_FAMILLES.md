# 📚 Guide Postman - CRUD Familles

## 🚀 Configuration Initiale

### 1. Importer la Collection
- Ouvrez Postman
- Cliquez sur **Import** → **Link**
- Collez l'URL Swagger: `http://localhost:3000/docs-json`
- Ou créez manuellement les requêtes ci-dessous

### 2. Créer un Environment
- Cliquez sur **Environments** → **Create New**
- Nommez-le: `Creche-API-Dev`
- Ajoutez la variable:
  ```
  base_url: http://localhost:3000/api
  ```

---

## 📝 Endpoints CRUD Familles

### 1️⃣ **CREATE - Créer une nouvelle famille**

**Méthode:** `POST`  
**URL:** `{{base_url}}/familles`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "emailPrincipal": "famille.test@example.com",
  "languePreferee": "fr",
  "adresseFacturation": "123 Rue de la Paix, Casablanca",
  "tuteurs": [
    {
      "lien": "Mere",
      "prenom": "Fatima",
      "nom": "Alaoui",
      "telephone": "+212612345678",
      "email": "fatima@example.com"
    },
    {
      "lien": "Pere",
      "prenom": "Ahmed",
      "nom": "Alaoui",
      "telephone": "+212687654321",
      "email": "ahmed@example.com"
    }
  ]
}
```

**Réponse attendue (201 Created):**
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
      "prenom": "Fatima",
      "nom": "Alaoui",
      "telephone": "+212612345678",
      "email": "fatima@example.com"
    }
  ],
  "enfants": []
}
```

---

### 2️⃣ **READ ALL - Lister toutes les familles**

**Méthode:** `GET`  
**URL:** `{{base_url}}/familles`

**Réponse attendue (200 OK):**
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
  "count": 2
}
```

---

### 3️⃣ **READ ONE - Obtenir une famille par ID**

**Méthode:** `GET`  
**URL:** `{{base_url}}/familles/{id}`

**Exemple:**
```
{{base_url}}/familles/eb3756c4-3f1d-4217-bc45-f852e58a9afc
```

**Réponse attendue (200 OK):**
```json
{
  "id": "eb3756c4-3f1d-4217-bc45-f852e58a9afc",
  "emailPrincipal": "famille.a@example.com",
  "languePreferee": "fr",
  "adresseFacturation": null,
  "tuteurs": [...],
  "enfants": [
    {
      "id": "uuid",
      "prenom": "Sara",
      "nom": "Alaoui",
      "inscriptions": [...]
    }
  ]
}
```

---

### 4️⃣ **READ STATS - Obtenir les statistiques d'une famille**

**Méthode:** `GET`  
**URL:** `{{base_url}}/familles/{id}/stats`

**Exemple:**
```
{{base_url}}/familles/eb3756c4-3f1d-4217-bc45-f852e58a9afc/stats
```

**Réponse attendue (200 OK):**
```json
{
  "id": "eb3756c4-3f1d-4217-bc45-f852e58a9afc",
  "emailPrincipal": "famille.a@example.com",
  "languePreferee": "fr",
  "totalEnfants": 2,
  "enfantsActifs": 2,
  "totalTuteurs": 2
}
```

---

### 5️⃣ **UPDATE - Mettre à jour une famille**

**Méthode:** `PATCH`  
**URL:** `{{base_url}}/familles/{id}`

**Body (JSON):**
```json
{
  "emailPrincipal": "famille.test.updated@example.com",
  "languePreferee": "ar",
  "adresseFacturation": "456 Avenue Hassan II, Rabat"
}
```

**Réponse attendue (200 OK):**
```json
{
  "id": "uuid",
  "emailPrincipal": "famille.test.updated@example.com",
  "languePreferee": "ar",
  "adresseFacturation": "456 Avenue Hassan II, Rabat",
  "tuteurs": [...],
  "enfants": [...]
}
```

---

### 6️⃣ **DELETE - Supprimer une famille**

**Méthode:** `DELETE`  
**URL:** `{{base_url}}/familles/{id}`

**Réponse attendue (204 No Content):**
```
(Pas de body)
```

---

## 🧪 Scénario de Test Complet

### Étape 1: Créer une famille
1. POST `/familles` avec les données ci-dessus
2. **Copier l'ID** de la réponse

### Étape 2: Lister toutes les familles
1. GET `/familles`
2. Vérifier que la nouvelle famille est dans la liste

### Étape 3: Obtenir une famille spécifique
1. GET `/familles/{id}` (utiliser l'ID copié)
2. Vérifier les détails

### Étape 4: Obtenir les statistiques
1. GET `/familles/{id}/stats`
2. Vérifier le nombre d'enfants et tuteurs

### Étape 5: Mettre à jour la famille
1. PATCH `/familles/{id}` avec nouvelles données
2. Vérifier les modifications

### Étape 6: Supprimer la famille
1. DELETE `/familles/{id}`
2. Vérifier le status 204

### Étape 7: Vérifier la suppression
1. GET `/familles/{id}`
2. Devrait retourner 404 Not Found

---

## 🔍 Codes d'Erreur Possibles

| Code | Signification |
|------|---------------|
| **201** | Famille créée avec succès |
| **200** | Requête réussie |
| **204** | Suppression réussie (pas de contenu) |
| **400** | Email déjà utilisé ou données invalides |
| **404** | Famille non trouvée |
| **500** | Erreur serveur |

---

## 💡 Conseils Postman

### Utiliser des Variables
```
// Dans le Body, utilisez:
"emailPrincipal": "{{email_test}}"

// Définissez dans l'Environment:
email_test: famille.test@example.com
```

### Automatiser avec Pre-request Script
```javascript
// Avant la requête POST, générez un email unique:
pm.environment.set("email_test", 
  "famille." + Date.now() + "@example.com"
);
```

### Sauvegarder l'ID pour les requêtes suivantes
```javascript
// Dans l'onglet "Tests" après POST:
var jsonData = pm.response.json();
pm.environment.set("famille_id", jsonData.id);

// Utilisez ensuite: {{famille_id}}
```

---

## 🚀 Lancer le Serveur

```bash
# Terminal 1: Démarrer le serveur
pnpm start:dev

# Terminal 2: Ouvrir Swagger (optionnel)
# http://localhost:3000/docs

# Terminal 3: Ouvrir Prisma Studio (optionnel)
# pnpm prisma:studio
# http://localhost:5555
```

---

## ✅ Checklist de Test

- [ ] Créer une famille avec tuteurs
- [ ] Lister toutes les familles
- [ ] Obtenir une famille par ID
- [ ] Obtenir les statistiques
- [ ] Mettre à jour la famille
- [ ] Supprimer la famille
- [ ] Vérifier la suppression (404)
- [ ] Tester avec email déjà utilisé (400)
- [ ] Tester avec données invalides (400)

---

**Bon testing! 🎉**

