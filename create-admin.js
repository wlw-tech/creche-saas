const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔍 Checking for admin user...');
    
    const admin = await prisma.utilisateur.findUnique({
      where: { email: 'admin@wlw.ma' }
    });
    
    if (admin) {
      console.log('✅ Admin user already exists:', admin);
      return;
    }
    
    console.log('👤 Creating admin user...');
    const created = await prisma.utilisateur.create({
      data: {
        email: 'admin@wlw.ma',
        prenom: 'Admin',
        nom: 'System',
        role: 'ADMIN',
        statut: 'ACTIVE',
        activeLe: new Date(),
      }
    });
    
    console.log('✅ Admin user created successfully:', created);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();

