import { Test, TestingModule } from '@nestjs/testing';
import { PerformerEntity } from '../performer/performer.entity';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumPerformerService } from './album-performer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AlbumPerformerService', () => {
  let service: AlbumPerformerService;
  let albumRepository: Repository<AlbumEntity>;
  let performerRepository: Repository<PerformerEntity>;
  let album: AlbumEntity;
  let performersList : PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumPerformerService],
    }).compile();

    service = module.get<AlbumPerformerService>(AlbumPerformerService);
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    performerRepository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    performerRepository.clear();
    albumRepository.clear();

    performersList = [];
    for(let i = 0; i < 2; i++){
        const performer: PerformerEntity = await performerRepository.save({
          nombre: faker.person.firstName(), 
          imagen: faker.image.url(),
          descripcion: faker.lorem.sentence(),
        })
        performersList.push(performer);
    }

    album = await albumRepository.save({
      nombre: faker.word.verb(), 
      caratula: faker.image.url(), 
      descripcion: faker.lorem.sentence(), 
      fechaLanzamiento: faker.date.anytime(), 
      performers: performersList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPerformerToAlbum debería agregar un performer a un album', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      nombre: faker.person.firstName(), 
      imagen: faker.image.url(),
      descripcion: faker.lorem.sentence()
    });

    const result: AlbumEntity = await service.addPerformerToAlbum(album.id, newPerformer.id);
    
    expect(result.performers.length).toBe(3);
    expect(result.performers[2]).not.toBeNull();
    expect(result.performers[2].nombre).toBe(newPerformer.nombre)
    expect(result.performers[2].imagen).toBe(newPerformer.imagen)
    expect(result.performers[2].descripcion).toBe(newPerformer.descripcion)
  });

  it('addPerformerToAlbum debería dar error si ya hay 3 performers asociados', async () => {
    const newPerformer1: PerformerEntity = await performerRepository.save({
      nombre: faker.person.firstName(), 
      imagen: faker.image.url(),
      descripcion: faker.lorem.sentence()
    });
    const newPerformer2: PerformerEntity = await performerRepository.save({
      nombre: faker.person.firstName(), 
      imagen: faker.image.url(),
      descripcion: faker.lorem.sentence()
    });
    const result: AlbumEntity = await service.addPerformerToAlbum(album.id, newPerformer1.id);
    
    await expect(() => service.addPerformerToAlbum(album.id, newPerformer2.id)).rejects.toHaveProperty("message", "Un álbum no puede tener más de tres performers asociados")
   });
});
