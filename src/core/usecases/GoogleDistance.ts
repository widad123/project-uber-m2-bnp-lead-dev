import * as dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

export class GoogleDistance {
    private apiKey: string

    constructor() {
        this.apiKey = process.env.GOOGLE_API_KEY as string
    }

    async getDistance(origin: string, destination: string): Promise<number> {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
            origin
        )}&destinations=${encodeURIComponent(destination)}&key=${this.apiKey}`

        try {
            const response = await axios.get(url)
            const data = response.data
            const rows = data.rows

            if (
                rows &&
                rows[0] &&
                rows[0].elements &&
                rows[0].elements[0].status === 'OK'
            ) {
                const distanceInMeters = rows[0].elements[0].distance.value
                return distanceInMeters / 1000
            } else {
                throw new Error('Could not calculate the distance')
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(
                    `Error calling Google API: ${error.message}, URL: ${url}`
                )
            } else {
                throw new Error(
                    'An unknown error occurred while calling the Google API'
                )
            }
        }
    }

    async getCityFromAddress(address: string): Promise<string> {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
        )}&key=${this.apiKey}`

        try {
            const response = await axios.get(url)
            const data = response.data

            if (data.results.length > 0) {
                const addressComponents = data.results[0].address_components
                const cityComponent = addressComponents.find((component: any) =>
                    component.types.includes('locality')
                )
                return cityComponent ? cityComponent.long_name : 'Unknown city'
            } else {
                throw new Error('Could not find the city for the given address')
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(
                    `Error calling Google API: ${error.message}, URL: ${url}`
                )
            } else {
                throw new Error(
                    'An unknown error occurred while calling the Google API'
                )
            }
        }
    }
}
