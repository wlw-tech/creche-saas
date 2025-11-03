# 🧪 TEST EMAIL D'INVITATION

## ✅ NOUVELLE FONCTIONNALITÉ!

Maintenant, quand vous créez un **enseignant** ou un **parent**, ils reçoivent automatiquement un **email d'invitation** avec:
- ✅ Leur email
- ✅ Un mot de passe temporaire
- ✅ Instructions de connexion

---

## 🚀 COMMENT TESTER

### 1️⃣ LOGIN ADMIN
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@wlw.ma",
  "password": "change_me"
}
```

**Réponse:** Copier le `accessToken`

---

### 2️⃣ CRÉER ENSEIGNANT
```
POST http://localhost:3000/api/admin/users
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "email": "teacher1@wlw.ma",
  "prenom": "Ahmed",
  "nom": "Bennani",
  "role": "ENSEIGNANT",
  "telephone": "+212612345678"
}
```

**Réponse (201):**
```json
{
  "utilisateurId": "e4bf90dc-b506-406c-ba9a-159b2d0e2496",
  "email": "teacher1@wlw.ma",
  "role": "ENSEIGNANT",
  "statut": "INVITED",
  "invited": true,
  "emailSent": true
}
```

---

### 3️⃣ VÉRIFIER L'EMAIL DANS LA CONSOLE

**En DEV MODE**, l'email s'affiche dans la console du serveur:

```
📧 EMAIL D'INVITATION (DEV MODE)
To: teacher1@wlw.ma
Subject: Invitation - Crèche WLW - ENSEIGNANT
---
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; text-align: center; }
    .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }
    .credentials { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
    .credentials p { margin: 10px 0; }
    .label { font-weight: bold; color: #667eea; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Bienvenue à la Crèche WLW!</h1>
    </div>

    <div class="content">
      <p>Bonjour <strong>Ahmed Bennani</strong>,</p>

      <p>Vous avez été invité(e) en tant que <strong>ENSEIGNANT</strong> sur la plateforme Crèche WLW.</p>

      <p>Veuillez utiliser les identifiants ci-dessous pour vous connecter:</p>

      <div class="credentials">
        <p><span class="label">📧 Email:</span> teacher1@wlw.ma</p>
        <p><span class="label">🔐 Mot de passe temporaire:</span> <code>aB3$cD9@eF2!</code></p>
      </div>

      <p>⚠️ <strong>Important:</strong> Veuillez changer votre mot de passe lors de votre première connexion.</p>

      <a href="http://localhost:3000/login" class="button">Se connecter</a>

      <p>Si vous avez des questions, veuillez contacter l'administrateur.</p>
    </div>

    <div class="footer">
      <p>© 2024 Crèche WLW. Tous droits réservés.</p>
      <p>Cet email a été envoyé automatiquement. Veuillez ne pas répondre.</p>
    </div>
  </div>
</body>
</html>
---
```

---

## 📧 EMAIL CONTIENT

✅ **Prénom et Nom** - Personnalisé
✅ **Rôle** - ENSEIGNANT ou PARENT
✅ **Email** - Pour la connexion
✅ **Mot de passe temporaire** - Généré aléatoirement
✅ **Lien de connexion** - Bouton cliquable
✅ **Instructions** - Changer le mot de passe
✅ **Design professionnel** - HTML formaté

---

## 🔐 MOT DE PASSE TEMPORAIRE

- **Longueur:** 12 caractères
- **Caractères:** Majuscules, minuscules, chiffres, symboles
- **Exemple:** `aB3$cD9@eF2!`
- **Généré aléatoirement** à chaque création

---

## 🧪 CRÉER PARENT

```
POST http://localhost:3000/api/admin/users
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "email": "parent1@wlw.ma",
  "prenom": "Fatima",
  "nom": "Alaoui",
  "role": "PARENT",
  "telephone": "+212612345679"
}
```

**Réponse (201):**
```json
{
  "utilisateurId": "usr_456",
  "email": "parent1@wlw.ma",
  "role": "PARENT",
  "statut": "INVITED",
  "invited": true,
  "emailSent": true
}
```

---

## 📊 MODES

### 🟢 DEV MODE (Actuellement)
- ✅ Emails affichés dans la console
- ✅ Pas d'envoi SMTP réel
- ✅ Parfait pour le développement

### 🔴 PROD MODE (À configurer)
- ✅ Emails envoyés via SMTP
- ✅ Nécessite les variables d'environnement:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `SMTP_FROM`

---

## 📝 VARIABLES D'ENVIRONNEMENT (PROD)

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@wlw.ma
APP_URL=https://creche.wlw.ma
```

---

## ✅ CHECKLIST

- [x] Service EmailService créé
- [x] Intégration dans UsersService
- [x] Génération mot de passe temporaire
- [x] Email HTML formaté
- [x] Mode DEV (console)
- [x] Mode PROD (SMTP)
- [x] Endpoints testés
- [x] Documentation créée

---

## 🎉 RÉSULTAT

Maintenant, quand vous créez un utilisateur:
1. ✅ L'utilisateur est créé dans la DB
2. ✅ Un mot de passe temporaire est généré
3. ✅ Un email d'invitation est envoyé
4. ✅ L'utilisateur reçoit ses identifiants
5. ✅ L'utilisateur peut se connecter

---

**🚀 PRÊT À TESTER!**

Bon développement! 🎉

