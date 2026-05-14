import { AppError } from '../exceptions/app.error'

export const errorHandler = ({ code, error, set }: any) => {
    // Log error untuk internal debugging
    console.error('[Error ' + code + ']:', error)

    // 1. Handle Custom AppError (Manual throw)
    if (error instanceof AppError) {
        set.status = error.err_code
        return { err_code: error.err_code, message: error.message }
    }

    // 2. Handle Elysia Validation Error (TypeBox)
    if (code === 'VALIDATION') {
        set.status = 400
        const firstError = (error as any).all?.[0]
        const message = firstError 
            ? 'Validation failed: ' + firstError.path.slice(1) + ' ' + firstError.message 
            : 'Validation failed'

        return { err_code: 400, message }
    }

    // 3. Handle NOT_FOUND
    if (code === 'NOT_FOUND') {
        set.status = 404
        return { err_code: 404, message: 'Endpoint or resource not found' }
    }

    // 4. Default Internal Server Error
    set.status = 500
    return { err_code: 500, message: 'Internal server error' }
}