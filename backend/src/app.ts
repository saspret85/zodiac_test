import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { taskRoutes } from './routes/task.routes'
import { rateLimiter } from './middlewares/rate-limit'
import { errorHandler } from './middlewares/error-handler'

const app = new Elysia()
    .use(cors())
    .use(
        swagger({
            path: '/swagger',
            documentation: {
                info: {
                    title: 'TaskFlow API',
                    version: '1.0.0',
                    description: 'Task Management API'
                },
                tags: [
                    { name: 'Tasks', description: 'Task management endpoints' }
                ]
            }
        })
    )
    .onError(errorHandler)
    .group('/api', (app) => 
        app
            .use(rateLimiter)
            .use(taskRoutes)
    )
    .get('/', () => ({ message: 'Welcome to TaskFlow API' }))
    .listen(process.env.PORT || 3000)

console.log(
    '🚀 Server is running at ' + (app.server?.hostname || 'localhost') + ':' + (app.server?.port || 3000)
)
console.log(
    '📖 Documentation is available at http://' + (app.server?.hostname || 'localhost') + ':' + (app.server?.port || 3000) + '/swagger'
)

export type App = typeof app