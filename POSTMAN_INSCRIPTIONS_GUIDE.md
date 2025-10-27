# 📱 Guide Postman - API Inscriptions

## ⚡ Démarrage Rapide (5 minutes)

### 1️⃣ Démarrer le Serveur

```bash
cd creche-api
pnpm start:dev
```

### 2️⃣ Configurer Postman

- **Environments** → **Create New**
- **Name:** `Creche-API-Dev`
- **Variable:** `base_url` = `http://localhost:3000/api`
- **Save**

### 3️⃣ Créer une Requête

- **Method:** `POST`
- **URL:** `{{base_url}}/public/inscriptions`
- **Headers:** `Content-Type: application/json`

### 4️⃣ Copier le Body

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
      "principal": true
    }
  ],
  "enfant": {
    "prenom": "Nour",
    "nom": "Test",
    "dateNaissance": "2021-05-10"
  },
  "classeIdSouhaitee": "00000000-0000-0000-0000-000000000001"
}
```

### 5️⃣ Cliquer Send → ✅ Status 201

**Réponse:**
```json
{
  "applicationId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "statut": "Candidature"
}
```

---

## 🧪 Cas de Test

| Cas | Changement | Résultat |
|-----|-----------|----------|
| **1. Réussi** | Aucun | ✅ 201 |
| **2. Classe inexistante** | `classeIdSouhaitee`: `ffffffff-ffff-ffff-ffff-ffffffffffff` | ❌ 404 |
| **3. Email invalide** | `emailPrincipal`: `invalid-email` | ❌ 400 |
| **4. Données manquantes** | Supprimer `nom` de l'enfant | ❌ 400 |
| **5. Upsert famille** | Même email, enfant différent | ✅ 201 |

---

## 📋 Valeurs Valides

**Lien Tuteur:** `Pere`, `Mere`, `Tuteur`, `Autre`
**Langue:** `fr`, `ar`
**Genre:** `M`, `F`

---

## 🔐 Sécurité

- **Rate-limit:** 20 req/min/IP (429 si dépassé)
- **Validation:** Email, dates, champs obligatoires
- **Transaction:** Atomique (tout ou rien)

---

## 📊 Codes de Réponse

| Code | Signification |
|------|---------------|
| 201 | ✅ Inscription créée |
| 400 | ❌ Données invalides |
| 404 | ❌ Classe non trouvée |
| 429 | ❌ Rate-limit dépassé |

---

## 🔗 Ressources

- **Swagger:** http://localhost:3000/docs
- **Prisma Studio:** `pnpm prisma studio`
- **GitHub:** https://github.com/wlw-tech/creche-saas.git

