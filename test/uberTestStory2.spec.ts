import { Ride } from '../src/uber/Ride'
import { Rider } from '../src/uber/Rider'
import { Driver } from '../src/uber/Driver'

describe('Rider Reservation', () => {
    test('should allow a rider to cancel the reservation for free on their birthday', () => {
        const today = new Date()
        const rider: Rider = {
            id: 'rider1',
            name: 'John',
            balance: 100,
            birthday: today,
            activeReservation: null,
        }

        const reservation = new Ride(rider, 'Paris')
        rider.activeReservation = reservation

        const cancellationMessage = reservation.cancel()

        expect(cancellationMessage).toBe(
            "Cancellation is free because it's your birthday!"
        )
        expect(rider.balance).toBe(100)
        expect(reservation.isCanceled).toBe(true)
    })

    test('should penalize the rider 5 euros if the driver is already on the way', () => {
        const rider: Rider = {
            id: 'rider2',
            name: 'John',
            balance: 100,
            birthday: new Date('1989-10-01'),
            activeReservation: null,
        }

        const driver: Driver = {
            id: 'driver1',
            name: 'Driver1',
            available: true,
            isOnTheWay: true,
        }

        const reservation = new Ride(rider, 'Paris')
        reservation.assignDriver(driver)
        rider.activeReservation = reservation

        const cancellationMessage = reservation.cancel()

        expect(cancellationMessage).toBe('Reservation canceled.')
        expect(rider.balance).toBe(95)
        expect(reservation.isCanceled).toBe(true)
    })

    test('should allow a rider to cancel the reservation without penalty if the driver is not assigned', () => {
        const rider: Rider = {
            id: 'rider3',
            name: 'John',
            balance: 100,
            birthday: new Date('1989-10-01'),
            activeReservation: null,
        }

        const reservation = new Ride(rider, 'Paris')
        rider.activeReservation = reservation

        const cancellationMessage = reservation.cancel()

        expect(cancellationMessage).toBe('Reservation canceled.')
        expect(rider.balance).toBe(100)
        expect(reservation.isCanceled).toBe(true)
    })

    test('should allow a rider to cancel the reservation without penalty if the driver is assigned but not yet on the way', () => {
        const rider: Rider = {
            id: 'rider5',
            name: 'John',
            balance: 100,
            birthday: new Date('1989-10-01'),
            activeReservation: null,
        }

        const driver: Driver = {
            id: 'driver2',
            name: 'Driver2',
            available: true,
            isOnTheWay: false,
        }

        const reservation = new Ride(rider, 'Paris')
        reservation.assignDriver(driver)
        rider.activeReservation = reservation

        const cancellationMessage = reservation.cancel()

        expect(cancellationMessage).toBe('Reservation canceled.')
        expect(rider.balance).toBe(100)
        expect(reservation.isCanceled).toBe(true)
    })

    test('should prevent the rider from canceling a reservation that has already been canceled', () => {
        const rider: Rider = {
            id: 'rider4',
            name: 'John',
            balance: 100,
            birthday: new Date('1989-10-02'),
            activeReservation: null,
        }

        const reservation = new Ride(rider, 'Paris')
        rider.activeReservation = reservation

        reservation.cancel()

        expect(() => {
            reservation.cancel()
        }).toThrow('Reservation is already canceled.')
    })
})
