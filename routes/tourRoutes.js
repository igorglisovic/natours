const express = require('express')
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTopCheapTours,
} = require('../controllers/tourController')

const router = express.Router()

router.route('/top-5-cheap').get(getTopCheapTours, getAllTours)
router.route('/').get(getAllTours).post(createTour)
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router
