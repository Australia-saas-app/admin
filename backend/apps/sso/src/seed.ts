import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, AccountType, UserStatus } from './entities/user.entity';
import { Repository } from 'typeorm';

async function bootstrap() {
  console.log('Bootstrapping Application to seed Superadmin...');
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));

  const email = 'superadmin@systemdb.com';
  let user = await userRepository.findOne({ where: { email } });

  if (user) {
    console.log(`User ${email} already exists. Updating password...`);
    user.password = 'Superadmin@123';
    // Let BeforeUpdate hook hash the password
  } else {
    console.log(`Creating new user ${email}...`);
    user = userRepository.create({
      email,
      password: 'Superadmin@123', // BeforeInsert hook will hash it
      accountType: AccountType.USER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      fullName: 'Super Admin',
      phone: '+10000000000',
      phoneVerified: true,
    });
  }

  await userRepository.save(user);
  console.log('Superadmin seeded successfully!');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Error seeding superadmin:', err);
  process.exit(1);
});
