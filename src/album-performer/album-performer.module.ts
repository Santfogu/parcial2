import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumPerformerService } from './album-performer.service';
import { AlbumEntity } from 'src/album/album.entity';
import { PerformerEntity } from 'src/performer/performer.entity';

@Module({
  providers: [AlbumPerformerService],
  imports: [TypeOrmModule.forFeature([AlbumEntity, PerformerEntity])],
})
export class AlbumPerformerModule {}
