const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
(async()=>{const password=await bcrypt.hash('Admin12345!',12);await prisma.utilisateur.upsert({where:{email:'admin@ecomer.cg'},update:{},create:{nom:'Administrateur ECOMER',email:'admin@ecomer.cg',password,role:'admin',administrateur:{create:{}}}});console.log('Compte admin créé : admin@ecomer.cg / Admin12345!');})().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect());
