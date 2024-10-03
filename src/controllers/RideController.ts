import { RideService } from '../services/RideService'

export class RideController {
    private rideService: RideService

    constructor() {
        this.rideService = new RideService()
    }
}
