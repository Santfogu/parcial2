import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TrackEntity } from './track.entity';
import { AlbumEntity } from 'src/album/album.entity';

@Injectable()
export class TrackService {
    constructor(
        @InjectRepository(TrackEntity)
        private readonly trackRepository: Repository<TrackEntity>,
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>
    ){}
    
    async create(albumId: string, track: TrackEntity): Promise<TrackEntity> {
        if (track.duracion < 0)
            throw new BusinessLogicException("La duración debe ser un número positivo", BusinessError.PRECONDITION_FAILED);
        const album: AlbumEntity = await this.albumRepository.findOne({ where: { id: albumId } });
        if (!album) {
            throw new BusinessLogicException("No se pudo encontrar el álbum que se quiere asociar", BusinessError.NOT_FOUND);
        }
        track.album = album
        return await this.trackRepository.save(track);
    }

    async findOne(id: string): Promise<TrackEntity> {
        const track: TrackEntity = await this.trackRepository.findOne({where: {id}, relations: [] } );
        if (!track)
          throw new BusinessLogicException("The track with the given id was not found", BusinessError.NOT_FOUND);
        return track;
    }

    async findAll(): Promise<TrackEntity[]> {
        return await this.trackRepository.find({ relations: [] });
    }

}
