const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB:', process.env.MONGODB_URI)
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const numberValidator = (val) => {
  if (val.length >= 8 && val.match(/^[\d -]+$/)) {
    const parts = val.split('-')
    if (parts.length === 2) {
      return parts[0].length === 2 || parts[0].length === 3
    }
  }
  return false
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: numberValidator,
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)