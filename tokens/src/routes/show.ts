import { NotFoundError } from '@sharespace/common'
import express, { Request, Response } from 'express'
import { Token } from '../models/tokens'

const router = express.Router()

router.get('/api/tokens/:id', async (req: Request, res: Response) => {

    const token = await Token.findById(req.params.id)

    if(!token) {
        throw new NotFoundError()
    }

    res.send(token)
})

export { router as showTokenRouter}
