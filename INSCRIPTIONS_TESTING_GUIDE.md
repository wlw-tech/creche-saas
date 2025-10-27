# 🧪 Guide de Test - API Inscriptions

## 🚀 Démarrage Rapide

### 1. Démarrer le serveur
```bash
cd creche-api
pnpm start:dev
```

Attendez: `Listening on port 3000` ✅

### 2. Vérifier les données de test
```bash
pnpm prisma studio
```

Vérifiez qu'il existe au moins une classe active avec ID: `00000000-0000-0000-0000-000000000001`

### 3. Tester l'endpoint

## 📝 Exemples cURL

### ✅ Cas Réussi - Créer une Inscription

```bash
curl -X POST http://localhost:3000/api/public/inscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "famille": {
      "emailPrincipal": "parent@example.com",
      "languePreferee": "fr",
      "adresseFacturation": "123 Rue Test, Casablanca"
    },
    "tuteurs": [
      {
        "lien": "Mere",
        "prenom": "Amina",
        "nom": "Benani",
        "email": "amina@example.com",
        "telephone": "+2126000000",
        "principal": true
      },
      {
        "lien": "Pere",
        "prenom": "Ahmed",
        "nom": "Benani",
        "email": "ahmed@example.com",
        "telephone": "+2126000001",
        "principal": false
      }
    ],
    "enfant": {
      "prenom": "Nour",
      "nom": "Benani",
      "dateNaissance": "2021-05-10",
      "genre": "F",
      "photo": "https://example.com/photo.jpg"
    },
    "classeIdSouhaitee": "00000000-0000-0000-0000-000000000001",
    "consentements": {
      "photo": true,
      "sortie": true
    },
    "commentaire": "Allergie légère aux œufs"
  }'
```

**Réponse (201 Created):**
```json
{
  "applicationId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "statut": "Candidature"
}
```

### ❌ Classe Inexistante

```bash
curl -X POST http://localhost:3000/api/public/inscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "famille": {
      "emailPrincipal": "test@example.com",
      "languePreferee": "fr"
    },
    "tuteurs": [],
    "enfant": {
      "prenom": "Test",
      "nom": "Test",
      "dateNaissance": "2021-01-01"
    },
    "classeIdSouhaitee": "ffffffff-ffff-ffff-ffff-ffffffffffff"
  }'
```

**Réponse (404 Not Found):**
```json
{
  "message": "Classe non trouvée",
  "error": "Not Found",
  "statusCode": 404
}
```

### ❌ Email Invalide

```bash
curl -X POST http://localhost:3000/api/public/inscriptions \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

**Réponse (400 Bad Request):**
```json
{
  "message": ["emailPrincipal must be an email"],
  "error": "Bad Request",
  "statusCode": 400
}
```

## 📱 Postman

### Configuration

1. **Créer Environment:**
   - Name: `Creche-API-Dev`
   - Variable: `base_url` = `http://localhost:3000/api`
   - Variable: `classeId` = `00000000-0000-0000-0000-000000000001`

2. **Créer Collection:** `Inscriptions`

### Requête POST

```
Method: POST
URL: {{base_url}}/public/inscriptions
Headers: Content-Type: application/json

Body (raw JSON):
{
  "famille": {
    "emailPrincipal": "parent@example.com",
    "languePreferee": "fr",
    "adresseFacturation": "123 Rue Test"
  },
  "tuteurs": [
    {
      "lien": "Mere",
      "prenom": "Amina",
      "nom": "Test",
      "email": "mere@example.com",
      "telephone": "+2126000000",
      "principal": true
    }
  ],
  "enfant": {
    "prenom": "Nour",
    "nom": "Test",
    "dateNaissance": "2021-05-10",
    "genre": "F"
  },
  "classeIdSouhaitee": "{{classeId}}",
  "consentements": {
    "photo": true,
    "sortie": true
  }
}
```

### Tests Postman

```javascript
pm.test("Status is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has applicationId", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('applicationId');
});

pm.test("Response has statut=Candidature", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.statut).to.equal('Candidature');
});

// Sauvegarder l'ID pour les tests suivants
pm.environment.set("applicationId", pm.response.json().applicationId);
```

## 🧪 Tests Automatisés

### Exécuter tous les tests

```bash
pnpm test:e2e inscriptions
```

**Résultat attendu:**
```
Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

### Tests couverts

1. ✅ Happy path - Création réussie
2. ✅ Classe inexistante - 404
3. ✅ Classe inactive - 400
4. ✅ Email invalide - 400
5. ✅ Upsert famille - Même email

## 🔒 Rate Limiting

L'endpoint est protégé par rate-limit: **20 requêtes par minute par IP**

```bash
# Tester le rate-limit
for i in {1..25}; do
  curl -X POST http://localhost:3000/api/public/inscriptions \
    -H "Content-Type: application/json" \
    -d '{"famille":{"emailPrincipal":"test@example.com","languePreferee":"fr"},"tuteurs":[],"enfant":{"prenom":"Test","nom":"Test","dateNaissance":"2021-01-01"},"classeIdSouhaitee":"00000000-0000-0000-0000-000000000001"}'
  echo "Request $i"
done
```

**Réponse après 20 requêtes (429 Too Many Requests):**
```json
{
  "message": "ThrottlerException: Too Many Requests",
  "error": "Too Many Requests",
  "statusCode": 429
}
```

## 📊 Swagger Documentation

Accédez à: http://localhost:3000/docs

Vous verrez:
- Endpoint `POST /api/public/inscriptions`
- Schémas complets des DTOs
- Exemples de requête/réponse
- Codes d'erreur possibles

## 🐛 Dépannage

### Erreur: "Aucune classe active trouvée"
```bash
# Exécuter le seed
pnpm prisma db seed
```

### Erreur: "classeIdSouhaitee must be a UUID"
Vérifiez que l'UUID est au bon format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### Erreur: "Port 3000 already in use"
```bash
# Trouver et tuer le processus
lsof -i :3000
kill -9 <PID>
```

## 📚 Ressources

- **Swagger:** http://localhost:3000/docs
- **Prisma Studio:** `pnpm prisma studio`
- **Logs:** Console du serveur
- **Tests:** `test/inscriptions.e2e-spec.ts`

---
**Bon testing! 🚀**

