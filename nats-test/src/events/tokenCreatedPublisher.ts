import { Publisher } from "./basePublisher";
import { Subjects } from "./subject";
import { TokenCreatedEvent } from "./tokenCreatedEvents";

export class TokenCreatedPublisher extends Publisher<TokenCreatedEvent> {
    subject: Subjects.TokenCreated = Subjects.TokenCreated
}