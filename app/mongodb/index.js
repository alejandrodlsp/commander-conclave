const mongoose = require("mongoose")
const CardEntity = require("./models/card_entity.model")

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING).then(() => {
    console.log("Connected to MongoDB")

    CardEntity.create({
        name: "Sol Ring",
        card_id: "1234",
        tapped: false
    }).then((card_entity) => {
        console.log(card_entity)
    })

}).catch((err) => {
    console.log("Failed to connect to MongoDB: ", err)
})