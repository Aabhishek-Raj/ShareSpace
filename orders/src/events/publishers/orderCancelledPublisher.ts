import { OrderCancelledEvent, Publisher, Subjects } from "@sharespace/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}

