import { PerformerEntity } from 'src/performer/performer.entity';
import { TrackEntity } from 'src/track/track.entity';
import { Column, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export class AlbumEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    caratula: string;

    @Column()
    fechaLanzamiento: Date;

    @Column()
    descripcion: string;

    @OneToMany(() => TrackEntity, track => track.album)
    tracks: TrackEntity[];

    @ManyToMany(() => PerformerEntity, performer => performer.albums)
    @JoinTable()
    performers: PerformerEntity[];
}
