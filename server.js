require('dotenv').config()

const express = require("express")

const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()

const corsOptions = {
    origin: "http://localhost:8080",
    credentials:true,
    optionSuccessStatus:200
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const db = require("./models")
db.sequelize.sync().then(() => {
    console.log("Drop and re-sync db")
})

require("./app/routes")(app)
require('./app/cables')

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Server is running")
})