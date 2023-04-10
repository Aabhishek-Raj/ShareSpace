import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest } from '@sharespace/common'

import { Token } from '../models/tokens'
import { TokenCreatedPublisher } from '../events/publishers/tokenCreatedPublisher'
import { natsWrapper } from '../natsWrapper'

const router = express.Router()

router.post('/api/tokens', requireAuth, 
[
    body('title')
        .not().isEmpty().withMessage('Title is required'),
    body('price')
        .isFloat({ gt: 0 }).withMessage('Price should be greater than 0')
], 
 validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body

    const token = Token.build({
        title,
        price,
        userId: req.currentUser!.id  
    })   
    await token.save()

    new TokenCreatedPublisher(natsWrapper.client).publish({ 
        id: token.id,
        title: token.title,  
        price: token.price,
        userId: token.userId,
        version: token.version
    })

    res.status(201).send(token)

}) 

export { router as newTokenRouter }