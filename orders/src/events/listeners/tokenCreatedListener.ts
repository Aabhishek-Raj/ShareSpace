import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TokenCreatedEvent } from '@sharespace/common'
import { Token } from '../../models/token'
import { queueGroupName } from './queueGroupName'
 
export class TokenCreatedListener extends Listener<TokenCreatedEvent> {
    subject: Subjects.TokenCreated = Subjects.TokenCreated
    queueGroupName = queueGroupName

    async onMessage(data: TokenCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data

        const token = Token.build({
            id, title, price
        }) 
        await token.save()

        msg.ack()
    }
}