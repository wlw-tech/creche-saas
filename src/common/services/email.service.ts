import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

/**
 * Service pour envoyer des emails
 * En DEV, affiche les emails dans la console
 * En PROD, utilise un service SMTP réel
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: any;
  private isDev: boolean;

  constructor(private configService: ConfigService) {
    this.isDev = this.configService.get('NODE_ENV') !== 'production';
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (this.isDev) {
      // En DEV, utiliser Ethereal Email (service de test gratuit)
      this.logger.log('📧 Mode DEV: Emails affichés dans la console');
      return;
    }

    // En PROD, utiliser les variables d'environnement
    const smtpHost = this.configService.get('SMTP_HOST');
    const smtpPort = this.configService.get('SMTP_PORT');
    const smtpUser = this.configService.get('SMTP_USER');
    const smtpPass = this.configService.get('SMTP_PASS');

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: true,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      this.logger.log('📧 Service SMTP configuré');
    }
  }

  /**
   * Envoyer un email d'invitation à un enseignant/parent
   */
  async sendInvitationEmail(
    email: string,
    prenom: string,
    nom: string,
    role: string,
    tempPassword: string,
  ): Promise<boolean> {
    try {
      const subject = `Invitation - Crèche WLW - ${role}`;
      const html = this.generateInvitationHtml(
        prenom,
        nom,
        role,
        email,
        tempPassword,
      );

      if (this.isDev) {
        // En DEV, afficher dans la console
        this.logger.log('📧 EMAIL D\'INVITATION (DEV MODE)');
        this.logger.log(`To: ${email}`);
        this.logger.log(`Subject: ${subject}`);
        this.logger.log('---');
        this.logger.log(html);
        this.logger.log('---');
        return true;
      }

      // En PROD, envoyer l'email
      if (!this.transporter) {
        this.logger.warn('⚠️ Service SMTP non configuré');
        return false;
      }

      await this.transporter.sendMail({
        from: this.configService.get('SMTP_FROM') || 'noreply@wlw.ma',
        to: email,
        subject,
        html,
      });

      this.logger.log(`✅ Email d'invitation envoyé à ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Erreur envoi email: ${error.message}`);
      return false;
    }
  }

  /**
   * Générer le HTML de l'email d'invitation
   */
  private generateInvitationHtml(
    prenom: string,
    nom: string,
    role: string,
    email: string,
    tempPassword: string,
  ): string {
    const loginUrl = `${this.configService.get('APP_URL') || 'http://localhost:3000'}/login`;

    return `
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
      <p>Bonjour <strong>${prenom} ${nom}</strong>,</p>

      <p>Vous avez été invité(e) en tant que <strong>${role}</strong> sur la plateforme Crèche WLW.</p>

      <p>Veuillez utiliser les identifiants ci-dessous pour vous connecter:</p>

      <div class="credentials">
        <p><span class="label">📧 Email:</span> ${email}</p>
        <p><span class="label">🔐 Mot de passe temporaire:</span> <code>${tempPassword}</code></p>
      </div>

      <p>⚠️ <strong>Important:</strong> Veuillez changer votre mot de passe lors de votre première connexion.</p>

      <a href="${loginUrl}" class="button">Se connecter</a>

      <p>Si vous avez des questions, veuillez contacter l'administrateur.</p>
    </div>

    <div class="footer">
      <p>© 2024 Crèche WLW. Tous droits réservés.</p>
      <p>Cet email a été envoyé automatiquement. Veuillez ne pas répondre.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Envoyer un email de notification
   */
  async sendNotificationEmail(
    email: string,
    subject: string,
    message: string,
  ): Promise<boolean> {
    try {
      if (this.isDev) {
        this.logger.log(`📧 NOTIFICATION (DEV MODE)`);
        this.logger.log(`To: ${email}`);
        this.logger.log(`Subject: ${subject}`);
        this.logger.log(`Message: ${message}`);
        return true;
      }

      if (!this.transporter) {
        this.logger.warn('⚠️ Service SMTP non configuré');
        return false;
      }

      await this.transporter.sendMail({
        from: this.configService.get('SMTP_FROM') || 'noreply@wlw.ma',
        to: email,
        subject,
        text: message,
      });

      return true;
    } catch (error) {
      this.logger.error(`❌ Erreur envoi notification: ${error.message}`);
      return false;
    }
  }
}

