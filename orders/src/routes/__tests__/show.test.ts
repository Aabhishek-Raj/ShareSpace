import mongoose from 'mongoose';
import request from 'supertest'

import { app } from '../../app'
import { Token } from '../../models/token'

declare const global: NodeJS.Global & typeof globalThis;

it('fetches the order', async () => {
    
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
        expect(201)

    const { body: fetchOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)
    
    expect(fetchOrder.id).toEqual(order.id)
})

it('returns an err if one user tries to another users order', async () => {
    
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
        expect(201)

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401)

})