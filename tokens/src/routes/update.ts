import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { validateRequest, NotFoundError, requireAuth, NotAuthorizedError, BadRequestError } from '@sharespace/common'

import { Token } from '../models/tokens'
import { TokenUpdatedPublisher } from '../events/publishers/tokenUpdatedPublisher'
import { natsWrapper } from '../natsWrapper'

const router = express.Router()

router.put('/api/tokens/:id', requireAuth,
[
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be provided & greater than 0')
],
validateRequest, async (req: Request, res: Response) => {
    
    const token = await Token.findById(req.params.id)

    if(!token) {
        throw new NotFoundError() 
    }

    if(token.orderId) {
        throw new BadRequestError('Cannot edit a reserved token')
    }

    if(token.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    token.set({
        title: req.body.title,
        price: req.body.price 
    })
    await token.save()

    new TokenUpdatedPublisher(natsWrapper.client).publish({
        id: token.id,
        title: token.title,
        price: token.price,
        userId: token.userId,
        version: token.version
    })

    res.send(token)
})

export { router as updateTokenRouter }