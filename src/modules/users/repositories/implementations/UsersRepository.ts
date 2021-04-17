import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne({ where: { id: user_id }, relations: ["games"] }) as User;

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const users = await this.repository.query('SELECT * FROM users ORDER BY first_name ASC')
    
    return users;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return await this.repository.query(`SELECT email, first_name, last_name FROM users WHERE LOWER(users.first_name) LIKE LOWER('%${first_name}%') AND LOWER(users.last_name) LIKE LOWER('%${last_name}%')`); // Complete usando raw query
  }
}
