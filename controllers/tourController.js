const Tour = require('../models/tourModel')

exports.getAllTours = async (req, res) => {
  const allTours = await Tour.find({})

  try {
    res.status(200).json({
      status: 'success',
      results: allTours.length,
      data: {
        tours: allTours,
      },
    })
  } catch (error) {
    res.status(404).json({ status: 'fail', message: 'Internal server error!' })
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
