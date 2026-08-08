import prisma from './src/prismaClient';

async function main() {
  const cars = await prisma.car.findMany();
  console.log(JSON.stringify(cars, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
