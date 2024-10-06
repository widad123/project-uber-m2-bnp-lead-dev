import { Knex } from 'knex'
import { RiderRepository } from '../../core/gateways/RiderRepository' // Assurez-vous que cette interface existe
import { Rider } from '../../core/domain/models/Rider' // Modèle de Rider

export class KnexRiderRepository implements RiderRepository {
    private knex: Knex

    constructor(knex: Knex) {
        this.knex = knex
    }

    async findById(rider_id: string): Promise<Rider | null> {
        try {
            const riderData:
                | { id: string; name: string; balance: number; birthday: Date }
                | undefined = await this.knex('riders')
                .where({ id: rider_id })
                .first()

            return riderData
                ? new Rider(
                      riderData.id,
                      riderData.name,
                      riderData.balance,
                      riderData.birthday
                  )
                : null
        } catch (error) {
            console.error('Error fetching rider by ID:', error)
            return null
        }
    }

    async save(rider: Rider): Promise<void> {
        await this.knex('riders').insert({
            id: rider.id,
            name: rider.name,
            balance: rider.balance,
            birthday: rider.birthday,
        })
    }

    async update(rider: Rider): Promise<void> {
        await this.knex('riders').where({ id: rider.id }).update({
            name: rider.name,
            balance: rider.balance,
            birthday: rider.birthday,
        })
    }
}
