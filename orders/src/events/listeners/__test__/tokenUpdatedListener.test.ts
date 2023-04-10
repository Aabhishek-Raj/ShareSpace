import mongoose from "mongoose"
import { Message } from 'node-nats-streaming'
import { TokenUpdatedEvent } from "@sharespace/common"
import { TokenUpdatedListener } from "../tokenUpdatedListener"
import { natsWrapper } from "../../../natsWrapper"
import { Token } from "../../../models/token"

const setup = async () => {
    //Create a listener
    const listener = new TokenUpdatedListener(natsWrapper.client)

    //Create and save a token
    const token = Token.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await token.save()

    //Create a fake data object
    const data: TokenUpdatedEvent['data'] = {
        id: token.id,
        version: token.version + 1,
        title: 'new concert',
        price: 999,
        userId: 'dfjsjjfkd'
    }

    //create a fake msg Object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    //return all of this stuff
    return { msg, data, token, listener}
}

it('finds, updates, and saves a token', async () => {
    const { msg, data, token, listener } = await setup()

    await listener.onMessage(data, msg)

    const updatedToken = await Token.findById(token.id)

    expect(updatedToken!.title).toEqual(data.title)
    expect(updatedToken!.price).toEqual(data.price)
    expect(updatedToken!.version).toEqual(data.version)
    
})

it('acks the message', async () => {
    const { msg, data, listener } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped version number', async () => {
    const { msg, data, listener, token } = await setup()

    data.version = 10

    try {
        await listener.onMessage(data, msg)
    } catch(err) { }

    expect(msg.ack).not.toHaveBeenCalled()
})