const mongoose = require("mongoose");

const CardEntitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    card_id: {
        type: Number,
        required: true,
    },
    tapped: {
        type: Boolean,
        required: true,
        default: false
    }
});

const CardEntity = mongoose.model("CardEntity", CardEntitySchema);
module.exports = CardEntity;