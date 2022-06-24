import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const testAccount = await prisma.users.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: {
      email: 'test@test.com',
      givenName: 'test',
      familyName: 'account',
      subId: 'test_sub_id',
      accessToken: 'test_ac_token',
      photo: 'test_photo_url',
    },
  });

  console.log({ testAccount });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
