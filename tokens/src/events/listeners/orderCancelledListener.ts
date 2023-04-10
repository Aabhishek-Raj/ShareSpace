import { Message } from "node-nats-streaming"
import { Listener, OrderCancelledEvent, Subjects } from "@sharespace/common"

import { queueGroupName } from "./queueGroupName"
import { Token } from "../../models/tokens"
import { TokenUpdatedPublisher } from "../publishers/tokenUpdatedPublisher"

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
    queueGroupName = queueGroupName

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const token = await Token.findById(data.token.id)

        if(!token) {
            throw new Error('token not found')
        }

        token.set({ orderId: undefined })
        await token.save()

        await new TokenUpdatedPublisher(this.client).publish({
            id: token.id,
            orderId: token.orderId,
            userId: token.userId,
            price: token.price,
            title: token.title,
            version: token.version
        }) 

        msg.ack()
    }
}