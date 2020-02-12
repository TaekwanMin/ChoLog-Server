import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from "typeorm";
import Plant from "./Plant";
import { user } from "../@types/entity/index.d";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;
  //! 타입스크립트는 생성자에서 모든 속성을 선언해야 하는 strict class checking이 포함되어 있음.
  //! 그래서 username: string이라고만 하면
  //! 'no initializer and is not definitely assigned in the constructor'라는 에러가 뜸.
  //! 위 에러를 무시하려면 username!: string이라고 느낌표를 붙여서 사용하면 됨.

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  image!: string;

  @Column({ unique: true, nullable: true })
  snsId!: string;

  @Column({ default: "local" })
  provider!: string;

  @Column({ type: "tinyint", default: 1 })
  commentAllow!: number; // (댓글) 0: 비공개, 1: 친구공개, 2: 전체공개

  @Column({ type: "tinyint", default: 1 })
  open!: number; // 0: 비공개, 1: 친구공개, 2: 전체공개

  @Column({ default: 0 })
  reports!: number; // 경고 횟수

  @Column({ type: "timestamp", default: null, nullable: true })
  banned!: Date; // Date까지 계정 정지

  @Column({ default: 0 })
  seed!: number; // 앱 내 재화

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  public createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  public updatedAt!: Date;

  @OneToMany(
    (type) => Plant,
    (plant) => plant.user,
    { cascade: true },
  )
  plants!: Plant[];

  @ManyToMany((type) => User, { cascade: false })
  @JoinTable({ name: "friends" })
  friends!: User[];

  //* Email로 유저찾는 메서드
  static findByEmail(email: string): Promise<User | undefined> {
    console.log({ email });
    return this.createQueryBuilder("user")
      .where("user.email = :email", { email })
      .getOne();
  }

  private static findUserById(id: number) {
    return this.createQueryBuilder("user").where("user.id = :id", { id });
  }

  //* user id 로 유저찾기
  static findById(id: number): Promise<User | undefined> {
    return this.findUserById(id).getOne();
  }

  //* user id 로 plants 찾기
  static async findPlantsById(id: number): Promise<Plant[] | undefined> {
    const target = await this.findById(id);

    if (target === undefined) {
      return undefined;
    }
    return target.plants;
  }

  //* user id 로 user 정보 수정 (되는지 안되는지 해봐야 함)
  static modifyById(id: number, data: user) {
    return this.createQueryBuilder()
      .update(User)
      .set(data)
      .where("id = :id", { id })
      .execute();
  }

  static createUser(
    id: number,
    email: string,
    username: string,
    password: string,
  ) {
    return this.createQueryBuilder()
      .insert()
      .into(User)
      .values({ id, email, username, password })
      .execute();
  }
}
