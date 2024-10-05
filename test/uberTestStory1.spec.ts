import { InMemoryRideRepository } from '../src/infrastructure/repositories/InMemoryRideRepository'
import { InMemoryRiderRepository } from '../src/infrastructure/repositories/InMemoryRiderRepository'
import { InMemoryDriverRepository } from '../src/infrastructure/repositories/InMemoryDriverRepository'
import { BookRide } from '../src/core/usecases/BookRide'
import { PriceCalculator } from '../src/core/usecases/PriceCalculator'
import { Rider } from '../src/core/domain/models/Rider'
import { Driver } from '../src/core/domain/models/Driver'
import { Ride } from '../src/core/domain/models/Ride'
import { GoogleDistance } from '../src/core/usecases/GoogleDistance'

describe('BookRide Usecase', () => {
    let rideRepository: InMemoryRideRepository
    let riderRepository: InMemoryRiderRepository
    let driverRepository: InMemoryDriverRepository
    let googleDistance: GoogleDistance
    let priceCalculator: PriceCalculator
    let bookRide: BookRide

    beforeEach(() => {
        rideRepository = new InMemoryRideRepository()
        riderRepository = new InMemoryRiderRepository()
        driverRepository = new InMemoryDriverRepository()
        googleDistance = new GoogleDistance()
        priceCalculator = new PriceCalculator(2)
        bookRide = new BookRide(
            rideRepository,
            riderRepository,
            driverRepository,
            priceCalculator,
            googleDistance
        )
    })

    test('should throw an error if rider has insufficient funds', async () => {
        const rider = new Rider('1', 'John', 1, new Date('1990-01-01'))
        riderRepository.addRider(rider)

        const driver = new Driver('2', 'Jane', true)
        driverRepository.addDriver(driver)

        await expect(
            bookRide.execute('1', 'Paris', 'Paris', true, false)
        ).rejects.toThrow('Insufficient funds for the total price')
    })

    test('should throw an error if no driver is available', async () => {
        const rider = new Rider('1', 'John', 100, new Date('1990-01-01'))
        riderRepository.addRider(rider)

        await expect(
            bookRide.execute('1', 'Paris', 'Paris', false, false)
        ).rejects.toThrow('No available drivers')
    })

    test('should throw an error if rider has a pending ride', async () => {
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

        await expect(
            bookRide.execute('1', 'Paris', 'Paris', false, false)
        ).rejects.toThrow(
            'You have an active ride, cancel it before booking a new one.'
        )
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

        expect(rideId).toBeDefined()
    })
})
