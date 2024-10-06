import { Knex } from 'knex'
import { Ride } from '../../core/domain/models/Ride'
import { RideRepository } from '../../core/gateways/RideRepository'

export class KnexRideRepository implements RideRepository {
    constructor(private knex: Knex) {}

    async save(ride: Ride): Promise<void> {
        await this.knex('rides').insert(ride)
    }

    async findById(rideId: string): Promise<Ride | null> {
        const rideData = await this.knex('rides').where('id', rideId).first()

        return rideData
            ? new Ride(
                  rideData.id,
                  rideData.rider_id,
                  rideData.driver_id,
                  rideData.origin,
                  rideData.destination,
                  rideData.distance,
                  rideData.price,
                  rideData.is_uberx,
                  rideData.status
              )
            : null
    }

    async findPendingRideByRider(rider_id: string): Promise<Ride | null> {
        const rideData = await this.knex('rides')
            .where(function () {
                this.where({ rider_id, status: 'pending' }).orWhere({
                    rider_id,
                    status: 'confirmed',
                })
            })
            .first()

        if (rideData && rideData.rider_id && rideData.status) {
            return new Ride(
                rideData.id,
                rideData.rider_id,
                rideData.driver_id,
                rideData.origin,
                rideData.destination,
                rideData.distance,
                rideData.price,
                rideData.is_uberx,
                rideData.status
            )
        }

        return null
    }

    async findRideHistoryByRider(rider_id: string): Promise<Ride[]> {
        const rides = await this.knex('rides')
            .select('rides.*', 'drivers.name as driverName')
            .leftJoin('drivers', 'rides.driver_id', 'drivers.id')
            .where('rides.rider_id', rider_id)

        return rides
    }

    async update(ride: Ride): Promise<void> {
        await this.knex('rides').where({ id: ride.id }).update({
            status: ride.status,
            updated_at: new Date(),
        })
    }
}
