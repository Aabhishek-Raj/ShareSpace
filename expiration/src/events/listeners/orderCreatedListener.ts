import { Listener, OrderCreatedEvent, Subjects } from "@sharespace/common";
import { queueGroupName } from "./queueGroupName"
import { Message } from 'node-nats-streaming'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        
    }


}