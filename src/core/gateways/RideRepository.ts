import { Ride } from '../domain/models/Ride'

export interface RideRepository {
    save(ride: Ride): Promise<void>
    findById(rideId: string): Promise<Ride | null>
    findPendingRideByRider(riderId: string): Promise<Ride | null>
}
