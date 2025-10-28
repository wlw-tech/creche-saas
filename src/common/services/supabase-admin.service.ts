import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service pour gérer les utilisateurs Supabase via Admin API
 * En DEV, les méthodes retournent des mocks
 * En PROD, elles utilisent l'API Supabase
 */
@Injectable()
export class SupabaseAdminService {
  private readonly logger = new Logger(SupabaseAdminService.name);
  private readonly isDev: boolean;
  private supabaseUrl: string;
  private supabaseServiceRole: string;

  constructor(private configService: ConfigService) {
    this.isDev = this.configService.get('NODE_ENV') !== 'production';
    this.supabaseUrl = this.configService.get('SUPABASE_URL') || '';
    this.supabaseServiceRole = this.configService.get('SUPABASE_SERVICE_ROLE') || '';
  }

  /**
   * Créer une invitation utilisateur dans Supabase
   * Envoie un lien magic link par email
   */
  async createUserInvite(email: string): Promise<{
    userId: string;
    email: string;
    invited: boolean;
  }> {
    if (this.isDev) {
      this.logger.debug(`[DEV] Mock: Invitation créée pour ${email}`);
      return {
        userId: `mock_${Date.now()}`,
        email,
        invited: true,
      };
    }

    try {
      // TODO: Implémenter l'appel API Supabase Admin
      // const response = await fetch(`${this.supabaseUrl}/auth/v1/invite`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.supabaseServiceRole}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email }),
      // });
      // const data = await response.json();
      // return { userId: data.id, email, invited: true };

      this.logger.warn('Supabase Admin API non configurée');
      return { userId: `temp_${Date.now()}`, email, invited: false };
    } catch (error) {
      this.logger.error(`Erreur création invitation: ${error.message}`);
      throw error;
    }
  }

  /**
   * Envoyer un lien de réinitialisation de mot de passe
   */
  async sendPasswordReset(email: string): Promise<boolean> {
    if (this.isDev) {
      this.logger.debug(`[DEV] Mock: Email de réinitialisation envoyé à ${email}`);
      return true;
    }

    try {
      // TODO: Implémenter l'appel API Supabase
      this.logger.warn('Supabase Admin API non configurée');
      return false;
    } catch (error) {
      this.logger.error(`Erreur envoi reset: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lier un utilisateur Supabase à un compte local
   */
  async linkMagicLink(email: string): Promise<string> {
    if (this.isDev) {
      this.logger.debug(`[DEV] Mock: Magic link généré pour ${email}`);
      return `http://localhost:3000/auth/callback?token=mock_${Date.now()}`;
    }

    try {
      // TODO: Implémenter la génération de magic link
      this.logger.warn('Magic link non configuré');
      return '';
    } catch (error) {
      this.logger.error(`Erreur magic link: ${error.message}`);
      throw error;
    }
  }

  /**
   * Vérifier si un utilisateur existe dans Supabase
   */
  async userExists(email: string): Promise<boolean> {
    if (this.isDev) {
      return false; // En DEV, on crée toujours
    }

    try {
      // TODO: Implémenter la vérification
      return false;
    } catch (error) {
      this.logger.error(`Erreur vérification utilisateur: ${error.message}`);
      return false;
    }
  }

  /**
   * Obtenir l'ID Supabase d'un utilisateur par email
   */
  async getUserIdByEmail(email: string): Promise<string | null> {
    if (this.isDev) {
      return null;
    }

    try {
      // TODO: Implémenter la recherche
      return null;
    } catch (error) {
      this.logger.error(`Erreur recherche utilisateur: ${error.message}`);
      return null;
    }
  }
}

