import nats from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import { TokenCretedListener } from './events/tokenCreatedListener'

console.clear()

const stan = nats.connect('sharespace', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

stan.on('connect', () => {
    console.log('Listener connected to NATS')

    stan.on('close', () => {
        console.log('Nats connection closed')
        process.exit()
    })

    // const options = stan
    // .subscriptionOptions()
    // .setManualAckMode(true)
    // .setDeliverAllAvailable()
    // .setDurableName('accounting-service')

    // const subscription = stan.subscribe('token:created', 'orders-service-queue-group', options)

    // subscription.on('message', (msg: Message) => {

    //     const data = msg.getData()

    //     if( typeof data === 'string') {
    //         console.log(`Received event #${msg.getSequence()}, with data ${JSON.parse(data)}`)
    //     }

    //     msg.ack()
    // })

    new TokenCretedListener(stan).listen() 
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())
