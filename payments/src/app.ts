import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@sharespace/common'
import { createChargeRouter } from './routes/new'

const app = express()   
app.set('trust proxy', true)          
app.use(json()) 
app.use( 
    cookieSession({    
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
) 
//if cookie has to run above to set req.session, only after cookie
app.use(currentUser)

app.use(createChargeRouter)

app.all('*', () => { 
    throw new NotFoundError() 
})    

app.use(errorHandler)
 
export { app }