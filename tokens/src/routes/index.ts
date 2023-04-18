import express, { Request, Response } from 'express'
import { Token } from '../models/tokens'

const router = express.Router()

router.get('/api/tokens', async (req: Request, res: Response) => {
    
    const tokens = await Token.find({
        orderId: undefined
    })

    res.send(tokens)     
})

export { router as indexTokenRouter }