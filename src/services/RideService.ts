import { RideRepository } from '../repositories/RideRepository'

export class RideService {
    private rideRepository: RideRepository

    constructor() {
        this.rideRepository = new RideRepository()
    }
}
