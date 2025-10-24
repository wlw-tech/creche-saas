# 📋 Postman Copy-Paste Ready Examples

## 🚀 Quick Copy-Paste for All Endpoints

### 1️⃣ CREATE - POST /api/familles

**URL:**
```
{{base_url}}/familles
```

**Headers:**
```
Content-Type: application/json
```

**Body (Copy-Paste):**
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

**Expected Response (Status 201):**
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
    },
    {
      "id": "uuid",
      "familleId": "uuid-generated",
      "lien": "Pere",
      "telephone": "+212687654321",
      "email": "ahmed@example.com",
      "principal": false
    }
  ],
  "enfants": []
}
```

---

### 2️⃣ READ ALL - GET /api/familles

**URL:**
```
{{base_url}}/familles
```

**Method:** GET

**Expected Response (Status 200):**
```json
{
  "value": [
    {
      "id": "uuid",
      "emailPrincipal": "famille.test@example.com",
      "languePreferee": "fr",
      "adresseFacturation": "123 Rue de la Paix, Casablanca",
      "tuteurs": [
        {
          "id": "uuid",
          "familleId": "uuid",
          "lien": "Mere",
          "telephone": "+212612345678",
          "email": "fatima@example.com",
          "principal": false
        }
      ],
      "enfants": []
    }
  ],
  "count": 1
}
```

---

### 3️⃣ READ STATS - GET /api/familles/:id/stats

**URL:**
```
{{base_url}}/familles/PASTE_ID_HERE/stats
```

**Method:** GET

**Expected Response (Status 200):**
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

### 4️⃣ READ ONE - GET /api/familles/:id

**URL:**
```
{{base_url}}/familles/PASTE_ID_HERE
```

**Method:** GET

**Expected Response (Status 200):**
```json
{
  "id": "uuid",
  "emailPrincipal": "famille.test@example.com",
  "languePreferee": "fr",
  "adresseFacturation": "123 Rue de la Paix, Casablanca",
  "tuteurs": [
    {
      "id": "uuid",
      "familleId": "uuid",
      "lien": "Mere",
      "telephone": "+212612345678",
      "email": "fatima@example.com",
      "principal": false
    },
    {
      "id": "uuid",
      "familleId": "uuid",
      "lien": "Pere",
      "telephone": "+212687654321",
      "email": "ahmed@example.com",
      "principal": false
    }
  ],
  "enfants": []
}
```

---

### 5️⃣ UPDATE - PATCH /api/familles/:id

**URL:**
```
{{base_url}}/familles/PASTE_ID_HERE
```

**Method:** PATCH

**Headers:**
```
Content-Type: application/json
```

**Body (Copy-Paste):**
```json
{
  "emailPrincipal": "famille.updated@example.com",
  "languePreferee": "ar",
  "adresseFacturation": "456 Avenue Hassan II, Rabat"
}
```

**Expected Response (Status 200):**
```json
{
  "id": "uuid",
  "emailPrincipal": "famille.updated@example.com",
  "languePreferee": "ar",
  "adresseFacturation": "456 Avenue Hassan II, Rabat",
  "tuteurs": [...],
  "enfants": []
}
```

---

### 6️⃣ DELETE - DELETE /api/familles/:id

**URL:**
```
{{base_url}}/familles/PASTE_ID_HERE
```

**Method:** DELETE

**Expected Response (Status 204):**
```
(No content)
```

---

### 7️⃣ VERIFY DELETION - GET /api/familles/:id

**URL:**
```
{{base_url}}/familles/PASTE_ID_HERE
```

**Method:** GET

**Expected Response (Status 404):**
```json
{
  "statusCode": 404,
  "message": "Famille avec l'ID PASTE_ID_HERE non trouvée",
  "error": "Not Found"
}
```

---

## 🎯 Alternative Examples

### Create with Minimal Data

```json
{
  "emailPrincipal": "simple@example.com"
}
```

### Create with Multiple Tuteurs

```json
{
  "emailPrincipal": "famille.large@example.com",
  "languePreferee": "en",
  "adresseFacturation": "789 Rue de la Liberté",
  "tuteurs": [
    {
      "lien": "Mere",
      "telephone": "+212612345678",
      "email": "mere@example.com"
    },
    {
      "lien": "Pere",
      "telephone": "+212687654321",
      "email": "pere@example.com"
    },
    {
      "lien": "Proche",
      "telephone": "+212698765432",
      "email": "proche@example.com"
    }
  ]
}
```

### Update Only Email

```json
{
  "emailPrincipal": "newemail@example.com"
}
```

### Update Only Language

```json
{
  "languePreferee": "ar"
}
```

---

## 🔍 Error Examples

### Email Already Used (Status 400)

**Request:**
```json
{
  "emailPrincipal": "existing@example.com"
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": "Email principal déjà utilisé par une autre famille",
  "error": "Bad Request"
}
```

### Invalid Email (Status 400)

**Request:**
```json
{
  "emailPrincipal": "not-an-email"
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "emailPrincipal must be an email"
  ],
  "error": "Bad Request"
}
```

### Not Found (Status 404)

**Request:**
```
GET /api/familles/invalid-id
```

**Response:**
```json
{
  "statusCode": 404,
  "message": "Famille avec l'ID invalid-id non trouvée",
  "error": "Not Found"
}
```

---

## 💡 Postman Tips

### Save ID Automatically

**In Tests tab:**
```javascript
if (pm.response.code === 201) {
  var jsonData = pm.response.json();
  pm.environment.set("famille_id", jsonData.id);
}
```

### Validate Response

**In Tests tab:**
```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Response has id", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('id');
});

pm.test("Email is correct", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.emailPrincipal).to.equal("famille.test@example.com");
});
```

---

**Ready to test! 🚀**

