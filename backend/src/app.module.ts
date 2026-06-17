import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DownloadModule } from './download/download.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    DownloadModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute en ms
        limit: 3, // 3 requêtes max par minute
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
