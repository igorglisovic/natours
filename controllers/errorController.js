const AppError = require('../utils/appError')

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

const handleDuplicateFieldDB = err => {
  const value = err.keyValue.name
  const message = `Duplicate field value: ${value}. Please use another value!`

  console.log(err)

  return new AppError(message, 400)
}

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message)

  const message = `Invalid input data. ${errors.join('. ')}`
  console.log(message)

  return new AppError(message, 400)
}

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    })
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }

    if (err.name === 'CastError') error = handleCastErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldDB(error)
    if (error._message === 'Validation failed')
      error = handleValidationErrorDB(error)

    sendErrorProd(error, res)
  }
}
