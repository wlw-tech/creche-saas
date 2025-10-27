import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Inscriptions (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let classeId: string = '';  // Initialiser avec une valeur par défaut

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Appliquer le ValidationPipe global
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    // Appliquer le préfixe global comme dans main.ts
    app.setGlobalPrefix('api');

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Récupérer une classe active pour les tests
    const classe = await prisma.classe.findFirst({
      where: { active: true },
    });

    if (!classe) {
      throw new Error('Aucune classe active trouvée. Exécutez le seed.');
    }

    classeId = classe.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /public/inscriptions', () => {
    it('should create an inscription with valid data (happy path)', async () => {
      const payload = {
        famille: {
          emailPrincipal: `test-${Date.now()}@example.com`,
          languePreferee: 'fr',
          adresseFacturation: '123 Rue Test, Casablanca',
        },
        tuteurs: [
          {
            lien: 'Mere',
            prenom: 'Amina',
            nom: 'Test',
            email: `mere-${Date.now()}@example.com`,
            telephone: '+2126000000',
            principal: true,
          },
          {
            lien: 'Pere',
            prenom: 'Youssef',
            nom: 'Test',
            email: `pere-${Date.now()}@example.com`,
            telephone: '+2126000001',
            principal: false,
          },
        ],
        enfant: {
          prenom: 'Nour',
          nom: 'Test',
          dateNaissance: '2021-05-10',
          genre: 'F',
        },
        classeIdSouhaitee: classeId,
        consentements: {
          photo: true,
          sortie: true,
        },
        commentaire: 'Allergie légère aux œufs.',
      };

      const response = await request(app.getHttpServer())
        .post('/api/public/inscriptions')
        .send(payload)
        .expect(201);

      expect(response.body).toHaveProperty('applicationId');
      expect(response.body).toHaveProperty('statut');
      expect(response.body.statut).toBe('Candidature');
      expect(response.body.applicationId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );

      // Vérifier que l'inscription a été créée en base
      const inscription = await prisma.inscription.findUnique({
        where: { id: response.body.applicationId },
        include: { enfant: true, classe: true },
      });

      expect(inscription).toBeDefined();
      expect(inscription?.statut).toBe('Candidature');
      expect(inscription?.enfant.prenom).toBe('Nour');
      expect(inscription?.classe.id).toBe(classeId);
    });

    it('should return 400 when classe does not exist', async () => {
      const payload = {
        famille: {
          emailPrincipal: `test-invalid-${Date.now()}@example.com`,
          languePreferee: 'fr',
        },
        tuteurs: [
          {
            lien: 'Mere',
            prenom: 'Test',
            nom: 'Test',
            principal: true,
          },
        ],
        enfant: {
          prenom: 'Test',
          nom: 'Test',
          dateNaissance: '2021-05-10',
        },
        classeIdSouhaitee: 'ffffffff-ffff-ffff-ffff-ffffffffffff',  // UUID valide mais inexistant
      };

      const response = await request(app.getHttpServer())
        .post('/api/public/inscriptions')
        .send(payload);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('non trouvée');
    });

    it('should return 400 when classe is inactive', async () => {
      // Créer une classe inactive
      const inactiveClasse = await prisma.classe.create({
        data: {
          nom: 'Classe Inactive Test',
          capacite: 10,
          trancheAge: '2-3 ans',
          active: false,
        },
      });

      const payload = {
        famille: {
          emailPrincipal: `test-inactive-${Date.now()}@example.com`,
          languePreferee: 'fr',
        },
        tuteurs: [
          {
            lien: 'Mere',
            prenom: 'Test',
            nom: 'Test',
            principal: true,
          },
        ],
        enfant: {
          prenom: 'Test',
          nom: 'Test',
          dateNaissance: '2021-05-10',
        },
        classeIdSouhaitee: inactiveClasse.id,
      };

      const response = await request(app.getHttpServer())
        .post('/api/public/inscriptions')
        .send(payload)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('n\'est pas disponible');

      // Cleanup
      await prisma.classe.delete({ where: { id: inactiveClasse.id } });
    });

    it('should return 400 when email is invalid', async () => {
      const payload = {
        famille: {
          emailPrincipal: 'not-an-email',
          languePreferee: 'fr',
        },
        tuteurs: [
          {
            lien: 'Mere',
            prenom: 'Test',
            nom: 'Test',
            principal: true,
          },
        ],
        enfant: {
          prenom: 'Test',
          nom: 'Test',
          dateNaissance: '2021-05-10',
        },
        classeIdSouhaitee: classeId,
      };

      const response = await request(app.getHttpServer())
        .post('/api/public/inscriptions')
        .send(payload)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should upsert famille on duplicate email', async () => {
      const email = `test-upsert-${Date.now()}@example.com`;

      // Première inscription
      const payload1 = {
        famille: {
          emailPrincipal: email,
          languePreferee: 'fr',
          adresseFacturation: 'Adresse 1',
        },
        tuteurs: [
          {
            lien: 'Mere',
            prenom: 'Amina',
            nom: 'Test',
            principal: true,
          },
        ],
        enfant: {
          prenom: 'Enfant1',
          nom: 'Test',
          dateNaissance: '2021-05-10',
        },
        classeIdSouhaitee: classeId,
      };

      const response1 = await request(app.getHttpServer())
        .post('/api/public/inscriptions')
        .send(payload1)
        .expect(201);

      // Deuxième inscription avec même email
      const payload2 = {
        famille: {
          emailPrincipal: email,
          languePreferee: 'ar',
          adresseFacturation: 'Adresse 2',
        },
        tuteurs: [
          {
            lien: 'Pere',
            prenom: 'Youssef',
            nom: 'Test',
            principal: true,
          },
        ],
        enfant: {
          prenom: 'Enfant2',
          nom: 'Test',
          dateNaissance: '2021-06-15',
        },
        classeIdSouhaitee: classeId,
      };

      const response2 = await request(app.getHttpServer())
        .post('/api/public/inscriptions')
        .send(payload2)
        .expect(201);

      // Vérifier que la famille a été mise à jour (upsert)
      const famille = await prisma.famille.findUnique({
        where: { emailPrincipal: email },
        include: { enfants: true },
      });

      expect(famille).toBeDefined();
      expect(famille?.languePreferee).toBe('ar');
      expect(famille?.adresseFacturation).toBe('Adresse 2');
      expect(famille?.enfants.length).toBe(2); // 2 enfants créés
    });
  });
});

