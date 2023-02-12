const { EmbedBuilder } = require('discord.js');
const NSFW = require("discord-nsfw")
const nsfw = new NSFW()

module.exports = {
    name: "anal",
    aliases: [],
    desc: "El bot enviará una imagen nsfw",
    premium: true,
    permisos_bot: [],
    permisos: [],

    run: async (client, message, args, prefix) => {

        const user = message.guild.members.cache.get(args[0]) || message.mentions.members.filter(m => m.guild.id == message.guild.id).first()

        if (!message.channel.nsfw) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`<:nsfw:1016733825474232360> **| Este canal no es NSFW | <:nsfw:1016733825474232360>**`)
                        .setColor('Red')
                ]
            })
        }

        if (!user) {
            message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${client.user.username} le da __anal__ a ${message.author.username}`)
                        .setColor('Red')
                        .setImage(await nsfw.anal())
                ]
            })
        } else {
            message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${message.author.username} le da __anal__ a ${user.user.username}`)
                        .setColor('Red')
                        .setImage(await nsfw.anal())
                ]
            })
        }
    }
}