import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder('games')
      .where("games.title ilike LOWER(:title)", { title: `%${param}%` })
      .getMany();

    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query('SELECT COUNT(*) FROM games'); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users = await this.repository // Complete usando query builder
      .createQueryBuilder('games')
      .relation(Game, 'users')
      .of(id)
      .loadMany();

    return users;            
  }
}
