import { Publisher, Subjects, TokenUpdatedEvent } from "@sharespace/common";

export class TokenUpdatedPublisher extends Publisher<TokenUpdatedEvent> {
    subject: Subjects.TokenUpdated = Subjects.TokenUpdated  
}