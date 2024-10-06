import express from 'express'
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

const app = express()
app.use(express.json())

const knexConnection = knex(knexConfig.development)

const rideRepository = new KnexRideRepository(knexConnection)
const riderRepository = new KnexRiderRepository(knexConnection)
const driverRepository = new KnexDriverRepository(knexConnection)
const googleDistance = new GoogleDistance()
const priceCalculator = new PriceCalculator()

app.post('/rides', async (req, res) => {
    const { rider_id, origin, destination, is_uberx, isChristmas } = req.body
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
    res.status(201).json({ rideId })
})

app.post('/rides/:rideId/cancel', async (req, res) => {
    const { rider_id } = req.body
    const { rideId } = req.params
    const cancelRide = new CancelRide(rideRepository, riderRepository)
    await cancelRide.execute(rider_id, rideId)
    res.status(200).json({ message: 'Ride cancelled' })
})

app.get('/rides/history/:rider_id', async (req, res) => {
    const { rider_id } = req.params
    const viewRideHistory = new ViewRideHistory(rideRepository)
    const history = await viewRideHistory.execute(rider_id)
    res.status(200).json(history)
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
