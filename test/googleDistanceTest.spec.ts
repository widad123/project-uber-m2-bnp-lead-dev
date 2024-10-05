import { GoogleDistance } from '../src/core/usecases/GoogleDistance'

describe('GoogleDistanceService', () => {
    let googleDistance: GoogleDistance

    beforeAll(() => {
        googleDistance = new GoogleDistance()
    })

    test('should return the distance between two locations', async () => {
        const distance = await googleDistance.getDistance('Paris', 'Lyon')
        expect(distance).toBeGreaterThan(0)
    })

    test('should return the city from an address', async () => {
        const city = await googleDistance.getCityFromAddress(
            '1600 Amphitheatre Parkway, Mountain View, CA'
        )
        expect(city).toBe('Mountain View')
    })
})
