import prisma from './src/prismaClient';

async function main() {
  const cars = await prisma.car.findMany();
  for (const car of cars) {
    if (Array.isArray(car.images)) {
      const updatedImages = car.images.map((img: any) => {
        if (typeof img === 'string' && img.includes('/uploads/')) {
          // Extract filename from the end of the URL
          const parts = img.split('/');
          const filename = parts[parts.length - 1];
          return `/uploads/${filename}`;
        }
        return img;
      });
      
      await prisma.car.update({
        where: { id: car.id },
        data: { images: updatedImages }
      });
      console.log(`Updated car ${car.id}`);
    }
  }

  const users = await prisma.user.findMany({
    where: { avatarUrl: { contains: '/uploads/' } }
  });
  for (const user of users) {
    if (user.avatarUrl && user.avatarUrl.startsWith('http')) {
      const parts = user.avatarUrl.split('/');
      const filename = parts[parts.length - 1];
      const updatedAvatar = `/uploads/${filename}`;
      await prisma.user.update({
        where: { id: user.id },
        data: { avatarUrl: updatedAvatar }
      });
      console.log(`Updated user ${user.id} avatar`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
