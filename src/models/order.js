const {Schema, model} = require('mongoose')

const order = new Schema({
  products: [
    {
      product: {
        type: Object,
        required: true,
        ref: 'Product'
      },
      count: {
        type: Number,
        required: true,
      }
    }
  ],
  user: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

module.exports = model('Order', order)
