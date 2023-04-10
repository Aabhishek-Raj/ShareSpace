import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@sharespace/common'

import { newTokenRouter } from './routes/new'
import { showTokenRouter } from './routes/show'
import { indexTokenRouter } from './routes/index'
import { updateTokenRouter } from './routes/update'

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

app.use(newTokenRouter)
app.use(showTokenRouter)
app.use(indexTokenRouter)
app.use(updateTokenRouter)

app.all('*', () => { 
    throw new NotFoundError() 
})  

app.use(errorHandler)

export { app }