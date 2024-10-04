import { RideRepository } from '../../core/gateways/RideRepository'
import { Ride } from '../../core/domain/models/Ride'

export class InMemoryRideRepository implements RideRepository {
    private rides: Ride[] = []

    async save(ride: Ride): Promise<void> {
        this.rides.push(ride)
    }

    async findById(rideId: string): Promise<Ride | null> {
        return this.rides.find((ride) => ride.id === rideId) || null
    }

    async findPendingRideByRider(riderId: string): Promise<Ride | null> {
        return (
            this.rides.find(
                (ride) => ride.riderId === riderId && ride.isPending()
            ) || null
        )
    }

    async update(ride: Ride): Promise<void> {
        const index = this.rides.findIndex((r) => r.id === ride.id)
        if (index !== -1) {
            this.rides[index] = ride
        }
    }

    async findRideHistoryByRider(riderId: string): Promise<any[]> {
        return this.rides
            .filter((ride) => ride.riderId === riderId)
            .map((ride) => ({
                ...ride,
                driverName: ride.driverId ? `Driver ${ride.driverId}` : null,
            }))
    }
}
