import { RideService } from '../src/services/RideService'
import { RiderRepository } from '../src/repositories/RiderRepository'
import { DriverRepository } from '../src/repositories/DriverRepository'
import { RideRepository } from '../src/repositories/RideRepository'
import { v4 as uuidv4 } from 'uuid'

describe('Rider Reservation', () => {
    let rideService: RideService
    let riderRepository: RiderRepository
    let driverRepository: DriverRepository
    let rideRepository: RideRepository

    beforeEach(() => {
        riderRepository = new RiderRepository()
        driverRepository = new DriverRepository()
        rideRepository = new RideRepository()
        rideService = new RideService(
            rideRepository,
            riderRepository,
            driverRepository
        )
    })

    test('should allow a rider to make a reservation if they have enough balance and no active reservation', async () => {
        const riderId = uuidv4()
        const rider = {
            id: riderId,
            name: 'John',
            balance: 100,
            birthday: new Date('1989-10-03'),
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

        expect(rider.activeReservation).toBeNull()
        expect(ride.destination).toBe('Paris')
        expect(ride.isConfirmed()).toBe(false)
    })

    test('should prevent the rider from making a reservation if they have an active one', async () => {
        const riderId = uuidv4()
        const rider = {
            id: riderId,
            name: 'John',
            balance: 100,
            birthday: new Date('1989-10-03'),
            activeReservation: null,
        }

        await riderRepository.createRider(rider)
        await rideService.createRide(rider.id, 'Paris', 10, false, false, false)

        const updatedRider = await riderRepository.getRiderById(rider.id)
        expect(updatedRider?.activeReservation).not.toBeNull()

        await expect(async () => {
            await rideService.createRide(
                rider.id,
                'Paris',
                10,
                false,
                false,
                false
            )
        }).rejects.toThrow(
            'Cannot make another reservation until the current one is canceled.'
        )
    })

    test('should prevent the rider from making a reservation if their balance is too low', async () => {
        const riderId = uuidv4()
        const rider = {
            id: riderId,
            name: 'John',
            balance: 1,
            birthday: new Date('1989-10-03'),
            activeReservation: null,
        }

        await riderRepository.createRider(rider)

        await expect(async () => {
            await rideService.createRide(
                rider.id,
                'Paris',
                10,
                false,
                false,
                false
            )
        }).rejects.toThrow('Insufficient balance for reservation.')
    })

    test('should confirm the reservation only when a driver is assigned', async () => {
        const riderId = uuidv4()
        const rider = {
            id: riderId,
            name: 'John',
            balance: 100,
            birthday: new Date('1989-10-03'),
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

        expect(ride.isConfirmed()).toBe(false)

        const driver = {
            id: uuidv4(),
            name: 'Driver1',
            available: true,
            isOnTheWay: false,
        }

        ride.assignDriver(driver)

        expect(ride.isConfirmed()).toBe(true)
    })

    test('should allow a rider to make a new reservation only after canceling the previous one', async () => {
        const riderId = uuidv4()
        const rider = {
            id: riderId,
            name: 'John',
            balance: 100,
            birthday: new Date('1989-10-03'),
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

        await expect(async () => {
            await rideService.createRide(
                rider.id,
                'Paris',
                10,
                false,
                false,
                false
            )
        }).not.toThrow()
    })
})
