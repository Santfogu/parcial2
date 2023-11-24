import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { PerformerModule } from './performer/performer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumPerformerModule } from './album-performer/album-performer.module';

@Module({
  imports: [AlbumModule, TrackModule, PerformerModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2',
      entities: [AlbumModule, TrackModule, PerformerModule],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    AlbumPerformerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
