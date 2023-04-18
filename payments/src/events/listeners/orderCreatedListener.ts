import { Message } from 'node-nats-streaming'
import { Listener, OrderCreatedEvent, Subjects } from "@sharespace/common";
import { queueGroupName } from "./queueGroupName";
import { Order } from '../../models/order';

export class OrderCreatedListner extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName
 
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const order = Order.build({
            id: data.id,
            price: data.token.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        })
        await order.save()

        msg.ack()
    }
}