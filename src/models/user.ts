const {Schema, model} = require('mongoose')

const user = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        tubeId: {
          type: Schema.Types.ObjectId,
          ref: 'Tube',
          required: true,
        }
      }
    ]
  }
})

user.methods.addToCart = function(tube: any) {
  let items = [...this.cart.items]
  const idx = items.findIndex((t) => {
    return t.tubeId.toString() === tube._id.toString()
  })

  if (idx >= 0) {
    items[idx].count = items[idx].count + 1
  } else {
    items.push({
      courseId: tube._id,
      count: 1
    })
  }

  this.cart = {items}
  return this.save()
}

user.methods.removeFromCart = function(id: number) {
  const items = [...this.cart.items]
  const idx = items.findIndex(c => {
    return t.tubeId.toString() === id.toString()
  })

  if (items[idx].count === 1) {
    items.splice(idx, 1);
    // items = items.filter(c => c.courseId.toString() === id.toString())
  } else {
    items[idx].count--
  }

  this.cart = {items}
  return this.save()
}

user.methods.clearCart = function() {
  this.cart = {items: []}
  return this.save()
}

module.exports = model('User', user)
