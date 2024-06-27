import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  type Relation,
  Index,
} from "typeorm";

import { Profile } from "./Profile";
import { Post } from "./Post";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column()
  @Index()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts: Relation<Post[]>;

  @OneToOne("Profile", "user", { cascade: true })
  @JoinColumn()
  profile: Profile;
}
