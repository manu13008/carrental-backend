import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Rend les variables d'environnement globales
    }),
     UserModule,
     AuthModule,
     MongooseModule.forRoot(process.env.MONGO_STRING_CONNECTION),
  ],

  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
