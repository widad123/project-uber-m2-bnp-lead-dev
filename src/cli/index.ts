import { Command } from 'commander'
import { BookRide } from '../core/usecases/BookRide'
import { CancelRide } from '../core/usecases/CancelRide'
import { ViewRideHistory } from '../core/usecases/ViewRideHistory'
import { GoogleDistance } from '../core/usecases/GoogleDistance'
import { KnexRideRepository } from '../infrastructure/repositories/KnexRideRepository'
import { KnexRiderRepository } from '../infrastructure/repositories/KnexRiderRepository'
import { KnexDriverRepository } from '../infrastructure/repositories/KnexDriverRepository'
import { PriceCalculator } from '../core/usecases/PriceCalculator'
import { UuidGeneratorImpl } from '../utils/UuidGeneratorImpl'
import knex from 'knex'
import knexConfig from '../database/knexfile'
import { Rider } from '../core/domain/models/Rider'

const program = new Command()

const knexConnection = knex(knexConfig.development)

program
    .version('1.0.0')
    .description('Uber-like Application Command Line Interface')

const rideRepository = new KnexRideRepository(knexConnection)
const riderRepository = new KnexRiderRepository(knexConnection)
const driverRepository = new KnexDriverRepository(knexConnection)
const googleDistance = new GoogleDistance()
const priceCalculator = new PriceCalculator()
const uuidGenerator = new UuidGeneratorImpl()

program
    .command('book <rider_id> <origin> <destination> <is_uberx> [isChristmas]')
    .description('Book a ride for a rider')
    .action(
        async (
            rider_id,
            origin,
            destination,
            is_uberx,
            isChristmas = false
        ) => {
            const bookRide = new BookRide(
                rideRepository,
                riderRepository,
                driverRepository,
                priceCalculator,
                googleDistance,
                uuidGenerator
            )

            try {
                const rideId = await bookRide.execute(
                    rider_id,
                    origin,
                    destination,
                    is_uberx === 'true',
                    isChristmas === 'true'
                )

                console.log(`Ride booked successfully with ID: ${rideId}`)
            } catch (error: any) {
                if (error instanceof Error) {
                    console.error(`Error: ${error.message}`)
                    console.dir(error)
                } else if (typeof error === 'string') {
                    console.error(`Error: ${error}`)
                } else {
                    console.error('An unknown error occurred')
                    console.dir(error)
                }
            }
        }
    )

program
    .command('cancel <rider_id> <rideId>')
    .description('Cancel a ride for a rider')
    .action(async (rider_id, rideId) => {
        const cancelRide = new CancelRide(rideRepository, riderRepository)
        await cancelRide.execute(rider_id, rideId)
        console.log(`Ride ${rideId} has been cancelled`)
    })

program
    .command('history <rider_id>')
    .description('View ride history for a rider')
    .action(async (rider_id) => {
        const viewRideHistory = new ViewRideHistory(rideRepository)
        const history = await viewRideHistory.execute(rider_id)
        console.log(history)
    })

program
    .command('create-rider <name> <balance> <birthday>')
    .description('Create a new rider')
    .action(async (name, balance, birthday) => {
        try {
            const rider_id = uuidGenerator.generate()
            const rider = new Rider(
                rider_id,
                name,
                parseFloat(balance),
                new Date(birthday)
            )

            await riderRepository.save(rider)

            console.log(`Rider created successfully with ID: ${rider_id}`)
        } catch (error: any) {
            console.error(`Error creating rider: ${error.message}`)
        }
    })

program.parse(process.argv)
