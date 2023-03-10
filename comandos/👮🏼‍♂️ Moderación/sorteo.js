const Discord = require('discord.js');
const ms = require('ms');
module.exports = {
    name: "sorteo",
    aliases: ["giveaway", "nuevo-sorteo", "new-giveaway"],
    desc: "Sirve para crear un nuevo sorteo",
    permisos: ["ManageChannels"],

    run: async (client, message, args, prefix) => {

        let metodos = ["start", "reroll", "end"];
        if (!args || !metodos.includes(args[0])) return message.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle(`<:nope_normal:1012749750459695114> **| Debes especificar un método válido!**`)
                    .setColor('Red')
                    .setDescription(`**Métodos disponibles:** ${metodos.map(metodo => `\`${metodo}\``).join(", ")}`)
            ]
        });

        switch (args[0]) {
            case "start": {
                let embed = new Discord.EmbedBuilder()
                    .setDescription(`**Uso:** \`${prefix}sorteo <#canal> <duración> <ganadores> <premio>\``)
                    .setColor(client.color);

                let canal = message.guild.channels.cache.get(args[1]) || message.mentions.channels.first();
                if (!canal) return message.reply({
                    embeds: [embed.setTitle(`<:nope_normal:1012749750459695114> **| Debes especificar un canal válido!**`)]
                })
                let tiempo = args[2];
                if (!tiempo) return message.reply({
                    embeds: [embed.setTitle(`<:nope_normal:1012749750459695114> **| Debes especificar una duración del sorteo válida!**`)]
                })
                let tiempo_en_ms = ms(args[2])
                if (!tiempo_en_ms || isNaN(tiempo_en_ms) || tiempo_en_ms < 0 || tiempo_en_ms % 1 != 0) return message.reply({
                    embeds: [embed.setTitle(`<:nope_normal:1012749750459695114> **| Debes especificar una duración del sorteo válida!**`)]
                })
                let ganadores = Number(args[3])
                if (!ganadores || isNaN(ganadores) || ganadores < 0 || ganadores % 1 != 0) return message.reply({
                    embeds: [embed.setTitle(`<:nope_normal:1012749750459695114> **| Debes especificar una cantidad de ganadores válida!**`)]
                })
                let premio = args.slice(4).join(" ");
                if (!premio) return message.reply({
                    embeds: [embed.setTitle(`<:nope_normal:1012749750459695114> **| Tienes que especificar un premio válido!**`)]
                });

                client.giveawaysManager.start(canal, {
                    duration: tiempo_en_ms,
                    winnerCount: Number(ganadores),
                    prize: premio,
                    hostedBy: message.author,
                    messages: {
                        giveaway: "🎉 **NUEVO SORTEO** 🎉",
                        giveawayEnded: "⌛ **SORTEO FINALIZADO** ⌛",
                        inviteToParticipate: "**Reacciona con 🎉 para participar!**",
                        winMessage: "🎉 Enhorabuena {winners} has/han ganado **{this.prize}**",
                        winners: "**Ganador(es):**",
                        hostedBy: "**Hosteado por:** {this.hostedBy}",
                        endendAt: "**Finalizado el:**",
                        drawing: "**Termina en:** <t:{Math.round(this.endAt / 1000)}:R>"
                    }
                }).then(() => {
                    return message.reply(`<:check:1012042903381610496> **| Sorteo iniciado en ${canal}**`)
                })
            }
                break;

            case "reroll": {
                let mensajeId = args[1];
                if (!mensajeId) return message.reply(`<:nope_normal:1012749750459695114> **| No has especificado un mensaje de sorteo válido!**`);

                client.giveawaysManager.reroll(mensajeId).then(() => {
                    message.channel.send(`<:check:1012042903381610496> **| Nuevo ganador elegido!**`);
                }).catch((e) => {
                    message.channel.send('<:nope_normal:1012749750459695114> **| No se ha encontrado el sorteo!**')
                })
            }
                break;

            case "end": {
                let mensajeId = args[1];
                if (!mensajeId) return message.reply(`<:nope_normal:1012749750459695114> **| No has especificado un mensaje de sorteo válido!**`);

                client.giveawaysManager.end(mensajeId).then(() => {
                    message.channel.send('<:check:1012042903381610496> **| Sorteo finalizado!**');
                }).catch((e) => {
                    message.channel.send('<:nope_normal:1012749750459695114> **| No se ha encontrado el sorteo!**')
                });
            }
                break;
        }
    }
}