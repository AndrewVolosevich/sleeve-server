const {Schema, model} = require('mongoose')

const product = new Schema({
    title: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: String
})
module.exports = model('Product', product)




