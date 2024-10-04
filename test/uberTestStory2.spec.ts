import { RideService } from '../src/services/RideService'
import { RiderRepository } from '../src/repositories/RiderRepository'
import { DriverRepository } from '../src/repositories/DriverRepository'
import { v4 as uuidv4 } from 'uuid'
import { RideRepository } from '../src/repositories/RideRepository'

describe('Rider Reservation - Cancellation', () => {
    let rideService: RideService
    let riderRepository: RiderRepository
    let driverRepository: DriverRepository

    beforeEach(() => {
        riderRepository = new RiderRepository()
        driverRepository = new DriverRepository()
        rideService = new RideService(
            new RideRepository(),
            riderRepository,
            driverRepository
        )
    })

    test('should allow a rider to cancel the reservation for free on their birthday', async () => {
        const today = new Date()
        const rider = {
            id: uuidv4(),
            name: 'John',
            balance: 100,
            birthday: today,
            activeReservation: null,
        }

        await riderRepository.createRider(rider)

        const ride = await rideService.createRide(
            rider.id,
            'Paris',
            10,
            false,
            false,
            false
        )
        const cancellationMessage = ride.cancel()

        expect(cancellationMessage).toBe(
            "Cancellation is free because it's your birthday!"
        )
        expect(ride.isCanceled).toBe(true)
    })

    test('should penalize the rider 5 euros if the driver is already on the way', async () => {
        const rider = {
            id: uuidv4(),
            name: 'John',
            balance: 100,
            birthday: new Date('1989-10-01'),
            activeReservation: null,
        }

        await riderRepository.createRider(rider)
        const ride = await rideService.createRide(
            rider.id,
            'Paris',
            10,
            false,
            false,
            false
        )

        const driver = {
            id: uuidv4(),
            name: 'Driver1',
            available: true,
            isOnTheWay: true,
        }

        ride.assignDriver(driver)

        const cancellationMessage = ride.cancel()

        const updatedRider = await riderRepository.getRiderById(rider.id)

        expect(cancellationMessage).toBe('Reservation canceled.')
        expect(updatedRider?.balance).toBe(95)
        expect(ride.isCanceled).toBe(true)
    })

    test('should allow a rider to cancel the reservation without penalty if the driver is not assigned', async () => {
        const rider = {
            id: uuidv4(),
            name: 'John',
            balance: 100,
            birthday: new Date('1989-10-01'),
            activeReservation: null,
        }

        await riderRepository.createRider(rider)
        const ride = await rideService.createRide(
            rider.id,
            'Paris',
            10,
            false,
            false,
            false
        )

        const cancellationMessage = ride.cancel()

        expect(cancellationMessage).toBe('Reservation canceled.')
        expect(rider.balance).toBe(100)
        expect(ride.isCanceled).toBe(true)
    })

    test('should allow a rider to cancel the reservation without penalty if the driver is assigned but not yet on the way', async () => {
        const rider = {
            id: uuidv4(),
            name: 'John',
            balance: 100,
            birthday: new Date('1989-10-01'),
            activeReservation: null,
        }

        await riderRepository.createRider(rider)
        const ride = await rideService.createRide(
            rider.id,
            'Paris',
            10,
            false,
            false,
            false
        )

        const driver = {
            id: uuidv4(),
            name: 'Driver1',
            available: true,
            isOnTheWay: false,
        }

        ride.assignDriver(driver)

        const cancellationMessage = ride.cancel()

        expect(cancellationMessage).toBe('Reservation canceled.')
        expect(rider.balance).toBe(100)
        expect(ride.isCanceled).toBe(true)
    })

    test('should prevent the rider from canceling a reservation that has already been canceled', async () => {
        const rider = {
            id: uuidv4(),
            name: 'John',
            balance: 100,
            birthday: new Date('1989-10-02'),
            activeReservation: null,
        }

        await riderRepository.createRider(rider)
        const ride = await rideService.createRide(
            rider.id,
            'Paris',
            10,
            false,
            false,
            false
        )
        ride.cancel()

        expect(() => {
            ride.cancel()
        }).toThrow('Reservation is already canceled.')
    })
})
