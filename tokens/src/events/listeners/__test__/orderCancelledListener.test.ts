import mongoose from "mongoose"
import { Message } from 'node-nats-streaming'
import { Token } from "../../../models/tokens"
import { natsWrapper } from "../../../natsWrapper"
import { OrderCancelledListener } from "../orderCancelledListener"
import { OrderCancelledEvent } from "@sharespace/common"

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const orderId = new mongoose.Types.ObjectId().toHexString()
    const token = Token.build({
        title: 'consrty',
        price: 20,
        userId: 'kfjdsjf'
    })
    token.set({ orderId })
    await token.save()

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        token: {
            id: token.id
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { msg, data, token, orderId, listener }
}

it('updated the token, publishes an event, and acks the message', async () => {
    const { msg, data, token, orderId, listener } = await setup()

    await listener.onMessage(data, msg)

    const updatedToken = await Token.findById(token.id)

    expect(updatedToken!.orderId).not.toBeDefined()
    expect(msg.ack).toHaveBeenCalled()
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})