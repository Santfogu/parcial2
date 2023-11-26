/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PerformerService } from './performer.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerformerEntity } from './performer.entity';
import { faker } from '@faker-js/faker';

describe('PerformerService', () => {
  let service: PerformerService;
  let repository: Repository<PerformerEntity>;
  let performersList: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[...TypeOrmTestingConfig()],
      providers: [PerformerService],
    }).compile();

    service = module.get<PerformerService>(PerformerService);
    repository = module.get<Repository<PerformerEntity>>(
    getRepositoryToken(PerformerEntity)
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    performersList = [];
    for(let i = 0; i < 5; i++){
        const performer: PerformerEntity = await repository.save({
        nombre: faker.person.firstName(), 
        imagen: faker.image.url(),
        descripcion: faker.lorem.sentence()})
        performersList.push(performer);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('se debe crear correctamente si la descripción tiene menos de 100 caracteres', async () => {
    const performer: PerformerEntity = await repository.save({
      nombre: faker.person.firstName(), 
      imagen: faker.image.url(),
      descripcion: "descripción"})
 
    const newPerformer: PerformerEntity = await service.create(performer);
    expect(newPerformer).not.toBeNull();
  });

  it('si la descripción tiene más de 100 caracteres debe generar error', async () => {
    const performer: PerformerEntity = {
      id: "",
      nombre: faker.person.firstName(), 
      imagen: faker.image.url(),
      descripcion: "01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
      albums: []
   }

    await expect(() => service.create(performer)).rejects.toHaveProperty("message", "La descripción no puede tener más de 100 caracteres")
  });

});