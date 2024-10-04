import knex from 'knex'
import knexConfig from '../database/knexfile'
import { Rider } from '../entities/Rider'

const db = knex(knexConfig.development)

export class RiderRepository {
    async createRider(rider: Rider): Promise<Rider> {
        const riderData = {
            id: rider.id,
            name: rider.name,
            balance: rider.balance,
            birthday: rider.birthday,
        }

        try {
            await this.insertRiderIntoDatabase(riderData)
            const createdRider = await this.getRiderById(rider.id)
            if (!createdRider) {
                throw new Error(`Failed to create rider with ID ${rider.id}`)
            }
            return createdRider
        } catch (error) {
            console.error('Error creating rider:', error)
            throw error
        }
    }

    async getRiderById(riderId: string): Promise<Rider | null> {
        try {
            return await db('riders').where({ id: riderId }).first()
        } catch (error) {
            console.error('Error fetching rider by ID:', error)
            return null
        }
    }

    private async insertRiderIntoDatabase(
        riderData: Partial<Rider>
    ): Promise<void> {
        try {
            await db('riders').insert(riderData)
        } catch (error) {
            console.error('Error inserting rider into database:', error)
            throw error
        }
    }
}
