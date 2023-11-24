import { AlbumEntity } from 'src/album/album.entity';
import { Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export class PerformerEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    imagen: string;

    @Column()
    descripcion: string;

    @ManyToMany(() => AlbumEntity, album => album.performers)
    albums: AlbumEntity[];
}
