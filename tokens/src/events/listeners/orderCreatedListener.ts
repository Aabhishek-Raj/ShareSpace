import { Message } from "node-nats-streaming"
import { Listener, OrderCreatedEvent, Subjects } from "@sharespace/common"

import { queueGroupName } from "./queueGroupName"
import { Token } from "../../models/tokens"
import { TokenUpdatedPublisher } from "../publishers/tokenUpdatedPublisher"

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // Find the token that the token is reserving
        const token = await Token.findById(data.token.id)

        if(!token) {
            throw new Error('Token not found')
        }
        
        //Mark the token as being reserved by setting its orderId properly
        token.set({ orderId: data.id })
        
        //Save the token
        await token.save()
        await new TokenUpdatedPublisher(this.client).publish({
            id: token.id,
            price: token.price,
            title: token.title,
            userId: token.userId,
            orderId: token.orderId,
            version: token.version
        })  

        // ack the message
        msg.ack()

    }
}