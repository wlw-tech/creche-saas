// prisma/seed.ts
import { PrismaClient, StatutInscription, LienTuteur, Langue } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed: start');

  try {
    // 1) Classes
    console.log('📚 Creating classes...');
    const petiteSection = await prisma.classe.upsert({
      where: { id: '00000000-0000-0000-0000-000000000001' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000001',
        nom: 'Petite Section',
        capacite: 20,
        trancheAge: '3-4 ans',
        active: true,
      },
    });

    const moyenneSection = await prisma.classe.upsert({
      where: { id: '00000000-0000-0000-0000-000000000002' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000002',
        nom: 'Moyenne Section',
        capacite: 22,
        trancheAge: '4-5 ans',
        active: true,
      },
    });

    console.log('✅ Classes created');

    // 2) Familles + Tuteurs + Enfants (2 familles, 4 enfants)
    console.log('👨‍👩‍👧‍👦 Creating families...');
    const familleA = await prisma.famille.upsert({
      where: { emailPrincipal: 'famille.a@example.com' },
      update: {},
      create: {
        emailPrincipal: 'famille.a@example.com',
        languePreferee: Langue.fr,
        adresseFacturation: '12 Rue des Jasmins, Casablanca',
        tuteurs: {
          create: [
            {
              lien: LienTuteur.Mere,
              principal: true,
              email: 'mere.a@example.com',
              telephone: '+212600000001',
            },
            {
              lien: LienTuteur.Pere,
              principal: false,
              email: 'pere.a@example.com',
              telephone: '+212600000002',
            },
          ],
        },
        enfants: {
          create: [
            {
              prenom: 'Sara',
              nom: 'Alaoui',
              dateNaissance: new Date('2021-11-05'),
              genre: 'F',
              photoUrl: null,
            },
            {
              prenom: 'Yassine',
              nom: 'Alaoui',
              dateNaissance: new Date('2020-04-18'),
              genre: 'M',
              photoUrl: null,
            },
          ],
        },
      },
      include: { enfants: true },
    });

    const familleB = await prisma.famille.upsert({
      where: { emailPrincipal: 'famille.b@example.com' },
      update: {},
      create: {
        emailPrincipal: 'famille.b@example.com',
        languePreferee: Langue.fr,
        adresseFacturation: '7 Avenue Zerktouni, Marrakech',
        tuteurs: {
          create: [
            {
              lien: LienTuteur.Mere,
              principal: true,
              email: 'mere.b@example.com',
              telephone: '+212600000003',
            },
          ],
        },
        enfants: {
          create: [
            {
              prenom: 'Aya',
              nom: 'Bennani',
              dateNaissance: new Date('2020-09-02'),
              genre: 'F',
              photoUrl: null,
            },
            {
              prenom: 'Omar',
              nom: 'Bennani',
              dateNaissance: new Date('2019-12-26'),
              genre: 'M',
              photoUrl: null,
            },
          ],
        },
      },
      include: { enfants: true },
    });

    console.log('✅ Families created');

    // 3) Inscriptions (actives) : 2 enfants en Petite Section, 2 en Moyenne Section
    console.log('📝 Creating inscriptions...');
    const [sara, yassine] = familleA.enfants;
    const [aya, omar] = familleB.enfants;

    await prisma.inscription.create({
      data: {
        enfantId: sara.id,
        classeId: petiteSection.id,
        statut: StatutInscription.Actif,
        dateDebut: new Date('2024-09-01'),
      },
    });
    await prisma.inscription.create({
      data: {
        enfantId: yassine.id,
        classeId: moyenneSection.id,
        statut: StatutInscription.Actif,
        dateDebut: new Date('2024-09-01'),
      },
    });
    await prisma.inscription.create({
      data: {
        enfantId: aya.id,
        classeId: petiteSection.id,
        statut: StatutInscription.Actif,
        dateDebut: new Date('2024-09-01'),
      },
    });
    await prisma.inscription.create({
      data: {
        enfantId: omar.id,
        classeId: moyenneSection.id,
        statut: StatutInscription.Actif,
        dateDebut: new Date('2024-09-01'),
      },
    });

    console.log('✅ Inscriptions created');
    console.log('✅ Seed: done');
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
