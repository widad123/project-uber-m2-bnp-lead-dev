import { Client, GatewayIntentBits } from 'discord.js'
import { BookRide } from '../core/usecases/BookRide'
import { CancelRide } from '../core/usecases/CancelRide'
import { ViewRideHistory } from '../core/usecases/ViewRideHistory'
import { GoogleDistance } from '../core/usecases/GoogleDistance'
import { KnexRideRepository } from '../infrastructure/repositories/KnexRideRepository'
import { KnexRiderRepository } from '../infrastructure/repositories/KnexRiderRepository'
import { KnexDriverRepository } from '../infrastructure/repositories/KnexDriverRepository'
import { PriceCalculator } from '../core/usecases/PriceCalculator'
import knex from 'knex'
import knexConfig from '../database/knexfile'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

const knexConnection = knex(knexConfig.development)

const rideRepository = new KnexRideRepository(knexConnection)
const riderRepository = new KnexRiderRepository(knexConnection)
const driverRepository = new KnexDriverRepository(knexConnection)
const googleDistance = new GoogleDistance()
const priceCalculator = new PriceCalculator()

client.once('ready', () => {
    console.log('Bot is online')
})

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!book')) {
        const [_, rider_id, origin, destination, is_uberxStr, isChristmasStr] =
            message.content.split(' ')

        const is_uberx = is_uberxStr === 'true'
        const isChristmas = isChristmasStr === 'true'

        try {
            const bookRide = new BookRide(
                rideRepository,
                riderRepository,
                driverRepository,
                priceCalculator,
                googleDistance
            )
            const rideId = await bookRide.execute(
                rider_id,
                origin,
                destination,
                is_uberx,
                isChristmas
            )
            message.reply(`Ride booked successfully with ID: ${rideId}`)
        } catch (error) {
            console.error(error)
            message.reply('Failed to book the ride. Please try again.')
        }
    } else if (message.content.startsWith('!cancel')) {
        const [_, rider_id, rideId] = message.content.split(' ')

        try {
            const cancelRide = new CancelRide(rideRepository, riderRepository)
            await cancelRide.execute(rider_id, rideId)
            message.reply(`Ride ${rideId} has been cancelled`)
        } catch (error) {
            console.error(error)
            message.reply('Failed to cancel the ride. Please try again.')
        }
    } else if (message.content.startsWith('!history')) {
        const [_, rider_id] = message.content.split(' ')

        try {
            const viewRideHistory = new ViewRideHistory(rideRepository)
            const history = await viewRideHistory.execute(rider_id)
            message.reply(`Ride history: ${JSON.stringify(history)}`)
        } catch (error) {
            console.error(error)
            message.reply('Failed to retrieve ride history. Please try again.')
        }
    }
})

client.login(process.env.DISCORD_BOT_TOKEN)
