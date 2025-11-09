# API Inscriptions - Documentation Mise à Jour

## Vue d'ensemble

L'API Inscriptions gère le cycle de vie complet des candidatures:
1. **Candidature publique** - Parents soumettent une candidature
2. **Examen admin** - Admin examine et accepte/rejette
3. **Provisioning** - Création automatique des comptes parents avec emails

## Flux Complet

```
1. Parent soumet candidature (POST /public/inscriptions)
   ↓
2. Admin reçoit candidature (CANDIDATURE)
   ↓
3. Admin met à jour statut (EN_COURS) - optionnel
   ↓
4. Admin accepte (POST /admin/inscriptions/:id/accept)
   ├─ Crée Famille
   ├─ Crée Tuteur(s)
   ├─ Crée Enfant
   ├─ Crée Utilisateur(s) PARENT
   └─ Envoie email(s) avec mot de passe temporaire
   ↓
5. Parent reçoit email et se connecte
```

---

## Endpoints

### 1. POST /public/inscriptions
**Description**: Soumettre une candidature (public)

**Body**:
```json
{
  "famille": {
    "emailPrincipal": "sara@mail.com",
    "languePreferee": "fr",
    "adresseFacturation": "Rue Atlas, Marrakech"
  },
  "tuteurs": [
    {
      "lien": "Mere",
      "prenom": "Sara",
      "nom": "El Idrissi",
      "email": "sara@mail.com",
      "telephone": "+212612345678",
      "principal": true
    },
    {
      "lien": "Pere",
      "prenom": "Youssef",
      "nom": "Bennani",
      "email": "youssef@mail.com",
      "telephone": "+212687654321",
      "principal": false
    }
  ],
  "enfant": {
    "prenom": "Mohammed Amine",
    "nom": "Bennani",
    "dateNaissance": "2022-06-14",
    "genre": "M"
  },
  "classeIdSouhaitee": "cls_1",
  "consentements": {
    "photo": true,
    "sortie": true
  },
  "commentaire": "Allergie aux arachides"
}
```

**Réponse (201)**:
```json
{
  "applicationId": "insc_123",
  "statut": "CANDIDATURE"
}
```

---

### 2. GET /admin/inscriptions
**Description**: Lister les inscriptions (admin)

**Query Parameters**:
- `statut` (optional): CANDIDATURE, EN_COURS, ACTIF, REJETEE
- `q` (optional): Recherche par nom/email
- `dateMin`, `dateMax` (optional): Filtrer par date
- `page` (optional, default=1): Numéro de page
- `pageSize` (optional, default=25): Éléments par page

**Réponse (200)**:
```json
{
  "items": [
    {
      "id": "insc_123",
      "statut": "CANDIDATURE",
      "createdAt": "2025-11-09T10:00:00Z",
      "enfant": {
        "prenom": "Mohammed Amine",
        "nom": "Bennani"
      },
      "parents": [
        {
          "nom": "El Idrissi",
          "email": "sara@mail.com",
          "lien": "Mere"
        }
      ],
      "familleId": null,
      "enfantId": null
    }
  ],
  "page": 1,
  "pageSize": 25,
  "total": 50,
  "hasNext": true
}
```

---

### 3. GET /admin/inscriptions/:id
**Description**: Récupérer une inscription

**Réponse (200)**:
```json
{
  "id": "insc_123",
  "statut": "CANDIDATURE",
  "createdAt": "2025-11-09T10:00:00Z",
  "enfant": {
    "prenom": "Mohammed Amine",
    "nom": "Bennani"
  },
  "parents": [
    {
      "nom": "El Idrissi",
      "email": "sara@mail.com",
      "lien": "Mere"
    }
  ],
  "notes": null,
  "familleId": null,
  "enfantId": null
}
```

---

### 4. PATCH /admin/inscriptions/:id/status
**Description**: Mettre à jour le statut

**Body**:
```json
{
  "statut": "EN_COURS",
  "notes": "Dossier en cours d'examen"
}
```

**Réponse (200)**:
```json
{
  "id": "insc_123",
  "statut": "EN_COURS",
  "notes": "Dossier en cours d'examen"
}
```

---

### 5. POST /admin/inscriptions/:id/accept
**Description**: Accepter une inscription et provisionner les comptes parents

**Body** (optionnel):
```json
{
  "notes": "Accepté - Bienvenue!"
}
```

**Réponse (200)**:
```json
{
  "inscriptionId": "insc_123",
  "statut": "ACTIF",
  "familleId": "fam_456",
  "enfantId": "enf_789",
  "tuteurs": [
    {
      "tuteurId": "tut_1",
      "email": "sara@mail.com",
      "lien": "Mere"
    }
  ],
  "invitedTuteurs": [
    {
      "tuteurId": "tut_1",
      "email": "sara@mail.com",
      "utilisateurId": "user_123",
      "emailSent": true
    }
  ]
}
```

**Email envoyé au parent**:
```
Sujet: Invitation - Crèche WLW - PARENT

Bonjour Sara El Idrissi,

Vous avez été invité(e) à rejoindre la plateforme Crèche WLW en tant que PARENT.

Email: sara@mail.com
Mot de passe temporaire: [GENERATED_PASSWORD]

Veuillez vous connecter à: http://localhost:3000/login

Après votre première connexion, vous pourrez changer votre mot de passe.
```

---

### 6. PATCH /admin/inscriptions/:id/reject
**Description**: Rejeter une inscription

**Body**:
```json
{
  "raison": "Dossier incomplet"
}
```

**Réponse (200)**:
```json
{
  "inscriptionId": "insc_123",
  "statut": "REJETEE",
  "raison": "Dossier incomplet"
}
```

---

## Valeurs Valides

### Statuts d'Inscription
```
CANDIDATURE  → État initial
EN_COURS     → En examen par l'admin
ACTIF        → Acceptée, comptes créés
REJETEE      → Rejetée
```

### Transitions Autorisées
```
CANDIDATURE → EN_COURS, ACTIF, REJETEE
EN_COURS    → ACTIF, REJETEE
ACTIF       → (aucune)
REJETEE     → (aucune)
```

### Lien de Parenté (lien)
```
Mere
Pere
Proche
Tuteur
Autre
```

### Langues
```
fr (Français)
ar (Arabe)
```

---

## Exemples cURL

### Soumettre une candidature
```bash
curl -X POST http://localhost:3000/api/public/inscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "famille": {
      "emailPrincipal": "sara@mail.com",
      "languePreferee": "fr"
    },
    "tuteurs": [
      {
        "lien": "Mere",
        "prenom": "Sara",
        "nom": "El Idrissi",
        "email": "sara@mail.com",
        "telephone": "+212612345678",
        "principal": true
      }
    ],
    "enfant": {
      "prenom": "Mohammed Amine",
      "nom": "Bennani",
      "dateNaissance": "2022-06-14"
    },
    "classeIdSouhaitee": "cls_1"
  }'
```

### Lister les inscriptions
```bash
curl -H "Authorization: Bearer <admin_jwt>" \
  "http://localhost:3000/api/admin/inscriptions?statut=CANDIDATURE&page=1&pageSize=25"
```

### Accepter une inscription
```bash
curl -X POST \
  -H "Authorization: Bearer <admin_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"notes":"Accepté"}' \
  http://localhost:3000/api/admin/inscriptions/insc_123/accept
```

---

## Erreurs Possibles

| Code | Message | Cause |
|------|---------|-------|
| 400 | Aucun tuteur avec email trouvé | Payload sans email tuteur |
| 400 | Transition invalide | Statut non autorisé |
| 404 | Inscription non trouvée | ID invalide |
| 409 | Impossible d'accepter | Statut incompatible |

---

## Flux d'Email

Lors de l'acceptation d'une inscription:

1. **Pour chaque tuteur avec email**:
   - Générer mot de passe temporaire (12 caractères)
   - Créer invitation Supabase
   - Créer utilisateur local PARENT
   - Envoyer email d'invitation

2. **Email contient**:
   - Email de connexion
   - Mot de passe temporaire
   - Lien de connexion
   - Instructions pour changer le mot de passe

3. **Parent peut alors**:
   - Se connecter avec email + mot de passe temporaire
   - Changer son mot de passe
   - Accéder au tableau de bord

