import * as bcrypt from 'bcrypt';

import { PrismaClient } from '@prisma/client';
import { cloneDeep } from 'lodash';
import users from './seed-data/users';

const prisma = new PrismaClient();

async function main() {
  const encrypted_password = await bcrypt.hash('Test@123', 10);

  for await (const user of users) {
    const createAtts = cloneDeep(user);
    delete createAtts.id;
    await prisma.user.upsert({
      where: {
        id: user.id,
      },
      create: { ...createAtts, password: encrypted_password },
      update: { ...user, password: encrypted_password },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    await prisma.$disconnect();
  });
