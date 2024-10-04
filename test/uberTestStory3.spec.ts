import { RideService } from '../src/services/RideService'
import { RideRepository } from '../src/repositories/RideRepository'
import { RiderRepository } from '../src/repositories/RiderRepository'
import { DriverRepository } from '../src/repositories/DriverRepository'
import { v4 as uuidv4 } from 'uuid'

describe('Rider Reservation - Listing Ride History', () => {
    let rideService: RideService
    let rideRepository: RideRepository
    let riderRepository: RiderRepository
    let driverRepository: DriverRepository

    beforeEach(() => {
        rideRepository = new RideRepository()
        riderRepository = new RiderRepository()
        driverRepository = new DriverRepository()
        rideService = new RideService(
            rideRepository,
            riderRepository,
            driverRepository
        )
    })

    test('should return all rides for a rider with driver information', async () => {
        const riderId = uuidv4()
        const driverId = uuidv4()

        await riderRepository.createRider({
            id: riderId,
            name: 'John',
            balance: 100,
            birthday: new Date('1989-10-03'),
            activeReservation: null,
        })

        await driverRepository.createDriver({
            id: driverId,
            name: 'Driver1',
            available: true,
            isOnTheWay: false,
        })

        await rideService.createRide(
            riderId,
            'Paris',
            12.5,
            false,
            false,
            false
        )
        await rideService.createRide(riderId, 'Lyon', 50, false, false, false)

        const rides = await rideRepository.getRidesByRider(riderId)

        expect(rides.length).toBe(2)
        expect(rides[0]).toHaveProperty('driver_name', 'Driver1')
        expect(rides[1]).toHaveProperty('driver_name', 'Driver1')
    })

    test('should return an empty list if the rider has no rides', async () => {
        const riderId = uuidv4()
        await riderRepository.createRider({
            id: riderId,
            name: 'John',
            balance: 100,
            birthday: new Date('1990-01-01'),
            activeReservation: null,
        })

        const rides = await rideRepository.getRidesByRider(riderId)

        expect(rides).toEqual([])
    })
})
