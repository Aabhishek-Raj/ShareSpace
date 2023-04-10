import request from 'supertest'
import { app } from '../../app'
import { Token } from '../../models/tokens'
import { natsWrapper } from '../../natsWrapper'


it('has a route handler listening to /api/tickets for post requests', async () => {

    const response = await request(app)
        .post('/api/tokens')
        .send({})
    expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
 
    await request(app)
        .post('/api/tokens')
        .send({})
        .expect(401)
})

declare const global: NodeJS.Global & typeof globalThis;

it('returns a status other than 401 if the user in sign in', async () => {

    const response = await request(app)  
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({})
    expect(response.status).not.toEqual(401)
})

it('returns an error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 10
        })
        .expect(400)

    await request(app)
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({
            price: 10
        })
        .expect(400)

})

it('returns an error if an invlid price is provided', async () => {
    await request(app)
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({
            title: 'fjdsojodg',
            price: -10
        })
        .expect(400)

    await request(app)
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({
            title: 'fjdsojodg',
        })
        .expect(400)
})

it('create a ticker with valid inputs', async () => {
    //needs a check to make sure token was saved
    let tokens = await Token.find({})
    expect(tokens.length).toEqual(0)

    const title = 'fsjfdsofj'

    await request(app)
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({
            title,
            price: 20
        })
        .expect(201)

    tokens = await Token.find({})
    expect(tokens.length).toEqual(1)
    expect(tokens[0].price).toEqual(20)
    expect(tokens[0].title).toEqual(title)
})

it('publishes an event', async () => {
    const title = 'fsjfdsofj'

    await request(app)
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({
            title,
            price: 20
        })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})


