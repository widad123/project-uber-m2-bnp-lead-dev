import { Knex } from 'knex'
import { DriverRepository } from '../../core/gateways/DriverRepository'
import { Driver } from '../../core/domain/models/Driver'

export class KnexDriverRepository implements DriverRepository {
    private knex: Knex

    constructor(knex: Knex) {
        this.knex = knex
    }

    async findById(driver_id: string): Promise<Driver | null> {
        const driver = await this.knex('drivers')
            .where({ id: driver_id })
            .first()

        return driver
            ? new Driver(driver.id, driver.name, driver.is_available)
            : null
    }

    async findAvailableDriver(): Promise<Driver | null> {
        const driver = await this.knex('drivers')
            .where('is_available', true)
            .first()
        return driver
            ? new Driver(driver.id, driver.name, driver.is_available)
            : null
    }

    async save(driver: Driver): Promise<void> {
        await this.knex('drivers').insert({
            id: driver.id,
            name: driver.name,
            is_available: driver.is_available,
        })
    }

    async update(driver: Driver): Promise<void> {
        await this.knex('drivers').where({ id: driver.id }).update({
            name: driver.name,
            is_available: driver.is_available,
        })
    }
}
