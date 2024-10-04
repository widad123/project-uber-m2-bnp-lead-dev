import knex from 'knex'
import knexConfig from '../database/knexfile'
import { Ride } from '../entities/Ride'
import { v4 as uuidv4 } from 'uuid'

const db = knex(knexConfig.development)

export class RideRepository {
    async createRide(ride: Ride): Promise<void> {
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

    async getRidesByRider(riderId: string): Promise<any[]> {
        return db('rides')
            .join('drivers', 'rides.driver_id', '=', 'drivers.id')
            .select(
                'rides.id',
                'rides.destination',
                'rides.price',
                'rides.date',
                'drivers.name as driver_name'
            )
            .where('rides.rider_id', riderId)
    }
}
