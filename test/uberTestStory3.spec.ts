import { RideRepository } from '../src/repositories/RideRepository'
import { v4 as uuidv4 } from 'uuid'
import { Ride } from '../src/entities/Ride'
import { Rider } from '../src/entities/Rider'
import { Driver } from '../src/entities/Driver'

describe('Rider Reservation - Listing Ride History', () => {
    let rideRepository: RideRepository

    beforeEach(() => {
        rideRepository = new RideRepository()
    })

    test('should return all rides for a rider with driver information', async () => {
        const rider: Rider = {
            id: uuidv4(),
            name: 'John',
            balance: 100,
            birthday: new Date('1990-01-01'),
            activeReservation: null,
        }

        await rideRepository.createRider(rider)

        const driver: Driver = {
            id: uuidv4(),
            name: 'Driver1',
            available: true,
            isOnTheWay: false,
        }

        await rideRepository.createDriver(driver)

        const ride1 = new Ride(rider, 'Paris', 12.5, new Date())
        ride1.assignDriver(driver)

        const ride2 = new Ride(rider, 'Lyon', 50, new Date())
        ride2.assignDriver(driver)

        await rideRepository.createRide(ride1)
        await rideRepository.createRide(ride2)

        const rides = await rideRepository.getRidesByRider(rider.id)

        expect(rides.length).toBe(2)
        expect(rides[0]).toHaveProperty('driver_name', 'Driver1')
        expect(rides[1]).toHaveProperty('driver_name', 'Driver1')
    })

    test('should return an empty list if the rider has no rides', async () => {
        const riderId = uuidv4()

        const rides = await rideRepository.getRidesByRider(riderId)

        expect(rides).toEqual([])
    })
})
