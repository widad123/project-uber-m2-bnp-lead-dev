import { Ride } from '../entities/Ride'
import { RideRepository } from '../repositories/RideRepository'
import { RiderRepository } from '../repositories/RiderRepository'
import { DriverRepository } from '../repositories/DriverRepository'

export class RideService {
    constructor(
        private rideRepository: RideRepository,
        private riderRepository: RiderRepository,
        private driverRepository: DriverRepository
    ) {}

    async createRide(
        riderId: string,
        destination: string,
        distance: number,
        isUberX: boolean,
        isChristmas: boolean,
        isWelcomeOffer: boolean
    ): Promise<Ride> {
        const rider = await this.riderRepository.getRiderById(riderId)
        if (!rider) throw new Error('Rider does not exist')

        if (rider.balance < 2) {
            throw new Error('Insufficient balance for reservation.')
        }

        if (rider.activeReservation) {
            throw new Error(
                'Cannot make another reservation until the current one is canceled.'
            )
        }

        const ride = new Ride(rider, destination, distance)

        rider.activeReservation = ride

        const totalPrice = ride.calculatePrice(
            isUberX,
            isChristmas,
            isWelcomeOffer
        )
        ride.price = totalPrice

        await this.rideRepository.createRide(ride)

        return ride
    }

    async listRidesByRider(riderId: string) {
        return this.rideRepository.getRidesByRider(riderId)
    }
}
