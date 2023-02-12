const Discord = require('discord.js');
const setupSchema = require(`../../modelos/setups.js`);

module.exports = {
    name: "setup-tickets",
    aliases: ["canal-tickets"],
    desc: "Sirve para definir el canal del sistema de Tickets",
    permisos_bot: ["ManageChannels"],
    permisos: ["ManageChannels"],
 
    run: async (client, message, args, prefix) => {

        var objeto = {
            canal: "",
            mensaje: "",
        };

        const quecanal = await message.reply({
            embeds: [new Discord.EmbedBuilder()
                .setTitle(`¿Qué canal quieres usar para el sistema de tickets?`)
                .setDescription(`*Simplemente menciona el canal o envia su ID!*`)
                .setColor(client.color)
            ]
        });

        await quecanal.channel.awaitMessages({
            filter: m => m.author.id === message.author.id,
            max: 1,
            errors: ["time"],
            time: 180e3
        }).then(async collected => {
            var message = collected.first();
            const channel = message.guild.channels.cache.get(message.content) || message.mentions.channels.first();
            if (channel) {
                objeto.canal = channel.id;
                const quemensaje = await message.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setTitle(`¿Que mensaje quieres usar para el sistema de tickets?`)
                        .setDescription(`*Simplemente envia el mensaje!*`)
                        .setColor(client.color)
                    ]
                });
                await quemensaje.channel.awaitMessages({
                    filter: m => m.author.id === message.author.id,
                    max: 1,
                    errors: ["time"],
                    time: 180e3
                }).then(async collected => {
                    var message = collected.first();
                    const msg = await message.guild.channels.cache.get(objeto.canal).send({
                        embeds: [new Discord.EmbedBuilder()
                            .setTitle(`🎫 | Crea un Ticket`)
                            .setDescription(`${message.content.substring(0, 2048)}`)
                            .setColor(client.color)
                        ],
                        components: [new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setLabel('Crea un Ticket').setEmoji('🎫').setCustomId('creat_ticket').setStyle("Success"))]
                    })
                    objeto.mensaje = msg.id
                    await setupSchema.findOneAndUpdate({ guildID: message.guild.id }, {
                        sistema_tickets: objeto
                    });
                    return message.reply(`**<:check:1012042903381610496> | Configurado correctamente en <#${objeto.canal}>**`)
                }).catch(() => {
                    return message.reply("**<:nope_normal:1012749750459695114> | El tiempo ha expirado!**")
                })
            } else {
                return message.reply("**<:nope_normal:1012749750459695114> | No se ha encontrado el canal!**")
            }
        }).catch(() => {
            return message.reply("**<:nope_normal:1012749750459695114> | El tiempo ha expirado!**")
        })

    }
}