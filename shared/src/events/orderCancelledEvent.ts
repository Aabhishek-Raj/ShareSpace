import { Subjects } from "./subject";

export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled
    data: {
        id: string,
        version: number
        token: {
            id: string
        }
    }
}