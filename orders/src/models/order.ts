import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { OrderStatus } from '@sharespace/common'
import { TokenDoc } from './token' 

export { OrderStatus }

interface OrderAttr { 
    userId: string
    status: OrderStatus
    expiresAt: Date 
    token: TokenDoc 
}

interface OrderDoc extends mongoose.Document {
    userId: string
    status: OrderStatus
    expiresAt: Date
    token: TokenDoc
    version: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttr): OrderDoc
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    token: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Token'
    }
},{
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttr) => {
    return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }