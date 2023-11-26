/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TrackService } from './track.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackEntity } from './track.entity';
import { faker } from '@faker-js/faker';
import { AlbumEntity } from '../album/album.entity';

describe('TrackService', () => {
  let service: TrackService;
  let repository: Repository<TrackEntity>;
  let albumRepository: Repository<AlbumEntity>;
  let tracksList: TrackEntity[];
  let album: AlbumEntity

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[...TypeOrmTestingConfig()],
      providers: [TrackService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    repository = module.get<Repository<TrackEntity>>(
    getRepositoryToken(TrackEntity)
    );
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tracksList = [];
    for(let i = 0; i < 5; i++){
        const track: TrackEntity = await repository.save({
        nombre: faker.company.name(),
        duracion: faker.number.int({min: 1})})
        tracksList.push(track);
    }
    album = await albumRepository.save({
      nombre: faker.word.verb(), 
      caratula: faker.image.url(), 
      descripcion: faker.lorem.sentence(), 
      fechaLanzamiento: faker.date.anytime()
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('se debe crear correctamente si la duración es positiva', async () => {
    const track: TrackEntity = {
      id: "",
      nombre: faker.company.name(),
      duracion: 1,
      album: null}
 
    const newTrack: TrackEntity = await service.create(album.id, track);
    expect(newTrack).not.toBeNull();
  });

  it('crear con duración negativa debe generar error', async () => {
    const track: TrackEntity = {
      id: "",
      nombre: faker.company.name(),
      duracion: -2,
      album: null
   }

    await expect(() => service.create(album.id, track)).rejects.toHaveProperty("message", "La duración debe ser un número positivo")
  });

  it('se debe crear correctamente si el album existe', async () => {
    const track: TrackEntity = {
      id: "",
      nombre: faker.company.name(),
      duracion: 1,
      album: null
    }

   const newTrack: TrackEntity = await service.create(album.id, track);
   expect(newTrack).not.toBeNull();
  });

  it('si el album no existe debe generar error', async () => {
    const track: TrackEntity = {
      id: "",
      nombre: faker.company.name(),
      duracion: 1,
      album: null
    }

    await expect(() => service.create("0", track)).rejects.toHaveProperty("message", "No se pudo encontrar el álbum que se quiere asociar")
  });
});