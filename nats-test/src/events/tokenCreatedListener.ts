import { Message } from "node-nats-streaming"
import { Listener } from "./baseListener"
import { Subjects } from "./subject"
import { TokenCreatedEvent } from "./tokenCreatedEvents"

export class TokenCretedListener extends Listener<TokenCreatedEvent> {
    subject: Subjects.TokenCreated = Subjects.TokenCreated
    queueGroupName = 'payments-service'

    onMessage(data: TokenCreatedEvent['data'], msg: Message) {
        console.log('Event Data!!', data)

        console.log(data.id)
        console.log(data.title)
        console.log(data.price)

        msg.ack()  
    }
}