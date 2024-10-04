import { InMemoryRideRepository } from '../src/infrastructure/repositories/InMemoryRideRepository'
import { InMemoryRiderRepository } from '../src/infrastructure/repositories/InMemoryRiderRepository'
import { CancelRide } from '../src/core/usecases/CancelRide'
import { Ride } from '../src/core/domain/models/Ride'
import { Rider } from '../src/core/domain/models/Rider'

describe('CancelRide Usecase', () => {
    let rideRepository: InMemoryRideRepository
    let riderRepository: InMemoryRiderRepository
    let cancelRide: CancelRide

    beforeEach(() => {
        rideRepository = new InMemoryRideRepository()
        riderRepository = new InMemoryRiderRepository()
        cancelRide = new CancelRide(rideRepository, riderRepository)
    })

    test('should throw an error if the ride is already cancelled', async () => {
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

        await expect(cancelRide.execute('1', 'ride_1')).rejects.toThrow(
            'Ride has already been cancelled.'
        )
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

        await cancelRide.execute('1', 'ride_1')

        const updatedRide = await rideRepository.findById('ride_1')
        expect(updatedRide?.status).toBe('cancelled')
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

        await cancelRide.execute('1', 'ride_1')

        const updatedRide = await rideRepository.findById('ride_1')
        expect(updatedRide?.status).toBe('cancelled')
        expect(rider.balance).toBe(45)
    })

    test('should throw an error if rider does not have enough funds to pay the penalty', async () => {
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

        await expect(cancelRide.execute('1', 'ride_1')).rejects.toThrow(
            'Insufficient funds to cancel the ride with penalty.'
        )
    })
})
