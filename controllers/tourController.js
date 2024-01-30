const Tour = require('../models/tourModel')

exports.getTopCheapTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,difficulty,price,summary,ratingsAverage'

  next()
}

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query }
    const excludeFields = ['page', 'sort', 'limit', 'fields']
    excludeFields.forEach(el => delete queryObj[el])

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    console.log(JSON.parse(queryStr))

    let query = Tour.find(JSON.parse(queryStr))

    console.log(queryObj, req.query)

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }

    const page = +req.query.page || 1
    const limit = +req.query.limit || 100

    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)

    if (req.query.page) {
      const numTours = await Tour.countDocuments()
      if (skip >= numTours) {
        throw new Error('This page does not exist!')
      }
    }

    const tours = await query

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours,
      },
    })
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error.message })
  }
}

exports.getTour = async (req, res) => {
  try {
    const { id } = req.params
    const tour = await Tour.findById(id)

    res.status(200).json({
      status: 'success',
      data: { tour },
    })
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error.message })
  }
}

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)

    res.status(201).json({ status: 'success', data: { tour: newTour } })
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params

    const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour,
      },
    })
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error.message })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params

    await Tour.findByIdAndDelete(id)

    res.status(204).json({
      status: 'success',
      data: null,
    })
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error.message })
  }
}
