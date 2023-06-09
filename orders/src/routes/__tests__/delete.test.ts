import mongoose from 'mongoose'
import request from 'supertest'

import { app } from '../../app'
import { Token } from '../../models/token'
import { Order, OrderStatus } from '../../models/order'
import { natsWrapper } from '../../natsWrapper'

declare const global: NodeJS.Global & typeof globalThis;


it('marks an order as cancelled', async () => {
    
    const token = Token.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await token.save()

    const user = global.signin()

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ tokenId: token.id })
        .expect(201)

    //make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)
    
    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits a order cancelled event', async () => {
    const token = Token.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await token.save()

    const user = global.signin()

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ tokenId: token.id })
        .expect(201)

    //make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})