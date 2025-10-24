# 🚀 Postman Quick Start - Familles CRUD

## ⚡ 5 Minutes Setup

### Étape 1: Démarrer le Serveur

```bash
cd creche-api
pnpm start:dev
```

Attendez le message: **"Listening on port 3000"** ✅

---

## 📱 Postman Setup

### Étape 2: Créer un Environment

1. Ouvrez **Postman**
2. Cliquez sur **Environments** (en bas à gauche)
3. Cliquez sur **Create New**
4. Remplissez:
   - **Name:** `Creche-API-Dev`
   - **Variable:** `base_url` = `http://localhost:3000/api`
5. Cliquez **Save**

### Étape 3: Sélectionner l'Environment

- En haut à droite, sélectionnez **Creche-API-Dev**

---

## 🧪 Test Rapide (Copy-Paste)

### 1️⃣ CREATE - Créer une Famille

**Method:** `POST`  
**URL:** `{{base_url}}/familles`

**Headers:**
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

**Cliquez Send** → Vous devez voir **Status 201** ✅

**Réponse:**
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

**💡 Conseil:** Copiez l'`id` de la réponse pour les tests suivants

---

### 2️⃣ READ ALL - Lister Toutes les Familles

**Method:** `GET`  
**URL:** `{{base_url}}/familles`

**Cliquez Send** → **Status 200** ✅

**Réponse:**
```json
{
  "value": [
    {
      "id": "uuid",
      "emailPrincipal": "famille.test@example.com",
      "languePreferee": "fr",
      "adresseFacturation": "123 Rue de la Paix, Casablanca",
      "tuteurs": [...],
      "enfants": []
    }
  ],
  "count": 1
}
```

---

### 3️⃣ READ ONE - Obtenir une Famille

**Method:** `GET`  
**URL:** `{{base_url}}/familles/PASTE_ID_HERE`

Remplacez `PASTE_ID_HERE` par l'ID copié à l'étape 1

**Cliquez Send** → **Status 200** ✅

---

### 4️⃣ READ STATS - Obtenir les Statistiques

**Method:** `GET`  
**URL:** `{{base_url}}/familles/PASTE_ID_HERE/stats`

**Cliquez Send** → **Status 200** ✅

**Réponse:**
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

### 5️⃣ UPDATE - Mettre à Jour une Famille

**Method:** `PATCH`  
**URL:** `{{base_url}}/familles/PASTE_ID_HERE`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "emailPrincipal": "famille.updated@example.com",
  "languePreferee": "ar",
  "adresseFacturation": "456 Avenue Hassan II, Rabat"
}
```

**Cliquez Send** → **Status 200** ✅

---

### 6️⃣ DELETE - Supprimer une Famille

**Method:** `DELETE`  
**URL:** `{{base_url}}/familles/PASTE_ID_HERE`

**Cliquez Send** → **Status 204** ✅

---

### 7️⃣ VERIFY - Vérifier la Suppression

**Method:** `GET`  
**URL:** `{{base_url}}/familles/PASTE_ID_HERE`

**Cliquez Send** → **Status 404** ✅ (Famille supprimée)

---

## 🎯 Résumé des Endpoints

| # | Méthode | Endpoint | Description |
|---|---------|----------|-------------|
| 1 | POST | `/familles` | Créer |
| 2 | GET | `/familles` | Lister tout |
| 3 | GET | `/familles/:id/stats` | Statistiques |
| 4 | GET | `/familles/:id` | Obtenir un |
| 5 | PATCH | `/familles/:id` | Mettre à jour |
| 6 | DELETE | `/familles/:id` | Supprimer |

---

## 🔍 Codes d'Erreur

| Code | Signification |
|------|---------------|
| **201** | ✅ Créé |
| **200** | ✅ OK |
| **204** | ✅ Supprimé |
| **400** | ❌ Email déjà utilisé |
| **404** | ❌ Non trouvé |
| **500** | ❌ Erreur serveur |

---

## 💡 Astuces Postman

### Automatiser avec des Variables

**Dans le Body, utilisez:**
```json
{
  "emailPrincipal": "famille.{{$timestamp}}@example.com"
}
```

Cela génère un email unique à chaque fois!

### Sauvegarder l'ID Automatiquement

**Onglet Tests:**
```javascript
var jsonData = pm.response.json();
pm.environment.set("famille_id", jsonData.id);
```

Puis utilisez `{{famille_id}}` dans les URLs suivantes!

---

## 📚 Documentation Complète

Pour plus de détails, consultez:
- `POSTMAN_GUIDE_FAMILLES.md` - Référence complète
- `POSTMAN_TESTING_INSTRUCTIONS.md` - Guide détaillé

---

**Bon testing! 🎉**

