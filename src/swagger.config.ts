import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('🏫 Crèche SaaS API - Documentation Complète')
    .setDescription(
      `
      API complète pour la gestion d'une crèche avec:
      - 👥 Gestion des utilisateurs (Admin, Enseignants, Parents)
      - 📚 Gestion des classes
      - 👶 Gestion des enfants et présences
      - 🍽️ Gestion des menus
      - 📝 Résumés quotidiens
      - 📅 Événements et calendrier
      
      **Authentification**:
      - Admin: email: admin@wlw.ma, password: change_me
      - Utilisateurs: email + mot de passe temporaire
      
      **Rôles**:
      - ADMIN: Accès complet
      - ENSEIGNANT: Gestion des classes assignées
      - PARENT: Accès aux enfants et infos publiques
      `,
    )
    .setVersion('1.0.0')
    .setContact(
      'Support',
      'https://github.com/wlw-tech/creche-saas',
      'support@creche-saas.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtenu après login',
      },
      'bearer',
    )
    .addTag('🔐 Auth', 'Endpoints d\'authentification')
    .addTag('👥 Admin/Users', 'Gestion des utilisateurs (Admin)')
    .addTag('⚙️ Admin/Classes', 'Gestion des classes (Admin)')
    .addTag('📍 Presences', 'Gestion des présences')
    .addTag('🍽️ Menus', 'Gestion des menus')
    .addTag('📝 Daily-Resumes', 'Résumés quotidiens des enfants')
    .addTag('👨‍👩‍👧 Parent', 'Endpoints pour les parents')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  console.log('✅ Swagger documentation available at http://localhost:3000/api/docs');
}

