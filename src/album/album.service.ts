import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AlbumEntity } from './album.entity';

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>
    ){}
    
    async create(album: AlbumEntity): Promise<AlbumEntity> {
        if (!album.nombre || !album.descripcion)
            throw new BusinessLogicException("El nombre y la descripción no pueden estar vacías", BusinessError.PRECONDITION_FAILED);
        return await this.albumRepository.save(album);
    }

    async findOne(id: string): Promise<AlbumEntity> {
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id}, relations: ["performers", "tracks"] } );
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
    
        return album;
    }

    async findAll(): Promise<AlbumEntity[]> {
        return await this.albumRepository.find({ relations: ["performers", "tracks"] });
    }

    async delete(id: string) {
        const album: AlbumEntity = await this.albumRepository.findOne({where:{id}});
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
        if (album.tracks.length > 0)
          throw new BusinessLogicException("Un album no puede ser eliminado si tiene tracks asociados", BusinessError.BAD_REQUEST);
      
        await this.albumRepository.remove(album);
    }
}
