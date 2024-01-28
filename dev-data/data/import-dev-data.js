const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('../../models/tourModel')

dotenv.config({ path: './config.env' })

const devTours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
)

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB connection 2 successful!'))

const importData = async () => {
  try {
    await Tour.create(devTours)
    console.log('Data successfully loaded!')
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('Data successfully loaded!')
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

if (process.argv[2] === '--import') {
  importData()
}

if (process.argv[2] === '--delete') {
  deleteData()
}

console.log(process.argv)
