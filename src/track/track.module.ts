import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackService } from './track.service';
import { TrackEntity } from './track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrackEntity])],
  providers: [TrackService]
})
export class TrackModule {}
