import { Message } from 'node-nats-streaming'
import mongoose from "mongoose"
import { OrderCreatedEvent, OrderStatus } from "@sharespace/common"

import { OrderCreatedListener } from "../orderCreatedListener"
import { natsWrapper } from "../../../natsWrapper"
import { Token } from "../../../models/tokens"

const setup = async () => {
    // Create an instance of listener
    const listener = new OrderCreatedListener(natsWrapper.client)

    // Create & save a token
    const token = Token.build({
        title: 'consert',
        price: 99,
        userId: 'ffd'
    })
    await token.save()

    // Create the fake data event  
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'fhdfkjhjlds',
        expiresAt: 'fjdkjdf',
        token: {
            id: token.id,
            price: token.price
        }
    }
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, token, data, msg }
}

it('sets the userId of the token', async () => {
    const { listener, token, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedToken = await Token.findById(token.id)

    expect(updatedToken!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
    const { listener, token, data, msg } = await setup()

    await listener.onMessage(data, msg)   

    expect(msg.ack).toHaveBeenCalled()
})

it('publishes a token updated event', async () => {
    const { listener, token, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const tokenUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(data.id).toEqual(tokenUpdatedData.orderId)
})