import mongoose from 'mongoose'
import request from 'supertest'

import { app } from '../../app'
import { Order } from '../../models/order'
import { Token } from '../../models/token'

declare const global: NodeJS.Global & typeof globalThis;

const buildToken = async () => {
    const token = Token.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await token.save()

    return token
}

it('fetches orders for an particular user', async () => {
    // Create three tokens
    const tokenOne = await buildToken()
    const tokenTwo = await buildToken()
    const tokenThree = await buildToken()

    const userOne = global.signin()
    const userTwo = global.signin()
    //Create one order as User #1
    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({tokenId: tokenOne.id})
        .expect(201)

    //Create two orders as User #2
    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({tokenId: tokenTwo.id})
        .expect(201)
    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({tokenId: tokenThree.id})
        .expect(201)

    //Make request to get orders for User #2
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200)

    expect(response.body.length).toEqual(2)
    expect(response.body[0].id).toEqual(orderOne.id)
    expect(response.body[1].id).toEqual(orderTwo.id)
    expect(response.body[0].token.id).toEqual(tokenTwo.id)
    expect(response.body[1].token.id).toEqual(tokenThree.id)

})