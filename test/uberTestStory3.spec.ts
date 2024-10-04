import knex, { Knex } from 'knex'
import knexConfig from '../src/database/knexfile'
import { KnexRideRepository } from '../src/infrastructure/repositories/KnexRideRepository'
import { ViewRideHistory } from '../src/core/usecases/ViewRideHistory'
import { UuidGeneratorImpl } from '../src/utils/UuidGeneratorImpl'
import { DateProviderImpl } from '../src/utils/DateProviderImpl'

describe('ViewRideHistory Usecase', () => {
    let knexConnection: Knex
    let rideRepository: KnexRideRepository
    let viewRideHistory: ViewRideHistory
    let uuidGenerator: UuidGeneratorImpl
    let dateProvider: DateProviderImpl
    let specificRiderId: string

    beforeAll(async () => {
        knexConnection = knex(knexConfig.test)
        rideRepository = new KnexRideRepository(knexConnection)
        viewRideHistory = new ViewRideHistory(rideRepository)
        uuidGenerator = new UuidGeneratorImpl()
        dateProvider = new DateProviderImpl()

        specificRiderId = uuidGenerator.generate()
        const driverId1 = uuidGenerator.generate()
        const driverId2 = uuidGenerator.generate()

        const now = dateProvider.now()

        await knexConnection('riders').insert([
            {
                id: specificRiderId,
                name: 'John',
                balance: 50,
                birthday: '1990-01-01',
            },
        ])
        await knexConnection('drivers').insert([
            { id: driverId1, name: 'Jane' },
            { id: driverId2, name: 'Doe' },
        ])
        await knexConnection('rides').insert([
            {
                id: uuidGenerator.generate(),
                rider_id: specificRiderId,
                driver_id: driverId1,
                origin: 'Paris',
                destination: 'Paris',
                distance: '5.00',
                price: '10.00',
                status: 'confirmed',
                is_uberx: false,
                created_at: now,
                updated_at: now,
            },
            {
                id: uuidGenerator.generate(),
                rider_id: specificRiderId,
                driver_id: driverId2,
                origin: 'Paris',
                destination: 'Lyon',
                distance: '15.00',
                price: '20.00',
                status: 'cancelled',
                is_uberx: false,
                created_at: now,
                updated_at: now,
            },
        ])
    })

    afterAll(async () => {
        await knexConnection('rides').del()
        await knexConnection('drivers').del()
        await knexConnection('riders').del()
        await knexConnection.destroy()
    })

    test('should return the ride history with drivers for a given rider', async () => {
        const rideHistory = await viewRideHistory.execute(specificRiderId)

        expect(rideHistory).toEqual([
            {
                id: expect.any(String),
                rider_id: specificRiderId,
                driver_id: expect.any(String),
                origin: 'Paris',
                destination: 'Paris',
                distance: '5.00',
                price: '10.00',
                is_uberx: false,
                status: 'confirmed',
                driverName: 'Jane',
                created_at: expect.any(Date),
                updated_at: expect.any(Date),
            },
            {
                id: expect.any(String),
                rider_id: specificRiderId,
                driver_id: expect.any(String),
                origin: 'Paris',
                destination: 'Lyon',
                distance: '15.00',
                price: '20.00',
                is_uberx: false,
                status: 'cancelled',
                driverName: 'Doe',
                created_at: expect.any(Date),
                updated_at: expect.any(Date),
            },
        ])
    })

    test('should return an empty list if the rider has no rides', async () => {
        const newRiderId = uuidGenerator.generate()
        await knexConnection('riders').insert([
            {
                id: newRiderId,
                name: 'Mark',
                balance: 50,
                birthday: '1995-02-02',
            },
        ])
        const rideHistory = await viewRideHistory.execute(newRiderId)
        expect(rideHistory).toEqual([])
    })
})
