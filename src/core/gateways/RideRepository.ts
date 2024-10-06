import { Ride } from '../domain/models/Ride'

export interface RideRepository {
    save(ride: Ride): Promise<void>
    findById(rideId: string): Promise<Ride | null>
    findPendingRideByRider(rider_id: string): Promise<Ride | null>
    findRideHistoryByRider(rider_id: string): Promise<Ride[]>
    update(ride: Ride): Promise<void>
}
