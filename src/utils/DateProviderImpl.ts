import { DateProvider } from './DateProvider'

export class DateProviderImpl implements DateProvider {
    now(): Date {
        return new Date()
    }
}
