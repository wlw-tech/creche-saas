# 📱 Guide Postman - API Inscriptions

## ⚡ Démarrage Rapide (5 minutes)

### Étape 1: Démarrer le Serveur

```bash
cd creche-api
pnpm start:dev
```

Attendez: **"Listening on port 3000"** ✅

### Étape 2: Configurer Postman

1. Ouvrez **Postman**
2. **Environments** → **Create New**
3. Remplissez:
   - **Name:** `Creche-API-Dev`
   - **Variable:** `base_url` = `http://localhost:3000/api`
4. **Save** et sélectionnez l'environment

---

## 🧪 Tester l'Endpoint

### 1️⃣ CREATE - POST /api/public/inscriptions

**Méthode:** `POST`  
**URL:** `{{base_url}}/public/inscriptions`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "famille": {
    "emailPrincipal": "parent@example.com",
    "languePreferee": "fr"
  },
  "tuteurs": [
    {
      "lien": "Mere",
      "prenom": "Amina",
      "nom": "Test",
      "email": "amina@example.com",
      "telephone": "+33612345678",
      "principal": true
    }
  ],
  "enfant": {
    "prenom": "Nour",
    "nom": "Test",
    "dateNaissance": "2021-05-10",
    "genre": "M"
  },
  "classeIdSouhaitee": "00000000-0000-0000-0000-000000000001",
  "consentements": {
    "photo": true,
    "sortie": true
  },
  "commentaire": "Inscription pour septembre 2025"
}
```

**Réponse (201 Created):**
```json
{
  "applicationId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "statut": "Candidature"
}
```

---

## 📊 Exemples de Test

### ✅ Cas 1: Inscription Réussie (Happy Path)

```json
{
  "famille": {
    "emailPrincipal": "test1@example.com",
    "languePreferee": "fr"
  },
  "tuteurs": [
    {
      "lien": "Pere",
      "prenom": "Ahmed",
      "nom": "Dupont",
      "principal": true
    }
  ],
  "enfant": {
    "prenom": "Lina",
    "nom": "Dupont",
    "dateNaissance": "2022-03-15"
  },
  "classeIdSouhaitee": "00000000-0000-0000-0000-000000000001"
}
```

**Résultat:** ✅ 201 Created

---

### ❌ Cas 2: Classe Inexistante

```json
{
  "famille": {
    "emailPrincipal": "test2@example.com",
    "languePreferee": "fr"
  },
  "tuteurs": [],
  "enfant": {
    "prenom": "Ali",
    "nom": "Test",
    "dateNaissance": "2021-01-01"
  },
  "classeIdSouhaitee": "ffffffff-ffff-ffff-ffff-ffffffffffff"
}
```

**Résultat:** ❌ 404 Not Found

---

### ❌ Cas 3: Email Invalide

```json
{
  "famille": {
    "emailPrincipal": "invalid-email",
    "languePreferee": "fr"
  },
  "tuteurs": [],
  "enfant": {
    "prenom": "Test",
    "nom": "Test",
    "dateNaissance": "2021-01-01"
  },
  "classeIdSouhaitee": "00000000-0000-0000-0000-000000000001"
}
```

**Résultat:** ❌ 400 Bad Request

---

### ❌ Cas 4: Données Manquantes

```json
{
  "famille": {
    "emailPrincipal": "test@example.com"
  },
  "tuteurs": [],
  "enfant": {
    "prenom": "Test"
  }
}
```

**Résultat:** ❌ 400 Bad Request (champs manquants)

---

## 🔄 Upsert Famille (Même Email)

Envoyez 2 fois avec le **même email**:

```json
{
  "famille": {
    "emailPrincipal": "same@example.com",
    "languePreferee": "fr"
  },
  "tuteurs": [
    {
      "lien": "Mere",
      "prenom": "Fatima",
      "nom": "Test",
      "principal": true
    }
  ],
  "enfant": {
    "prenom": "Enfant1",
    "nom": "Test",
    "dateNaissance": "2021-01-01"
  },
  "classeIdSouhaitee": "00000000-0000-0000-0000-000000000001"
}
```

**Puis changez l'enfant:**

```json
{
  "famille": {
    "emailPrincipal": "same@example.com",
    "languePreferee": "ar"
  },
  "tuteurs": [
    {
      "lien": "Pere",
      "prenom": "Mohamed",
      "nom": "Test",
      "principal": true
    }
  ],
  "enfant": {
    "prenom": "Enfant2",
    "nom": "Test",
    "dateNaissance": "2022-06-15"
  },
  "classeIdSouhaitee": "00000000-0000-0000-0000-000000000001"
}
```

**Résultat:** ✅ Famille mise à jour, nouvel enfant créé

---

## 📋 Tableau des Valeurs Valides

### Lien Tuteur (lien)
```
"Pere"
"Mere"
"Tuteur"
"Autre"
```

### Langue Préférée (languePreferee)
```
"fr"
"ar"
```

### Genre Enfant (genre)
```
"M"
"F"
```

---

## 🔐 Rate-Limiting

**Limite:** 20 requêtes par 60 secondes par IP

**Test:**
1. Envoyez 20 requêtes rapidement → ✅ Toutes réussissent
2. Envoyez la 21ème → ❌ 429 Too Many Requests

---

## 📊 Réponses Possibles

| Status | Signification |
|--------|---------------|
| **201** | ✅ Inscription créée |
| **400** | ❌ Données invalides |
| **404** | ❌ Classe non trouvée |
| **429** | ❌ Rate-limit dépassé |

---

## 🧪 Tests Automatisés Postman

### Ajouter un Test

Dans l'onglet **Tests**, collez:

```javascript
pm.test("Status is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has applicationId", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('applicationId');
});

pm.test("Response has statut Candidature", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.statut).to.equal('Candidature');
});
```

---

## 💾 Sauvegarder les Réponses

### Ajouter une Variable

Dans l'onglet **Tests**:

```javascript
var jsonData = pm.response.json();
pm.environment.set("applicationId", jsonData.applicationId);
```

Puis utilisez `{{applicationId}}` dans d'autres requêtes.

---

## 🔗 Swagger

Consultez la documentation interactive:

```
http://localhost:3000/docs
```

---

## 📞 Dépannage

### Erreur: "Cannot POST /api/public/inscriptions"
→ Vérifiez que le serveur est démarré (`pnpm start:dev`)

### Erreur: "Classe non trouvée"
→ Utilisez l'ID de classe valide: `00000000-0000-0000-0000-000000000001`

### Erreur: "Email invalide"
→ Utilisez un email valide: `test@example.com`

### Erreur: "429 Too Many Requests"
→ Attendez 60 secondes ou changez d'IP

---

## 🎯 Checklist de Test

- [ ] Démarrer le serveur
- [ ] Configurer Postman environment
- [ ] Tester cas 1: Inscription réussie (201)
- [ ] Tester cas 2: Classe inexistante (404)
- [ ] Tester cas 3: Email invalide (400)
- [ ] Tester cas 4: Données manquantes (400)
- [ ] Tester upsert famille
- [ ] Tester rate-limiting
- [ ] Consulter Swagger

---

**Bon testing! 🚀**

**Repository:** https://github.com/wlw-tech/creche-saas.git

