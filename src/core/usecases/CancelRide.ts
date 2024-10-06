import { RideRepository } from '../gateways/RideRepository'
import { RiderRepository } from '../gateways/RiderRepository'
import { Rider } from '../domain/models/Rider'

export class CancelRide {
    constructor(
        private rideRepository: RideRepository,
        private riderRepository: RiderRepository
    ) {}

    async execute(rider_id: string, rideId: string): Promise<void> {
        const ride = await this.rideRepository.findById(rideId)
        if (!ride) {
            throw new Error('Ride not found.')
        }

        if (ride.rider_id !== rider_id) {
            throw new Error('This ride does not belong to the rider.')
        }

        if (ride.status === 'cancelled') {
            throw new Error('Ride has already been cancelled.')
        }

        const rider = await this.riderRepository.findById(rider_id)
        if (!rider) {
            throw new Error('Rider not found.')
        }

        if (this.isRiderBirthday(rider)) {
            ride.cancelRide()
        } else {
            if (ride.status === 'confirmed') {
                if (!rider.hasSufficientFunds(5)) {
                    throw new Error(
                        'Insufficient funds to cancel the ride with penalty.'
                    )
                }
                rider.balance -= 5
            }
            ride.cancelRide()
        }

        await this.rideRepository.update(ride)
    }

    private isRiderBirthday(rider: Rider): boolean {
        const today = new Date()
        return (
            rider.birthday.getDate() === today.getDate() &&
            rider.birthday.getMonth() === today.getMonth()
        )
    }
}
