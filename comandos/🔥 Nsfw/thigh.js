const { EmbedBuilder } = require('discord.js');
const NSFW = require("discord-nsfw")
const nsfw = new NSFW()

module.exports = {
    name: "thigh",
    aliases: [],
    desc: "El bot enviará una imagen nsfw",
    premium: true,
    permisos_bot: [],
    permisos: [],

    run: async (client, message, args, prefix) => {

        if (!message.channel.nsfw) {
            return message.reply({ embeds: [
                new EmbedBuilder()
                .setTitle(`<:nsfw:1016733825474232360> **| Este canal no es NSFW | <:nsfw:1016733825474232360>**`)
                .setColor('Red')
            ] })
        }

        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setImage(await nsfw.thigh())
            ]
        })

    }
}