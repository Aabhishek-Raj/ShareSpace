import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Token } from '../../models/tokens';

declare const global: NodeJS.Global & typeof globalThis; 

it('returns a 404 if the provided id does not exist', async () => {

    const id = new mongoose.Types.ObjectId().toHexString()

    await request(app)
        .put(`/api/tokens/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'fjdfjdj',
            price: 20
        })
        expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {

    const id = new mongoose.Types.ObjectId().toHexString()

    await request(app)
        .put(`/api/tokens/${id}`)
        .send({
            title: 'fjdfjdj',
            price: 20
        })
        expect(401)
})

it('returns a 401 if the user doesnot own the token', async () => {
    const response = await request(app)
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({
            title: 'kjogsdfd',
            price: 20
        })

    await request(app)
        .put(`/api/tokens/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'kjdsfnfsj',
            price: 100
        })
        .expect(401)
})

it('returns a 400 if the user provides an invalid title or pice', async () => {

    const cookie = global.signin()

    const response = await request(app)
    .post('/api/tokens')
    .set('Cookie', cookie)
    .send({
        title: 'kjogsdfd',
        price: 20
    })

    await request(app)
        .put(`/api/tokens/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400)

    await request(app)
        .put(`/api/tokens/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: -10
        })
        .expect(400)
})

it('updates the token, if provided valid inputs', async () => {

    const cookie = global.signin()

    const response = await request(app)
    .post('/api/tokens')
    .set('Cookie', cookie)
    .send({
        title: 'kjogsdfd',
        price: 20
    })

    await request(app)
        .put(`/api/tokens/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 130
        })
        .expect(200)

    const tokenResponse = await request(app)
        .get(`/api/tokens/${response.body.id}`)
        .send()

    expect(tokenResponse.body.title).toEqual('new title')
    expect(tokenResponse.body.price).toEqual(130)
})

it('rejects updates if the token is reserved', async () => {
    const cookie = global.signin()

    const response = await request(app)
    .post('/api/tokens')
    .set('Cookie', cookie)
    .send({
        title: 'kjogsdfd',
        price: 20
    })

    const token = await Token.findById(response.body.id)
    token!.set({ orderId: new mongoose.Types.ObjectId().toHexString() })
    await token!.save()

    await request(app)
        .put(`/api/tokens/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 130
        })
        .expect(400)
})