# 📧 CONFIGURATION MAILTRAP - RECEVOIR LES EMAILS

## 🎯 OBJECTIF

Configurer **Mailtrap** pour **recevoir les vrais emails** d'invitation envoyés par votre API.

---

## 📋 ÉTAPES

### 1️⃣ CRÉER UN COMPTE MAILTRAP

1. Allez sur: https://mailtrap.io
2. Cliquez sur **"Sign Up"**
3. Créez un compte avec votre email
4. Confirmez votre email

---

### 2️⃣ CRÉER UN PROJET

1. Connectez-vous à Mailtrap
2. Cliquez sur **"Create Project"**
3. Nommez-le: `Creche WLW`
4. Cliquez sur **"Create"**

---

### 3️⃣ OBTENIR LES IDENTIFIANTS SMTP

1. Ouvrez votre projet
2. Cliquez sur **"Integrations"** → **"SMTP"**
3. Vous verrez:
   ```
   Host: live.smtp.mailtrap.io
   Port: 587
   Username: api
   Password: 1234567890abcdef
   ```

---

### 4️⃣ METTRE À JOUR LE .env

Remplacez les valeurs dans `creche-api/.env`:

```env
# ========== EMAIL (MAILTRAP - TESTING) ==========
SMTP_HOST=live.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=api
SMTP_PASS=1234567890abcdef
SMTP_FROM=noreply@wlw.ma
APP_URL=http://localhost:3000
```

**⚠️ IMPORTANT:** Remplacez `api` et `1234567890abcdef` par vos vraies identifiants!

---

### 5️⃣ REDÉMARRER LE SERVEUR

```bash
cd creche-api
pnpm start:dev
```

---

### 6️⃣ TESTER L'ENVOI D'EMAIL

#### 1. LOGIN ADMIN
```
POST http://localhost:3000/api/auth/login
Body: { "email": "admin@wlw.ma", "password": "change_me" }
```

#### 2. CRÉER ENSEIGNANT
```
POST http://localhost:3000/api/admin/users
Authorization: Bearer {{accessToken}}
Body: {
  "email": "teacher1@wlw.ma",
  "prenom": "Ahmed",
  "nom": "Bennani",
  "role": "ENSEIGNANT",
  "telephone": "+212612345678"
}
```

#### 3. VÉRIFIER MAILTRAP

1. Allez sur: https://mailtrap.io
2. Ouvrez votre projet
3. Cliquez sur **"Inbox"**
4. Vous verrez l'email reçu! ✅

---

## 📧 EMAIL REÇU

Vous verrez:
- ✅ **From:** noreply@wlw.ma
- ✅ **To:** teacher1@wlw.ma
- ✅ **Subject:** Invitation - Crèche WLW - ENSEIGNANT
- ✅ **Body:** Email HTML avec identifiants

---

## 🔐 IDENTIFIANTS DANS L'EMAIL

L'email contient:
- ✅ Email: `teacher1@wlw.ma`
- ✅ Mot de passe temporaire: `aB3$cD9@eF2!`
- ✅ Lien de connexion
- ✅ Instructions

---

## 🟢 MODE PRODUCTION

Pour la production, utilisez un vrai service SMTP:
- **Gmail SMTP**
- **SendGrid**
- **Mailgun**
- **AWS SES**
- **Brevo (Sendinblue)**

---

## 📝 VARIABLES D'ENVIRONNEMENT

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

- [ ] Compte Mailtrap créé
- [ ] Projet créé
- [ ] Identifiants SMTP obtenus
- [ ] .env mis à jour
- [ ] Serveur redémarré
- [ ] Email de test envoyé
- [ ] Email reçu dans Mailtrap

---

## 🎉 RÉSULTAT

Maintenant, quand vous créez un utilisateur:
1. ✅ L'utilisateur est créé dans la DB
2. ✅ Un mot de passe temporaire est généré
3. ✅ Un email d'invitation est envoyé
4. ✅ L'utilisateur reçoit ses identifiants
5. ✅ L'email est visible dans Mailtrap

---

**🚀 PRÊT À TESTER!**

Bon développement! 🎉

