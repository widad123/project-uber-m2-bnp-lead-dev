import { Router } from 'express'
import { RideController } from '../controllers/RideController'

const router = Router()
const rideController = new RideController()

router.get('/riders/:id/rides', rideController.listRides.bind(rideController))
router.post('/riders/:id/rides', rideController.createRide.bind(rideController))

export default router
