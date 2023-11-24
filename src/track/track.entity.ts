import { AlbumEntity } from 'src/album/album.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class TrackEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    duracion: number;

    @ManyToOne(() => AlbumEntity, album => album.tracks)
    album: AlbumEntity;
}
