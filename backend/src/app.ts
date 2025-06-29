import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import dotenv from 'dotenv'
import { scheduleEventStatusUpdates } from './services/eventStatusService'
dotenv.config()

const app = Fastify({
    logger: true,
    trustProxy: true
})

async function registerPlugins() {
    await app.register(cors, {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true
    })

    await app.register(helmet)

    await app.register(jwt, {
        secret: process.env.JWT_SECRET || 'fallback-secret'
    })

    await app.register(multipart)
}

app.get('/health', async (_request, _reply) => {
    return { status: 'OK', timestamp: new Date().toISOString() }
})

app.get('/', async (_request, _reply) => {
    return {
        message: 'Event Booking API',
        version: '1.0.0',
        status: 'running'
    }
})

scheduleEventStatusUpdates()

export { app, registerPlugins }