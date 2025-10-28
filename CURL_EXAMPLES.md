# 🔧 Exemples CURL - Tester l'API

## 🚀 Démarrage Rapide

### 1. Démarrer le serveur
```bash
cd creche-api
pnpm start:dev
```

### 2. Exécuter les commandes curl ci-dessous

---

## 🔐 1. Login Admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wlw.ma",
    "password": "change_me"
  }'
```

**Réponse (Status 200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}
```

### 💾 Sauvegarder le token
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 👥 2. Inviter un Enseignant

```bash
curl -X POST http://localhost:3000/api/admin/users/teachers/invite \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prof@wlw.ma",
    "prenom": "Ahmed",
    "nom": "Dupont",
    "telephone": "+212612345678"
  }'
```

**Réponse (Status 201):**
```json
{
  "utilisateurId": "uuid-xxx",
  "email": "prof@wlw.ma",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "role": "ENSEIGNANT",
  "statut": "INVITED",
  "inviteLe": "2025-10-28T15:30:00Z"
}
```

---

## 📋 3. Lister les Utilisateurs

### Sans filtres
```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer $TOKEN"
```

### Avec filtres
```bash
curl -X GET "http://localhost:3000/api/admin/users?role=ENSEIGNANT&statut=ACTIVE&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse (Status 200):**
```json
{
  "data": [
    {
      "utilisateurId": "uuid-xxx",
      "email": "prof@wlw.ma",
      "prenom": "Ahmed",
      "nom": "Dupont",
      "role": "ENSEIGNANT",
      "statut": "INVITED"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

## 👤 4. Obtenir un Utilisateur

```bash
curl -X GET http://localhost:3000/api/admin/users/uuid-xxx \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse (Status 200):**
```json
{
  "utilisateurId": "uuid-xxx",
  "email": "prof@wlw.ma",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "role": "ENSEIGNANT",
  "statut": "INVITED",
  "inviteLe": "2025-10-28T15:30:00Z"
}
```

---

## 🔄 5. Mettre à Jour le Statut

```bash
curl -X PATCH http://localhost:3000/api/admin/users/uuid-xxx/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "statut": "ACTIVE"
  }'
```

**Réponse (Status 200):**
```json
{
  "utilisateurId": "uuid-xxx",
  "email": "prof@wlw.ma",
  "statut": "ACTIVE",
  "activeLe": "2025-10-28T15:35:00Z"
}
```

---

## 📝 6. Accepter une Inscription

```bash
curl -X POST http://localhost:3000/api/inscriptions/uuid-inscription/accept \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Inscription acceptée"
  }'
```

**Réponse (Status 200):**
```json
{
  "inscriptionId": "uuid-xxx",
  "statut": "Actif",
  "familleId": "uuid-xxx",
  "enfantId": "uuid-xxx",
  "tuteurs": [
    {
      "tuteurId": "uuid-xxx",
      "email": "parent@example.com",
      "statut": "sent"
    }
  ]
}
```

---

## ❌ 7. Rejeter une Inscription

```bash
curl -X PATCH http://localhost:3000/api/inscriptions/uuid-inscription/reject \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "raison": "Classe complète"
  }'
```

**Réponse (Status 200):**
```json
{
  "inscriptionId": "uuid-xxx",
  "statut": "Rejetée",
  "raison": "Classe complète"
}
```

---

## 🧪 Cas de Test

### Test 1: Email invalide
```bash
curl -X POST http://localhost:3000/api/admin/users/teachers/invite \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "prenom": "Ahmed",
    "nom": "Dupont"
  }'
```
**Résultat:** ❌ Status 400 - "Email invalide"

### Test 2: Données manquantes
```bash
curl -X POST http://localhost:3000/api/admin/users/teachers/invite \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prof@wlw.ma"
  }'
```
**Résultat:** ❌ Status 400 - "Champ manquant: prenom"

### Test 3: Sans token
```bash
curl -X POST http://localhost:3000/api/admin/users/teachers/invite \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prof@wlw.ma",
    "prenom": "Ahmed",
    "nom": "Dupont"
  }'
```
**Résultat:** ❌ Status 401 - "Unauthorized"

### Test 4: Token invalide
```bash
curl -X POST http://localhost:3000/api/admin/users/teachers/invite \
  -H "Authorization: Bearer invalid_token" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prof@wlw.ma",
    "prenom": "Ahmed",
    "nom": "Dupont"
  }'
```
**Résultat:** ❌ Status 401 - "Invalid token"

---

## 🔗 Script Complet

Créer un fichier `test.sh`:

```bash
#!/bin/bash

# Configuration
BASE_URL="http://localhost:3000/api"

# 1. Login
echo "🔐 Login..."
RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wlw.ma",
    "password": "change_me"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.accessToken')
echo "✅ Token: $TOKEN"

# 2. Inviter enseignant
echo ""
echo "👥 Inviter enseignant..."
curl -s -X POST $BASE_URL/admin/users/teachers/invite \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prof@wlw.ma",
    "prenom": "Ahmed",
    "nom": "Dupont"
  }' | jq .

# 3. Lister utilisateurs
echo ""
echo "📋 Lister utilisateurs..."
curl -s -X GET $BASE_URL/admin/users \
  -H "Authorization: Bearer $TOKEN" | jq .

echo ""
echo "✅ Tests terminés!"
```

Exécuter:
```bash
chmod +x test.sh
./test.sh
```

---

## 💡 Conseils

1. **Installer jq:** Pour parser JSON en ligne de commande
   ```bash
   # macOS
   brew install jq
   
   # Ubuntu/Debian
   sudo apt-get install jq
   
   # Windows (avec Chocolatey)
   choco install jq
   ```

2. **Sauvegarder les réponses:** Rediriger vers un fichier
   ```bash
   curl ... > response.json
   ```

3. **Afficher les headers:** Ajouter `-i` ou `-v`
   ```bash
   curl -i -X GET http://localhost:3000/api/admin/users \
     -H "Authorization: Bearer $TOKEN"
   ```

4. **Mesurer le temps:** Ajouter `-w`
   ```bash
   curl -w "\nTime: %{time_total}s\n" ...
   ```

---

## 🎯 Flux Complet

```bash
# 1. Démarrer le serveur
cd creche-api && pnpm start:dev

# 2. Dans un autre terminal
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wlw.ma","password":"change_me"}' | jq -r '.accessToken')

# 3. Inviter enseignant
curl -X POST http://localhost:3000/api/admin/users/teachers/invite \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"prof@wlw.ma","prenom":"Ahmed","nom":"Dupont"}'

# 4. Lister utilisateurs
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer $TOKEN"
```

---

**🎉 Vous êtes prêt à tester l'API avec curl!**

Pour plus de détails, consultez: `POSTMAN_GUIDE_SIMPLE.md`

