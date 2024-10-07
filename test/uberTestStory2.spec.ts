import { InMemoryRideRepository } from '../src/infrastructure/repositories/InMemoryRideRepository'
import { InMemoryRiderRepository } from '../src/infrastructure/repositories/InMemoryRiderRepository'
import { CancelRide } from '../src/core/usecases/CancelRide'
import { Ride } from '../src/core/domain/models/Ride'
import { Rider } from '../src/core/domain/models/Rider'
import chalk from 'chalk'

describe('CancelRide Usecase', () => {
    let rideRepository: InMemoryRideRepository
    let riderRepository: InMemoryRiderRepository
    let cancelRide: CancelRide

    beforeEach(() => {
        rideRepository = new InMemoryRideRepository()
        riderRepository = new InMemoryRiderRepository()
        cancelRide = new CancelRide(rideRepository, riderRepository)
    })

    test('should return an error message if the ride is already cancelled', async () => {
        const rider = new Rider('1', 'John', 50, new Date('1990-01-01'))
        riderRepository.addRider(rider)

        const ride = new Ride(
            'ride_1',
            '1',
            null,
            'Paris',
            'Paris',
            10,
            12,
            false,
            'cancelled'
        )
        rideRepository.save(ride)

        const result = await cancelRide.execute('1', 'ride_1')
        expect(result).toEqual({
            message: chalk.yellow('⚠️ Ride has already been cancelled.'),
        })
    })

    test('should cancel the ride with no penalty if it is the rider’s birthday', async () => {
        const rider = new Rider('1', 'John', 50, new Date())
        riderRepository.addRider(rider)

        const ride = new Ride(
            'ride_1',
            '1',
            null,
            'Paris',
            'Paris',
            10,
            12,
            false,
            'confirmed'
        )
        rideRepository.save(ride)

        const result = await cancelRide.execute('1', 'ride_1')
        expect(result).toEqual({
            message: chalk.green(
                '✅ Ride ride_1 has been cancelled successfully.'
            ),
        })
        expect(rider.balance).toBe(50)
    })

    test('should apply a 5 euro penalty if the driver is en route', async () => {
        const rider = new Rider('1', 'John', 50, new Date('1990-01-01'))
        riderRepository.addRider(rider)

        const ride = new Ride(
            'ride_1',
            '1',
            'driver_1',
            'Paris',
            'Paris',
            10,
            12,
            false,
            'confirmed'
        )
        rideRepository.save(ride)

        const result = await cancelRide.execute('1', 'ride_1')
        expect(result).toEqual({
            message: chalk.green(
                '✅ Ride ride_1 has been cancelled successfully.'
            ),
        })
        expect(rider.balance).toBe(45)
    })

    test('should return an error message if rider does not have enough funds to pay the penalty', async () => {
        const rider = new Rider('1', 'John', 3, new Date('1990-01-01'))
        riderRepository.addRider(rider)

        const ride = new Ride(
            'ride_1',
            '1',
            'driver_1',
            'Paris',
            'Paris',
            10,
            12,
            false,
            'confirmed'
        )
        rideRepository.save(ride)

        const result = await cancelRide.execute('1', 'ride_1')
        expect(result).toEqual({
            message: chalk.red(
                '❌ Insufficient funds to cancel the ride with penalty.'
            ),
        })
    })
})
