import mongoose from "mongoose"
import { Message } from 'node-nats-streaming'
import { OrderCreatedEvent, OrderStatus } from "@sharespace/common"
import { natsWrapper } from "../../../natsWrapper"
import { OrderCreatedListner } from "../orderCreatedListener"
import { Order } from "../../../models/order"

const setup = () => {
    const listener = new OrderCreatedListner(natsWrapper.client)    

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: 'jdsjdf',
        userId: 'fjdsojf',
        status: OrderStatus.Created,
        token: {
            id: 'fjdfj',
            price: 10
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    } 

    return { listener, data, msg }
}

it('replicates the order info', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const order = await Order.findById(data.id)

    expect(order!.price).toEqual(data.token.price)
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})