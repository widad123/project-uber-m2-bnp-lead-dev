import { RideRepository } from '../gateways/RideRepository'
import { RiderRepository } from '../gateways/RiderRepository'
import { Rider } from '../domain/models/Rider'
import chalk from 'chalk'

export class CancelRide {
    constructor(
        private rideRepository: RideRepository,
        private riderRepository: RiderRepository
    ) {}

    async execute(
        rider_id: string,
        rideId: string
    ): Promise<{ message: string }> {
        const ride = await this.rideRepository.findById(rideId)
        if (!ride) {
            return { message: chalk.red('❌ Ride not found.') }
        }

        if (ride.rider_id !== rider_id) {
            return {
                message: chalk.red(
                    '❌ This ride does not belong to the rider.'
                ),
            }
        }

        if (ride.status === 'cancelled') {
            return {
                message: chalk.yellow('⚠️ Ride has already been cancelled.'),
            }
        }

        const rider = await this.riderRepository.findById(rider_id)
        if (!rider) {
            return { message: chalk.red('❌ Rider not found.') }
        }

        if (this.isRiderBirthday(rider)) {
            ride.cancelRide()
        } else {
            if (ride.status === 'confirmed') {
                if (!rider.hasSufficientFunds(5)) {
                    return {
                        message: chalk.red(
                            '❌ Insufficient funds to cancel the ride with penalty.'
                        ),
                    }
                }
                rider.balance -= 5
            }
            ride.cancelRide()
        }

        await this.rideRepository.update(ride)
        return {
            message: chalk.green(
                `✅ Ride ${rideId} has been cancelled successfully.`
            ),
        }
    }

    private isRiderBirthday(rider: Rider): boolean {
        const today = new Date()
        return (
            rider.birthday.getDate() === today.getDate() &&
            rider.birthday.getMonth() === today.getMonth()
        )
    }
}
