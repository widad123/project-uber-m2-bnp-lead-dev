import { Knex } from 'knex'
import { Ride } from '../../core/domain/models/Ride'
import { RideRepository } from '../../core/gateways/RideRepository'

export class KnexRideRepository implements RideRepository {
    constructor(private knex: Knex) {}

    async save(ride: Ride): Promise<void> {
        await this.knex('rides').insert(ride)
    }

    async findById(rideId: string): Promise<Ride | null> {
        const ride = await this.knex('rides').where('id', rideId).first()
        return ride || null
    }

    async findPendingRideByRider(riderId: string): Promise<Ride | null> {
        const ride = await this.knex('rides')
            .where({ riderId, status: 'pending' })
            .first()
        return ride || null
    }

    async findRideHistoryByRider(riderId: string): Promise<any[]> {
        const rides = await this.knex('rides')
            .select('rides.*', 'drivers.name as driverName')
            .leftJoin('drivers', 'rides.driver_id', 'drivers.id')
            .where('rides.rider_id', riderId)

        return rides
    }
}
