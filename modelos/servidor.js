const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    guildID: String,
    prefijo: String,
    premium: { type: String, default: "" }
})

const model = mongoose.model("ConfigServer", serverSchema);

module.exports = model;