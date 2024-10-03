import knex from 'knex'
import knexConfig from '../database/knexfile'
import { Rider } from '../entities/Rider'

const db = knex(knexConfig.development)

export class RiderRepository {
    async getRiderById(id: string): Promise<Rider | null> {
        return db('riders').where({ id }).first()
    }
}
