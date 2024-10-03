import express from 'express'
import rideRoutes from './routes/rideRoutes'

const app = express()

app.use(express.json())
app.use(rideRoutes)

app.listen(3000, () => {
    console.log('Server running on port 3000')
})

export default app
