import { Publisher, Subjects, TokenCreatedEvent } from "@sharespace/common";

export class TokenCreatedPublisher extends Publisher<TokenCreatedEvent> {
    subject: Subjects.TokenCreated = Subjects.TokenCreated
} 