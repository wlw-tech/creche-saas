# 🔧 Tester avec CURL - Guide Simple

## 🚀 Démarrer le Serveur

```bash
cd creche-api
pnpm start:dev
```

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

**Réponse:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}
```

**Sauvegarder le token:**
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

**Réponse:**
```json
{
  "utilisateurId": "uuid-xxx",
  "email": "prof@wlw.ma",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "role": "ENSEIGNANT",
  "statut": "INVITED"
}
```

---

## 📋 3. Lister les Utilisateurs

```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer $TOKEN"
```

**Avec filtres:**
```bash
curl -X GET "http://localhost:3000/api/admin/users?role=ENSEIGNANT&statut=ACTIVE&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 👤 4. Obtenir un Utilisateur

```bash
curl -X GET http://localhost:3000/api/admin/users/uuid-xxx \
  -H "Authorization: Bearer $TOKEN"
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

---

## 📝 6. Accepter une Inscription

```bash
curl -X POST http://localhost:3000/api/inscriptions/uuid-xxx/accept \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Inscription acceptée"
  }'
```

---

## ❌ 7. Rejeter une Inscription

```bash
curl -X PATCH http://localhost:3000/api/inscriptions/uuid-xxx/reject \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "raison": "Classe complète"
  }'
```

---

## 🔗 Script Complet

Créer un fichier `test.sh`:

```bash
#!/bin/bash

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

**Installer jq (pour parser JSON):**
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# Windows (Chocolatey)
choco install jq
```

**Afficher les headers:**
```bash
curl -i -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer $TOKEN"
```

**Mesurer le temps:**
```bash
curl -w "\nTime: %{time_total}s\n" ...
```

---

**🎉 Vous êtes prêt à tester avec curl!**

