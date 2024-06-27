import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinTable,
  ManyToMany,
  type Relation,
  Index,
} from "typeorm";

import { User } from "./User";
import { Category } from "./Category";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User)
  user: Relation<User>;

  @ManyToMany(() => Category, (category) => category.posts, { cascade: true })
  @JoinTable()
  categories: Relation<Category[]>;
}
