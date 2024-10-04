import knex from 'knex'
import knexConfig from '../database/knexfile'
import { Driver } from '../entities/Driver'

const db = knex(knexConfig.development)

export class DriverRepository {
    async createDriver(driver: Driver): Promise<Driver> {
        const driverData = {
            id: driver.id,
            name: driver.name,
            available: driver.available,
            is_on_the_way: driver.isOnTheWay,
        }

        try {
            await this.insertDriverIntoDatabase(driverData)
            const createdDriver = await this.getDriverById(driver.id)
            if (!createdDriver) {
                throw new Error(`Failed to create driver with ID ${driver.id}`)
            }
            return createdDriver
        } catch (error) {
            console.error('Error creating driver:', error)
            throw error
        }
    }

    async getDriverById(driverId: string): Promise<Driver | null> {
        try {
            return await db('drivers').where({ id: driverId }).first()
        } catch (error) {
            console.error('Error fetching driver by ID:', error)
            return null
        }
    }

    private async insertDriverIntoDatabase(
        driverData: Partial<Driver>
    ): Promise<void> {
        try {
            await db('drivers').insert(driverData)
        } catch (error) {
            console.error('Error inserting driver into database:', error)
            throw error
        }
    }
}
