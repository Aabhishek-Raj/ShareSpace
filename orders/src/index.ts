import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './natsWrapper'
import { TokenCreatedListener } from './events/listeners/tokenCreatedListener'
import { TokenUpdatedListener } from './events/listeners/tokenUpdatedListener'
import { ExpirationCompleteListener } from './events/listeners/expirationCompleteListener'
import { PaymentCreatedListener } from './events/listeners/paymentCreatedListener'
 

const start = async () => {
    console.log('order Starting..')

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined')
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined')
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined')
    }
    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined')   
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined')
    }
 
    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
        natsWrapper.client.on('close', () => {
            console.log('Nats connection closed')
            process.exit()
        })
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        new TokenCreatedListener(natsWrapper.client).listen()
        new TokenUpdatedListener(natsWrapper.client).listen()
        new ExpirationCompleteListener(natsWrapper.client).listen()
        new PaymentCreatedListener(natsWrapper.client).listen()

        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDb')

    } catch (err) {
        console.error(err) 
    }

    app.listen(3000, () => {
        console.log('Listening on 3000!!!!!')
    })
}

start()
