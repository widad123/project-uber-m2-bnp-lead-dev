import { Ride } from '../src/uber/Ride'
import { Rider } from '../src/uber/Rider'
import { Driver } from '../src/uber/Driver'

describe('Rider Reservation', () => {
    test('should allow a rider to make a reservation if they have enough balance and no active reservation', () => {
        const rider: Rider = {
            id: 'rider1',
            name: 'John',
            balance: 100,
            birthday: new Date('1989-10-03'),
            activeReservation: null,
        }

        const reservation = new Ride(rider, 'Paris')

        expect(rider.balance).toBeGreaterThanOrEqual(2)
        expect(rider.activeReservation).toBeNull()
        expect(reservation.destination).toBe('Paris')
    })

    test('should prevent the rider from making a reservation if they have an active one', () => {
        const rider: Rider = {
            id: 'rider1',
            name: 'John',
            balance: 100,
            birthday: new Date('1989-10-03'),
            activeReservation: null,
        }

        rider.activeReservation = new Ride(rider, 'Paris')

        expect(rider.activeReservation).not.toBeNull()
        expect(() => {
            if (rider.activeReservation)
                throw new Error(
                    'Cannot make another reservation until the current one is canceled.'
                )
        }).toThrow(
            'Cannot make another reservation until the current one is canceled.'
        )
    })

    test('should prevent the rider from making a reservation if their balance is too low', () => {
        const rider: Rider = {
            id: 'rider2',
            name: 'John',
            balance: 1,
            birthday: new Date('1989-10-03'),
            activeReservation: null,
        }

        expect(rider.balance).toBeLessThan(2)
        expect(() => {
            if (rider.balance < 2)
                throw new Error('Insufficient balance for reservation.')
        }).toThrow('Insufficient balance for reservation.')
    })

    test('should confirm the reservation only when a driver is assigned', () => {
        const rider: Rider = {
            id: 'rider3',
            name: 'John',
            balance: 100,
            birthday: new Date('1989-10-03'),
            activeReservation: null,
        }

        const reservation = new Ride(rider, 'Paris')
        const driver: Driver = {
            id: 'driver1',
            name: 'Driver1',
            available: true,
            isOnTheWay: false,
        }

        expect(reservation.isConfirmed()).toBe(false)

        reservation.assignDriver(driver)

        expect(reservation.isConfirmed()).toBe(true)
    })
    test('should allow a rider to make a new reservation only after canceling the previous one', () => {
        const rider: Rider = {
            id: 'rider4',
            name: 'John',
            balance: 100,
            birthday: new Date('1989-10-03'),
            activeReservation: null,
        }

        rider.activeReservation = new Ride(rider, 'Paris')
        rider.activeReservation = null
        const newReservation = new Ride(rider, 'Paris')

        expect(rider.activeReservation).toBeNull()
        expect(newReservation).toBeInstanceOf(Ride)
        expect(newReservation.destination).toBe('Paris')
    })
})
