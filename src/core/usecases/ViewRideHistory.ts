import { RideRepository } from '../gateways/RideRepository'

export class ViewRideHistory {
    constructor(private rideRepository: RideRepository) {}

    async execute(riderId: string): Promise<any[]> {
        const rideHistory =
            await this.rideRepository.findRideHistoryByRider(riderId)
        return rideHistory
    }
}
