export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;

    let message = err.message;

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null

    })
}

