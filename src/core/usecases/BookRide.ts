import { RideRepository } from '../gateways/RideRepository'
import { RiderRepository } from '../gateways/RiderRepository'
import { DriverRepository } from '../gateways/DriverRepository'
import { PriceCalculator } from './PriceCalculator'
import { Ride } from '../domain/models/Ride'
import { GoogleDistance } from './GoogleDistance'
import { UuidGenerator } from '../../utils/UuidGenerator'

export class BookRide {
    constructor(
        private rideRepository: RideRepository,
        private riderRepository: RiderRepository,
        private driverRepository: DriverRepository,
        private priceCalculator: PriceCalculator,
        private googleDistance: GoogleDistance,
        private uuidGenerator: UuidGenerator
    ) {}

    async execute(
        rider_id: string,
        origin: string,
        destination: string,
        is_uberx: boolean,
        isChristmas: boolean
    ): Promise<string> {
        const rider = await this.riderRepository.findById(rider_id)
        if (!rider) {
            throw new Error('Rider not found.')
        }

        const existingRide =
            await this.rideRepository.findPendingRideByRider(rider_id)
        if (existingRide) {
            throw new Error(
                'You have an active ride, cancel it before booking a new one.'
            )
        }

        const availableDriver =
            await this.driverRepository.findAvailableDriver()
        if (!availableDriver) {
            throw new Error('No available drivers.')
        }

        const distance = await this.googleDistance.getDistance(
            origin,
            destination
        )

        const price = this.priceCalculator.calculatePrice(
            rider,
            origin,
            destination,
            distance,
            is_uberx,
            isChristmas
        )

        if (!rider.hasSufficientFunds(price)) {
            throw new Error('Insufficient funds for the total price.')
        }

        const rideId = this.uuidGenerator.generate()

        const ride = new Ride(
            rideId,
            rider_id,
            availableDriver.id,
            origin,
            destination,
            distance,
            price,
            is_uberx,
            'confirmed'
        )

        await this.rideRepository.save(ride)
        return ride.id
    }
}
