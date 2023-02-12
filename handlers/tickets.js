const { asegurar_todo } = require('../utils/funciones');
const setupSchema = require('../modelos/setups');
const ticketSchema = require('../modelos/tickets');
const Discord = require('discord.js');
const html = require('discord-html-transcripts')

module.exports = client => {

    //Creación de tickets
    client.on("interactionCreate", async interaction => {
        try {
            //comprobaciones previas
            if (!interaction.guild || !interaction.channel || !interaction.isButton() || interaction.message.author.id !== client.user.id || interaction.customId !== "crear_ticket");
            //aseguramos la base de datos
            await asegurar_todo(interaction.guild.id);
            //buscamos el setup en la base de datos
            const setup = await setupSchema.findOne({ guildID: interaction.guild.id });
            //comprobaciones previas
            if (!setup || !setup.sistema_tickets || !setup.sistema_tickets.canal || interaction.channel.id !== setup.sistema_tickets.canal || interaction.message.id !== setup.sistema_tickets.mensaje) return;
            //buscamos si el usuario tiene un ticket ya creado
            let ticket_data = await ticketSchema.find({ guildID: interaction.guild.id, autor: interaction.user.id, cerrado: false });

            //comprobar si el usuario ya tiene un ticket creado en el servidor y no este cerrado 
            for (const ticket of ticket_data) {
                if (interaction.guild.channels.cache.get(ticket.canal)) return interaction.reply({ content: `*<:no:1012037166827843604> | Ya tienes un ticket creado en <#${ticket.canal}>*`, ephemeral: true })
            }

            await interaction.reply({ content: `⌛ | Creando tu ticket...`, ephemeral: true })

            //creamos el canal
            const channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.member.user.username}`.substring(0, 50),
                type: 0,
                parent: interaction.channel.parent ?? null,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["ViewChannel"]
                    },
                    {
                        id: interaction.user.id,
                        allow: ["ViewChannel"]
                    },
                    {
                        id: "858801905127260181",
                        allow: ["ViewChannel"]
                    }
                ]
            });
            //enviamos la bienvenida al usuario
            channel.send({
                embeds: [new Discord.EmbedBuilder()
                    .setTitle(`Ticket de ${interaction.member.user.tag}`)
                    .setDescription(`Bienvenido a tu Ticket ${interaction.member} \nExplica tu problema para que podamos ayudarte!`)
                    .setColor(client.color)
                ],
                components: [new Discord.ActionRowBuilder().addComponents(
                    [
                        new Discord.ButtonBuilder().setStyle('Danger').setLabel("Cerrar").setEmoji("🔒").setCustomId("cerrar_ticket"),
                        new Discord.ButtonBuilder().setStyle('Secondary').setLabel("Borrar").setEmoji("🗑").setCustomId("borrar_ticket"),
                        new Discord.ButtonBuilder().setStyle('Primary').setLabel("Guardar").setEmoji("💾").setCustomId("guardar_ticket")
                    ]
                )]
            });
            //guardamos el ticket en la base de datos
            let data = new ticketSchema({
                guildID: interaction.guild.id,
                autor: interaction.user.id,
                canal: channel.id,
                cerrado: false,
            });
            data.save();
            await interaction.editReply({ content: `**<:check:1012042903381610496> | Ticket creado en ${channel}**`, ephemeral: true })

        } catch (e) {
            console.log(e)
        }
    })

    //Botones
    client.on("interactionCreate", async interaction => {
        try {
            //comprobaciones previas
            if (!interaction.guild || !interaction.channel || !interaction.isButton() || interaction.message.author.id !== client.user.id) return;
            //aseguramos la base de datos
            await asegurar_todo(interaction.guild.id);

            let ticket_data = await ticketSchema.findOne({ guildID: interaction.guild.id, canal: interaction.channel.id });
            switch (interaction.customId) {
                case "cerrar_ticket": {
                    //si el ticket ya está cerrado, hacemos return;
                    if (ticket_data && ticket_data.cerrado) return interaction.reply({ content: `*<:no:1012037166827843604> | El ticket ya está cerrado!*`, ephemeral: true });
                    interaction.deferUpdate();
                    //creamos el mensaje de verificar
                    const verificar = await interaction.channel.send({
                        embeds: [new Discord.EmbedBuilder()
                            .setTitle(`Verificate primero!`)
                            .setColor('Green')
                        ],
                        components: [new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder().setLabel('Verificarse').setStyle('Success').setCustomId('verificar').setEmoji('✅')
                        )]
                    });

                    //creamos un collector
                    const collector = verificar.createMessageComponentCollector({
                        filter: i => i.isButton() && i.message.author.id == client.user.id && i.user,
                        time: 180e3
                    });

                    //escuchamos clicks en el boton 
                    collector.on("collect", boton => {
                        //si la persona que hace click en el boton no es el la misma que ha hecho click en el boton de cerrar, return;
                        if (boton.user.id !== interaction.user.id) return boton.reply({ content: `*<:no:1012037166827843604> | No puedes utilizar este botón!*`, ephemeral: true })

                        //paramos el collector
                        collector.stop();
                        boton.deferUpdate();
                        //cerramos el ticket en la base de datos
                        ticket_data.cerrado = true;
                        ticket_data.save();
                        //hacemos que el usuario que ha creado el ticket no pueda ver el ticket
                        interaction.channel.permissionOverwrites.edit(ticket_data.autor, { ViewChannel: false });
                        interaction.channel.send(`**<:check:1012042903381610496> | Ticket cerrado por \`${interaction.user.tag}\` el <t:${Math.round(Date.now() / 1000)}>**`)
                    });

                    collector.on("end", (collected) => {
                        //si el usuario ha hecho click al boton de verificar, editamos el mensaje desactivando el boton
                        if (collected && collected.first() && collected.first().customId) {
                            //editamos el mensaje
                            verificar.edit({
                                components: [new Discord.ActionRowBuilder().addComponents(
                                    new Discord.ButtonBuilder().setLabel('Verificarse').setStyle('Success').setCustomId('verificar').setEmoji('✅').setDisabled(true)
                                )]
                            })
                        } else {
                            verificar.edit({
                                embeds: [verificar.embeds[0].color('RED')],
                                components: [new Discord.ActionRowBuilder().addComponents(
                                    new Discord.ButtonBuilder().setLabel('NO VERIFICADO').setStyle('Danger').setCustomId('verificar').setEmoji('❌').setDisabled(true)
                                )]
                            })
                        }
                    })
                }

                    break;

                case "borrar_ticket": {
                    //si el ticket ya está cerrado, hacemos return;
                    interaction.deferUpdate();
                    //creamos el mensaje de verificar
                    const verificar = await interaction.channel.send({
                        embeds: [new Discord.EmbedBuilder()
                            .setTitle(`Verificate primero!`)
                            .setColor('Green')
                        ],
                        components: [new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder().setLabel('Verificarse').setStyle('Success').setCustomId('verificar').setEmoji('✅')
                        )]
                    });

                    //creamos un collector
                    const collector = verificar.createMessageComponentCollector({
                        filter: i => i.isButton() && i.message.author.id == client.user.id && i.user,
                        time: 180e3
                    });

                    //escuchamos clicks en el boton 
                    collector.on("collect", boton => {
                        //si la persona que hace click en el boton no es el la misma que ha hecho click en el boton de cerrar, return;
                        if (boton.user.id !== interaction.user.id) return boton.reply({ content: `*<:no:1012037166827843604> | No puedes utilizar este botón!*`, ephemeral: true })

                        //paramos el collector
                        collector.stop();
                        boton.deferUpdate();
                        //borramos el ticket de la base de datos
                        ticket_data.delete();
                        interaction.channel.send(`**<:check:1012042903381610496> | El ticket será eliminado en \`3 segundos...\` \nEliminado por: \`${interaction.user.tag}\` el <t:${Math.round(Date.now() / 1000)}>**`)
                        //borramos el canal en 3 segs
                        setTimeout(() => {
                            interaction.channel.delete();
                        }, 3_000);
                    });

                    collector.on("end", (collected) => {
                        //si el usuario ha hecho click al boton de verificar, editamos el mensaje desactivando el boton
                        if (collected && collected.first() && collected.first().customId) {
                            //editamos el mensaje
                            verificar.edit({
                                components: [new Discord.ActionRowBuilder().addComponents(
                                    new Discord.ButtonBuilder().setLabel('Verificarse').setStyle('Success').setCustomId('verificar').setEmoji('✅').setDisabled(true)
                                )]
                            })
                        } else {
                            verificar.edit({
                                embeds: [verificar.embeds[0].color('RED')],
                                components: [new Discord.ActionRowBuilder().addComponents(
                                    new Discord.ButtonBuilder().setLabel('NO VERIFICADO').setStyle('Danger').setCustomId('verificar').setEmoji('❌').setDisabled(true)
                                )]
                            })
                        }
                    })
                }
                break;

                case "guardar_ticket": {
                    interaction.deferUpdate();  
                    //enviamos el mensaje de guardando ticket
                    const mensaje = await interaction.channel.send({
                        content: interaction.user.toString(),
                        embeds: [new Discord.EmbedBuilder()
                        .setTitle(`⌛ Guardando Ticket`)
                        .setColor('Green')
                        ]
                    });
                    
                    //generamos el archivo html 
                    const adjunto = await html.createTranscript(interaction.channel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `${interaction.channel.name}.html`
                    })

                    mensaje.edit({
                        embeds: [new Discord.EmbedBuilder()
                        .setTitle(`✅ | Ticket Guardado`)
                        .setColor('Green')
                        ],
                        files: [adjunto]
                    })
                }
                break;
            }

        } catch (e) {
            console.log(e)
        }
    })
}