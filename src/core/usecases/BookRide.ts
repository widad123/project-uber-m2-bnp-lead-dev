import { RideRepository } from '../gateways/RideRepository'
import { RiderRepository } from '../gateways/RiderRepository'
import { DriverRepository } from '../gateways/DriverRepository'
import { PriceCalculator } from './PriceCalculator'
import { Ride } from '../domain/models/Ride'

export class BookRide {
    constructor(
        private rideRepository: RideRepository,
        private riderRepository: RiderRepository,
        private driverRepository: DriverRepository,
        private priceCalculator: PriceCalculator
    ) {}

    async execute(
        riderId: string,
        origin: string,
        destination: string,
        distance: number,
        isUberX: boolean,
        isChristmas: boolean
    ): Promise<string> {
        const rider = await this.riderRepository.findById(riderId)
        if (!rider) {
            throw new Error('Rider not found.')
        }

        const existingRide =
            await this.rideRepository.findPendingRideByRider(riderId)
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

        const price = this.priceCalculator.calculatePrice(
            rider,
            origin,
            destination,
            distance,
            isUberX,
            isChristmas
        )
        console.log('Calculated price before reductions:', price)

        console.log('Total price:', price)
        console.log('Rider balance:', rider.balance)
        if (!rider.hasSufficientFunds(price)) {
            throw new Error('Insufficient funds for the total price')
        }

        const ride = new Ride(
            'ride_id',
            riderId,
            availableDriver.id,
            origin,
            destination,
            distance,
            price,
            isUberX,
            'confirmed'
        )

        await this.rideRepository.save(ride)
        return ride.id
    }
}
