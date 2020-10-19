import express = require('express');
const bodyParser = require('body-parser')
const config = require('config')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
const cors = require('cors')

const PORT = config.get('port') || 5555
const app: express.Application = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

app.use(cors());
app.options('*', cors());


app.use('/api/auth', authRoutes)

app.get('/', async(req, res) => {
  res.end('hello w')
})

const start = async () => {
  try {
    await mongoose.connect(config.get('mongoURL'), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    app.listen(PORT, function () {
      console.log(`App is listening on port ${PORT}!`);
    });

  } catch (e) {
    console.log('Server error:', e);
    process.exit(1)
  }
}

start()
