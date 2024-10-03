import knex from 'knex'
import knexConfig from '../database/knexfile'
import { Ride } from '../entities/Ride'
import { v4 as uuidv4 } from 'uuid'
import { Rider } from '../entities/Rider'
import { Driver } from '../entities/Driver'

const db = knex(knexConfig.development)

export class RideRepository {
    riders: { [key: string]: Rider }

    constructor() {
        this.riders = {}
    }

    async createRider(rider: Rider): Promise<void> {
        await db('riders').insert({
            id: rider.id,
            name: rider.name,
            balance: rider.balance,
            birthday: rider.birthday,
        })
    }

    async createDriver(driver: Driver): Promise<void> {
        await db('drivers').insert({
            id: driver.id,
            name: driver.name,
            available: driver.available,
            is_on_the_way: driver.isOnTheWay,
        })
    }

    async getRidesByRider(riderId: string): Promise<any[]> {
        return db('rides')
            .join('drivers', 'rides.driver_id', '=', 'drivers.id')
            .select(
                'rides.id',
                'rides.destination',
                'rides.price',
                'rides.date',
                'rides.distance',
                'drivers.name as driver_name'
            )
            .where('rides.rider_id', riderId)
    }

    async createRide(ride: Ride): Promise<void> {
        const riderExists = await db('riders')
            .where('id', ride.rider.id)
            .first()

        if (!riderExists) {
            throw new Error(`Rider with ID ${ride.rider.id} does not exist.`)
        }

        if (ride.driver) {
            const driverExists = await db('drivers')
                .where('id', ride.driver.id)
                .first()
            if (!driverExists) {
                throw new Error(
                    `Driver with ID ${ride.driver.id} does not exist.`
                )
            }
        }

        await db('rides').insert({
            id: uuidv4(),
            rider_id: ride.rider.id,
            driver_id: ride.driver?.id,
            destination: ride.destination,
            price: ride.price,
            distance: ride.distance,
            date: ride.date,
        })
    }
}
