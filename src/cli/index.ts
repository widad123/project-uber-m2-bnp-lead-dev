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
import chalk from 'chalk'

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

                console.log(
                    chalk.green(
                        `✅ Ride booked successfully with ID: ${rideId}`
                    )
                )
            } catch (error: any) {
                console.error(chalk.red(`❌ ${error.message}`))
            }
        }
    )

program
    .command('cancel <rider_id> <rideId>')
    .description('Cancel a ride for a rider')
    .action(async (rider_id, rideId) => {
        try {
            const cancelRide = new CancelRide(rideRepository, riderRepository)
            await cancelRide.execute(rider_id, rideId)
            console.log(chalk.green(`✅ Ride ${rideId} has been cancelled`))
        } catch (error: any) {
            console.error(
                chalk.red(`❌ Error cancelling ride: ${error.message}`)
            )
        }
    })

program
    .command('history <rider_id>')
    .description('View ride history for a rider')
    .action(async (rider_id) => {
        try {
            const viewRideHistory = new ViewRideHistory(rideRepository)
            const history = await viewRideHistory.execute(rider_id)
            if (history.length === 0) {
                console.log(
                    chalk.yellow(
                        `⚠️ No ride history found for rider ID: ${rider_id}`
                    )
                )
            } else {
                console.log(
                    chalk.green(`📝 Ride history for rider ID: ${rider_id}`)
                )
                console.log(history)
            }
        } catch (error: any) {
            console.error(
                chalk.red(`❌ Error fetching ride history: ${error.message}`)
            )
        }
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

            console.log(
                chalk.green(
                    `✅ Rider created successfully with ID: ${rider_id}`
                )
            )
        } catch (error: any) {
            console.error(
                chalk.red(`❌ Error creating rider: ${error.message}`)
            )
        }
    })

program.parse(process.argv)
