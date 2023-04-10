import mongoose from 'mongoose'
import { Order, OrderStatus } from './order'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TokenAttrs {
    id: string
    title: string
    price: number
}

export interface TokenDoc extends mongoose.Document {
    title: string
    price: number
    version: number
    isReserved(): Promise<boolean>
}

interface TokenModel extends mongoose.Model<TokenDoc> {
    build(attrs: TokenAttrs): TokenDoc
    findByEvent(event: { id: string, version: number}): Promise<TokenDoc | null>
}

const tokenSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

tokenSchema.set('versionKey', 'version')
tokenSchema.plugin(updateIfCurrentPlugin)

tokenSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Token.findOne({
        _id: event.id,
        version: event.version - 1
    })
}

tokenSchema.statics.build =(attrs: TokenAttrs) => {
    return new Token({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    })
}
tokenSchema.methods.isReserved = async function() {
    //this === document we just called isReserved on 
    const existingOrder = await Order.findOne({
        token: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    })

    return !!existingOrder
} 

const Token = mongoose.model<TokenDoc, TokenModel>('Token', tokenSchema)

export { Token }