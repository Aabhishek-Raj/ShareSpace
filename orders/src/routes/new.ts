import mongoose from 'mongoose'
import express, { Request, Response } from 'express'
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@sharespace/common'
import { body } from 'express-validator'

import { Token } from '../models/token'
import { Order } from '../models/order'
import { OrderCreatedPublisher } from '../events/publishers/orderCreatedPublisher'
import { natsWrapper } from '../natsWrapper'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post('/api/orders',requireAuth,
[
    body('tokenId')
        .not().isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TokenId must be provided')
],
validateRequest, async (req: Request, res: Response) => {
    const { tokenId } = req.body

    const token = await Token.findById(tokenId)
    if(!token) {
        throw new NotFoundError()
    }
    //Make sure that this token is not already reserved
    //run query to look all orders , find an order where token is just found & orer statutus is not cancelled
    //if we find an order, means the token is already reserved
   const isReserved = await token.isReserved()

    if(isReserved){
        throw new BadRequestError('Token is already reserved')
    }

    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        token: token
    })
    await order.save()

    //Publish an event saying that order created
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        token: {
            id: token.id,
            price: token.price
        }
    })

    res.status(201).send(order)
})

export { router as newOrderRouter}