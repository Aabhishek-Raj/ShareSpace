import { Subjects } from "./subject"

export interface TokenCreatedEvent {
    subject: Subjects.TokenCreated
    data: {
        id: string
        title: string
        price: number
    }
}