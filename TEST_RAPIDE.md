# 🚀 TEST RAPIDE - ADMIN CRUD

## ✅ ADMIN USER CRÉÉ

L'utilisateur ADMIN a été créé dans la base de données:
```
Email: admin@wlw.ma
Rôle: ADMIN
Statut: ACTIVE
```

---

## 📋 WORKFLOW DE TEST

### 1️⃣ LOGIN ADMIN

**URL:** `POST http://localhost:3000/api/auth/login`

**Body:**
```json
{
  "email": "admin@wlw.ma",
  "password": "change_me"
}
```

**Réponse attendue (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}
```

**⚠️ COPIER le `accessToken` pour les prochaines requêtes!**

---

### 2️⃣ CRÉER ENSEIGNANT

**URL:** `POST http://localhost:3000/api/admin/users`

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "email": "teacher1@wlw.ma",
  "prenom": "Ahmed",
  "nom": "Bennani",
  "role": "ENSEIGNANT",
  "telephone": "+212612345678"
}
```

**Réponse attendue (201):**
```json
{
  "utilisateurId": "usr_123",
  "email": "teacher1@wlw.ma",
  "role": "ENSEIGNANT",
  "statut": "INVITED",
  "invited": true
}
```

---

### 3️⃣ CRÉER PARENT

**URL:** `POST http://localhost:3000/api/admin/users`

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "email": "parent1@wlw.ma",
  "prenom": "Fatima",
  "nom": "Alaoui",
  "role": "PARENT",
  "telephone": "+212612345679"
}
```

**Réponse attendue (201):**
```json
{
  "utilisateurId": "usr_456",
  "email": "parent1@wlw.ma",
  "role": "PARENT",
  "statut": "INVITED",
  "invited": true
}
```

---

### 4️⃣ LISTER TOUS LES UTILISATEURS

**URL:** `GET http://localhost:3000/api/admin/users?page=1&limit=10`

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Réponse attendue (200):**
```json
{
  "data": [
    {
      "id": "usr_123",
      "email": "teacher1@wlw.ma",
      "prenom": "Ahmed",
      "nom": "Bennani",
      "role": "ENSEIGNANT",
      "statut": "INVITED"
    },
    {
      "id": "usr_456",
      "email": "parent1@wlw.ma",
      "prenom": "Fatima",
      "nom": "Alaoui",
      "role": "PARENT",
      "statut": "INVITED"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  }
}
```

---

### 5️⃣ FILTRER PAR RÔLE

**Lister enseignants:**
```
GET http://localhost:3000/api/admin/users?role=ENSEIGNANT&page=1&limit=10
```

**Lister parents:**
```
GET http://localhost:3000/api/admin/users?role=PARENT&page=1&limit=10
```

---

### 6️⃣ OBTENIR UN UTILISATEUR

**URL:** `GET http://localhost:3000/api/admin/users/{{userId}}`

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Réponse attendue (200):**
```json
{
  "id": "usr_123",
  "email": "teacher1@wlw.ma",
  "prenom": "Ahmed",
  "nom": "Bennani",
  "role": "ENSEIGNANT",
  "statut": "INVITED",
  "telephone": "+212612345678",
  "creeLe": "2025-10-29T16:10:47.000Z"
}
```

---

### 7️⃣ MODIFIER STATUT

**URL:** `PATCH http://localhost:3000/api/admin/users/{{userId}}/status`

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body (Activer):**
```json
{
  "statut": "ACTIVE"
}
```

**Réponse attendue (200):**
```json
{
  "id": "usr_123",
  "email": "teacher1@wlw.ma",
  "statut": "ACTIVE",
  "activeLe": "2025-11-03T19:45:00.000Z"
}
```

---

### 8️⃣ SUPPRIMER UTILISATEUR

**URL:** `DELETE http://localhost:3000/api/admin/users/{{userId}}`

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Réponse attendue (200):**
```json
{
  "message": "Utilisateur supprimé avec succès",
  "id": "usr_123"
}
```

---

## 🎯 RÉSUMÉ

| Étape | Endpoint | Méthode | Status |
|-------|----------|---------|--------|
| 1 | `/auth/login` | POST | ✅ |
| 2 | `/admin/users` | POST | ✅ |
| 3 | `/admin/users` | POST | ✅ |
| 4 | `/admin/users` | GET | ✅ |
| 5 | `/admin/users?role=...` | GET | ✅ |
| 6 | `/admin/users/:id` | GET | ✅ |
| 7 | `/admin/users/:id/status` | PATCH | ✅ |
| 8 | `/admin/users/:id` | DELETE | ✅ |

---

**🎉 PRÊT À TESTER!**

