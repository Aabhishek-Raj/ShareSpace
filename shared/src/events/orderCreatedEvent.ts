import { Subjects } from "./subject";
import { OrderStatus } from "./types/orderStatus";

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated
    data: {
        id: string,
        version: number
        status: OrderStatus,
        userId: string,
        expiresAt: string,
        token: {
            id: string,
            price: number
        }
    }
}