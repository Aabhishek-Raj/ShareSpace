import nats from 'node-nats-streaming'
import { TokenCreatedPublisher } from './events/tokenCreatedPublisher'

console.clear()

const stan = nats.connect('sharespace', 'abc', {
    url: 'http://localhost:4222'
})

stan.on('connect', async () => {
    console.log('Publisher connected to NATS')

    // const data = JSON.stringify({
    //     id: '123',
    //     title: 'concert',
    //     price: 20
    // })

    // stan.publish('token:created', data, () => {
    //     console.log('Event published')
    // })

    const publisher = new TokenCreatedPublisher(stan)
    try {
        await publisher.publish({
            id: '123',
            title: 'concert',
            price: 20
        })
    } catch(err) {
        console.error(err)
    }
})  