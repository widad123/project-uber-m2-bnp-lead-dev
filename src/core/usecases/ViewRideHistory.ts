import { RideRepository } from '../gateways/RideRepository'

export class ViewRideHistory {
    constructor(private rideRepository: RideRepository) {}

    async execute(rider_id: string): Promise<any[]> {
        const rideHistory =
            await this.rideRepository.findRideHistoryByRider(rider_id)
        return rideHistory
    }
}
