import { rateLimit } from 'elysia-rate-limit'
import { redis } from '../config/redis'
import { AppError } from '../exceptions/app.error'

export const rateLimiter = rateLimit({
    duration: 1000,
    max: 1,
    storage: 'redis',
    redis: redis,
    generator: (req, server) => {
        const ip = server?.hostname || req.headers.get('x-forwarded-for') || 'unknown'
        const url = new URL(req.url).pathname
        const key = 'ratelimit:' + ip + ':' + url
        return key
    },
    errorResponse: new AppError(429, 'Too many requests, please try again later.')
})