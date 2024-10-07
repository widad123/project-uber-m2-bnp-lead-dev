import { InMemoryRideRepository } from '../src/infrastructure/repositories/InMemoryRideRepository'
import { InMemoryRiderRepository } from '../src/infrastructure/repositories/InMemoryRiderRepository'
import { InMemoryDriverRepository } from '../src/infrastructure/repositories/InMemoryDriverRepository'
import { BookRide } from '../src/core/usecases/BookRide'
import { PriceCalculator } from '../src/core/usecases/PriceCalculator'
import { Rider } from '../src/core/domain/models/Rider'
import { Driver } from '../src/core/domain/models/Driver'
import { Ride } from '../src/core/domain/models/Ride'
import { GoogleDistance } from '../src/core/usecases/GoogleDistance'
import { UuidGeneratorImpl } from '../src/utils/UuidGeneratorImpl'
import chalk from 'chalk'

describe('BookRide Usecase', () => {
    let rideRepository: InMemoryRideRepository
    let riderRepository: InMemoryRiderRepository
    let driverRepository: InMemoryDriverRepository
    let googleDistance: GoogleDistance
    let priceCalculator: PriceCalculator
    let bookRide: BookRide
    let uuidGenerator: UuidGeneratorImpl

    beforeEach(() => {
        rideRepository = new InMemoryRideRepository()
        riderRepository = new InMemoryRiderRepository()
        driverRepository = new InMemoryDriverRepository()
        googleDistance = new GoogleDistance()
        priceCalculator = new PriceCalculator(2)
        uuidGenerator = new UuidGeneratorImpl()
        bookRide = new BookRide(
            rideRepository,
            riderRepository,
            driverRepository,
            priceCalculator,
            googleDistance,
            uuidGenerator
        )
    })

    test('should return an error message if rider has insufficient funds', async () => {
        const rider = new Rider('1', 'John', 1, new Date('1990-01-01'))
        riderRepository.addRider(rider)

        const driver = new Driver('2', 'Jane', true)
        driverRepository.addDriver(driver)

        try {
            await bookRide.execute('1', 'Paris', 'Paris', true, false)
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe(
                    'Insufficient funds for the total price.'
                )
            }
        }
    })

    test('should return an error message if no driver is available', async () => {
        const rider = new Rider('1', 'John', 100, new Date('1990-01-01'))
        riderRepository.addRider(rider)

        try {
            await bookRide.execute('1', 'Paris', 'Paris', false, false)
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe('No available drivers.')
            }
        }
    })

    test('should return an error message if rider has a pending ride', async () => {
        const rider = new Rider('1', 'John', 100, new Date('1990-01-01'))
        riderRepository.addRider(rider)

        const driver = new Driver('2', 'Jane', true)
        driverRepository.addDriver(driver)

        const ride = new Ride(
            'ride_1',
            '1',
            '2',
            'Paris',
            'Paris',
            10,
            5,
            false,
            'pending'
        )
        await rideRepository.save(ride)

        try {
            await bookRide.execute('1', 'Paris', 'Paris', false, false)
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).toBe(
                    'You have an active ride, cancel it before booking a new one.'
                )
            }
        }
    })

    test('should book a ride successfully', async () => {
        const rider = new Rider('1', 'John', 100, new Date('1990-01-01'))
        riderRepository.addRider(rider)

        const driver = new Driver('2', 'Jane', true)
        driverRepository.addDriver(driver)

        const rideId = await bookRide.execute(
            '1',
            'Paris',
            'Paris',
            false,
            false
        )

        const expectedMessage = `✅ Ride booked successfully with ID: ${rideId}`

        expect(expectedMessage).toBe(expectedMessage)
    })
})
