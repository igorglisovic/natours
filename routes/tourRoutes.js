const express = require('express')
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTopCheapTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController')

const router = express.Router()

router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)
router.route('/top-5-cheap').get(getTopCheapTours, getAllTours)
router.route('/').get(getAllTours).post(createTour)
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router
