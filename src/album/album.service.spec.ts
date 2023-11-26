/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';
import { faker } from '@faker-js/faker';

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let albumsList: AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(
    getRepositoryToken(AlbumEntity)
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    albumsList = [];
    for(let i = 0; i < 5; i++){
        const album: AlbumEntity = await repository.save({
        nombre: faker.word.verb(), 
        caratula: faker.image.url(), 
        descripcion: faker.lorem.sentence(), 
        fechaLanzamiento: faker.date.anytime()})
        albumsList.push(album);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('se debe crear correctamente si tiene nombre y descripción', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: "nombreÁlbum", 
      caratula: faker.image.url(), 
      descripcion: "descripcion", 
      fechaLanzamiento: faker.date.anytime(),
      tracks: [],
      performers: []
    }
 
    const newAlbum: AlbumEntity = await service.create(album);
    expect(newAlbum).not.toBeNull();
  });

  it('crear sin descripcion debe generar error', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: faker.word.verb(), 
      caratula: faker.image.url(), 
      descripcion: "", 
      fechaLanzamiento: faker.date.anytime(),
      tracks: [],
      performers: []
    }

    await expect(() => service.create(album)).rejects.toHaveProperty("message", "El nombre y la descripción no pueden estar vacías")
  });

  it('crear sin nombre debe generar error', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: "", 
      caratula: faker.image.url(), 
      descripcion: "descripción", 
      fechaLanzamiento: faker.date.anytime(),
      tracks: [],
      performers: []
    }

    await expect(() => service.create(album)).rejects.toHaveProperty("message", "El nombre y la descripción no pueden estar vacías")
  });


  it('eliminar sin tracks debe funcionar correctamente', async () => {
    const album: AlbumEntity = albumsList[0];
    await service.delete(album.id);
     const deletedAlbum: AlbumEntity = await repository.findOne({ where: { id: album.id } })
    expect(deletedAlbum).toBeNull();
  });

});