const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')

exports.getTopCheapTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,difficulty,price,summary,ratingsAverage'

  next()
}

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()

    console.log(features.query)

    const tours = await features.query

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

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRating: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
    ])

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    })
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error.message })
  }
}

exports.getMonthlyPlan = async (req, res) => {
  try {
    const { year } = req.params

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: {
            $push: { name: '$name' },
          },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numTourStarts: -1,
        },
      },
      {
        $limit: 12,
      },
    ])

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    })
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error.message })
  }
}
