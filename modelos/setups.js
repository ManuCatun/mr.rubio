const mongoose = require('mongoose');

const setupSchema = new mongoose.Schema({
    guildID: String,
    sistema_tickets: { type: Object, default: {canal: "", mensaje: ""}},
    sugerencias: { type: String, default: "" },
    antilinks: { type: Boolean, default: false },
    confesiones: { type: String, default: "" },
    logs: { type: String, default: "" },
    niveles: { type: Object, default: { canal: "", mensaje: "" } },
    bienvenidas: { type: Object, default: { canal: "", imagen: "" } },
})

const model = mongoose.model("Configuraciones", setupSchema);

module.exports = model;