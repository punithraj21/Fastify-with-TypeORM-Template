import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  type Relation,
  Index,
} from "typeorm";

import { User } from "./User";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bio: string;

  @Column({ nullable: true })
  @Index()
  avatar: string;

  @OneToOne("User", "profile")
  user: Relation<User>;
}
