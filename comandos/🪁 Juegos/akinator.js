const akinator = require('discord.js-akinator')
module.exports = {
    name: "akinator",
    aliases: [],
    desc: "Juega con el genio Akinator!",
    permisos_bot: [],
    permisos: [],

    run: async (client, message, args, prefix) => {

        akinator(message, {
            language: "es",
            chillMode: "false",
            gameType: "character",
            useButtons: "true",
            embedColor: "Random"
        })

    }
}