# 🚀 Postman V3 - Quick Start (5 minutes)

## 📥 Importer la Collection

1. Ouvrir **Postman**
2. Cliquer sur **Import**
3. Sélectionner le fichier: `Creche-API-Fixed-v3.postman_collection.json`
4. Cliquer sur **Import**

---

## ⚙️ Configuration Variables

### Dans Postman:
1. Cliquer sur **Environments** (en haut à droite)
2. Créer un nouvel environment: **Crèche API**
3. Ajouter ces variables:

| Variable | Valeur |
|----------|--------|
| `base_url` | `http://localhost:3000/api` |
| `admin_token` | (vide pour maintenant) |
| `teacher_token` | (vide pour maintenant) |
| `parent_token` | (vide pour maintenant) |
| `classe_id` | (vide pour maintenant) |
| `enfant_id` | (vide pour maintenant) |
| `menu_id` | (vide pour maintenant) |
| `teacher_id` | (vide pour maintenant) |

4. Cliquer sur **Save**
5. Sélectionner cet environment dans le dropdown en haut à droite

---

## 🔐 Étape 1: Login Admin

**Endpoint**: `POST /auth/login`

**Body**:
```json
{
  "email": "admin@wlw.ma",
  "password": "change_me"
}
```

**Réponse**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}
```

**Action**: Copier `accessToken` et le coller dans `{{admin_token}}`

---

## 👥 Étape 2: Créer Utilisateur

**Endpoint**: `POST /admin/users`

**Header**: `Authorization: Bearer {{admin_token}}`

**Body**:
```json
{
  "email": "prof@example.com",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "telephone": "+212612345678",
  "role": "ENSEIGNANT"
}
```

**Réponse**:
```json
{
  "utilisateurId": "usr_123",
  "email": "prof@example.com",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "role": "ENSEIGNANT",
  "statut": "INVITED",
  "tempPassword": "temp_password_123"
}
```

**Action**: Copier `utilisateurId` → `{{teacher_id}}` et `tempPassword` pour la prochaine étape

---

## 📚 Étape 3: Créer Classe

**Endpoint**: `POST /admin/classes`

**Header**: `Authorization: Bearer {{admin_token}}`

**Body**:
```json
{
  "nom": "Petite Section",
  "trancheAge": "PS",
  "capacite": 20,
  "active": true
}
```

**Réponse**:
```json
{
  "id": "cls_1",
  "nom": "Petite Section",
  "trancheAge": "PS",
  "capacite": 20,
  "active": true
}
```

**Action**: Copier `id` → `{{classe_id}}`

---

## 🎓 Étape 4: Assigner Enseignant à Classe

**Endpoint**: `POST /admin/classes/{{classe_id}}/enseignants/{{teacher_id}}`

**Header**: `Authorization: Bearer {{admin_token}}`

**Body**: `{}`

**Réponse**:
```json
{
  "message": "Enseignant assigné avec succès",
  "classe": {
    "id": "cls_1",
    "nom": "Petite Section",
    "enseignants": [
      {
        "id": "usr_123",
        "prenom": "Ahmed",
        "nom": "Dupont"
      }
    ]
  }
}
```

---

## 🔑 Étape 5: Login Enseignant

**Endpoint**: `POST /auth/login-user`

**Body**:
```json
{
  "email": "prof@example.com",
  "password": "temp_password_123"
}
```

**Réponse**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "usr_123",
  "role": "ENSEIGNANT",
  "email": "prof@example.com"
}
```

**Action**: Copier `accessToken` → `{{teacher_token}}`

---

## 👨‍👩‍👧 Étape 6: Voir Classe avec Enfants + Présences

**Endpoint**: `GET /admin/classes/{{classe_id}}/enfants`

**Header**: `Authorization: Bearer {{admin_token}}`

**Réponse**:
```json
{
  "classeId": "cls_1",
  "classeNom": "Petite Section",
  "date": "2025-11-10",
  "totalEnfants": 3,
  "enfants": [
    {
      "id": "enf_1",
      "prenom": "Alice",
      "nom": "Dupont",
      "dateNaissance": "2022-05-15",
      "presence": {
        "id": "pres_1",
        "statut": "Present",
        "arriveeA": "08:30",
        "departA": "17:00"
      }
    }
  ]
}
```

---

## 🍽️ Étape 7: Créer Menu

**Endpoint**: `POST /menus`

**Header**: `Authorization: Bearer {{admin_token}}`

**Body**:
```json
{
  "date": "2025-11-10",
  "entree": "Salade",
  "plat": "Poulet riz",
  "dessert": "Fruit",
  "allergenes": ["Arachides"]
}
```

**Réponse**:
```json
{
  "id": "menu_1",
  "date": "2025-11-10",
  "entree": "Salade",
  "plat": "Poulet riz",
  "dessert": "Fruit",
  "allergenes": ["Arachides"],
  "statut": "Brouillon"
}
```

**Action**: Copier `id` → `{{menu_id}}`

---

## 📞 Support

- 📖 **Guide Complet**: `FIXES_V3_COMPLETE_GUIDE.md`
- 📖 **Swagger**: http://localhost:3000/api/docs
- 📮 **Collection**: `Creche-API-Fixed-v3.postman_collection.json`

---

## ✅ Checklist

- [ ] Collection importée
- [ ] Environment créé
- [ ] Admin login réussi
- [ ] Utilisateur créé
- [ ] Classe créée
- [ ] Enseignant assigné
- [ ] Enseignant login réussi
- [ ] Classe avec enfants visible
- [ ] Menu créé

**Prêt pour les tests!** 🚀

