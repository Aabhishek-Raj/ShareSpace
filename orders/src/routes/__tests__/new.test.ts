import mongoose from 'mongoose'
import request from 'supertest'

import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order';
import { Token } from '../../models/token';
import { natsWrapper } from '../../natsWrapper';

declare const global: NodeJS.Global & typeof globalThis;


it('return an error if the token does not exist', async () => {
    const tokenId = new mongoose.Types.ObjectId()

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ tokenId })
        .expect(404)
})

it('returns an error if the token is already reserved', async () => {
    const token = Token.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20
    })
    await token.save()
    
    const order = Order.build({
        token,
        userId: 'jdfjjfdio',
        status: OrderStatus.Created,
        expiresAt: new Date()
    })
    await order.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ tokenId: token.id})
        .expect(400)
})

it('reserves a token', async () => {
    const token = Token.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await token.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ tokenId: token.id })
        .expect(201)
})

it('emits an order created event', async () => {
    const token = Token.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await token.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ tokenId: token.id })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})