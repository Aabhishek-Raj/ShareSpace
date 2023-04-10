import express, { Request, Response } from 'express'
import { NotAuthorizedError, NotFoundError, requireAuth } from '@sharespace/common'

import { Order, OrderStatus } from '../models/order'
import { OrderCancelledPublisher } from '../events/publishers/orderCancelledPublisher'
import { natsWrapper } from '../natsWrapper'

const router = express.Router()

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {

    const { orderId } = req.params

    const order = await Order.findById(orderId).populate('token')

    if(!order) {
        throw new NotFoundError()
    }

    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    order.status = OrderStatus.Cancelled
    await order.save()

    //pulishing event 
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        token: {
            id: order.token.id
        }
    })

    res.status(204).send(order)
})

export { router as deleteOrderRouter}