const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
//quitar espacios del path
const path = __dirname + `/.env.production`
require('dotenv').config({
    path: path
})




mongoose.set('strictQuery', false)
mongoose.connect(process.env.URI_MONGO_DB).then(() => {
    console.log('Connected to database')

}).catch((error) => {
    console.log('Database connection failed')
    console.log(error)
})

const app = express()
app.use(bodyParser.json())
app.use(cors(
    {
        origin: '*',
    }
))

app.use('/api/option', require('./routes/options'))
app.use('/api/upload', require('./routes/upload'))
app.use('/api/document', require('./routes/document'))
app.use('/api/record', require('./routes/record'))
app.use('/api/user', require('./routes/user'))
app.use('/api/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
