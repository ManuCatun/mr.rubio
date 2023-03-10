const setupSchema = require('../modelos/setups.js');
const votosSchema = require('../modelos/votos-sugs.js');
const { asegurar_todo } = require('../utils/funciones.js');
const Discord = require('discord.js');

module.exports = client => {
    //evento al enviar el mensaje
    client.on("messageCreate", async message => {
        try {
            //comprobaciones
            if (!message.guild || !message.channel || message.author.bot) return;
            //buscamos los datos de la DB
            let setup_data = await setupSchema.findOne({ guildID: message.guild.id });
            if (!setup_data || !setup_data.sugerencias || !message.guild.channels.cache.get(setup_data.sugerencias) || message.channel.id !== setup_data.sugerencias) return;
            let canal = setup_data.logs
            //eliminamos la sugerencia enviada por el usuario
            message.delete().catch(() => { });
            //definimos los botones
            let botones = new Discord.ActionRowBuilder().addComponents([
                //boton votar si 
                new Discord.ButtonBuilder().setStyle("Secondary").setLabel("0").setEmoji('✅').setCustomId("votar_si"),
                //boton votar no
                new Discord.ButtonBuilder().setStyle("Secondary").setLabel("0").setEmoji('❌').setCustomId("votar_no"),
                //quien ha votado
                new Discord.ButtonBuilder().setStyle("Primary").setLabel("¿Quién ha votado?").setEmoji('❓').setCustomId("ver_votos"),
            ])
            //enviamos el mensaje
            let msg = await message.channel.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setAuthor({ name: "Sugerencia de " + message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`>>> ${message.content}`)
                        .addFields([ 
                            { name: `✅ Votos positivos`, value: "0 votos", inline: true },
                            { name: `❌ Votos negativos`, value: "0 votos", inline: true }
                        ])
                        .setColor(client.color)
                        .setFooter({ text: "Quieres sugerir algo? Envía tu sugerencia aquí!", iconURL: message.guild.iconURL() })
                ],
                components: [botones]
            })
            let data_msg = new votosSchema({
                messageID: msg.id,
                autor: message.author.id
            })
            data_msg.save();
        } catch (e) {
            console.log(e)
        }
    })

    //evento al hacer click en un boton
    client.on("interactionCreate", async interaction => {
        try {
            //comprobaciones
            if (!interaction.guild || !interaction.channel || !interaction.message || !interaction.user) return;
            //aseguramos la base de datos
            asegurar_todo(interaction.guild.id, interaction.user.id);
            //buscamos los datos en la DB
            let setup_data = await setupSchema.findOne({ guildID: interaction.guild.id });
            //buscamos la base de datos del mensaje
            let msg_data = await votosSchema.findOne({ messageID: interaction.message.id });
            //comprobaciones
            if (!msg_data || !setup_data || !setup_data.sugerencias || interaction.channel.id !== setup_data.sugerencias) return;
            switch (interaction.customId) {
                case "votar_si": {
                    if (msg_data.si.includes(interaction.user.id)) return interaction.reply({ content: `Ya has votado **SÍ** en la sugerencia de <@${msg_data.autor}>`, ephemeral: true });
                    //modificamos la db
                    if (msg_data.no.includes(interaction.user.id)) msg_data.no.splice(msg_data.no.indexOf(interaction.user.id), 1);
                    msg_data.si.push(interaction.user.id);
                    msg_data.save();

                    //modificamos el embed
                    interaction.message.embeds[0].fields[0].value = `${msg_data.si.length} votos`;
                    interaction.message.embeds[0].fields[1].value = `${msg_data.no.length} votos`;

                    //modificamos los botones
                    interaction.message.components[0].components[0].data.label = `${msg_data.si.length}`;
                    interaction.message.components[0].components[1].data.label = `${msg_data.no.length}`;

                    //editamos el mensaje
                    await interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [interaction.message.components[0]] });
                    interaction.deferUpdate();

                }
                    break;
                case "votar_no": {
                    if (msg_data.no.includes(interaction.user.id)) return interaction.reply({ content: `Ya has votado **SÍ** en la sugerencia de <@${msg_data.autor}>`, ephemeral: true });
                    //modificamos la db
                    if (msg_data.si.includes(interaction.user.id)) msg_data.si.splice(msg_data.si.indexOf(interaction.user.id), 1);
                    msg_data.no.push(interaction.user.id);
                    msg_data.save();

                    //modificamos el embed
                    interaction.message.embeds[0].fields[0].value = `${msg_data.si.length} votos`;
                    interaction.message.embeds[0].fields[1].value = `${msg_data.no.length} votos`;

                    //modificamos los botones
                    interaction.message.components[0].components[0].data.label = `${msg_data.si.length}`;
                    interaction.message.components[0].components[1].data.label = `${msg_data.no.length}`;

                    //editamos el mensaje
                    await interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [interaction.message.components[0]] });
                    interaction.deferUpdate();
                }
                    break;
                case "ver_votos": {
                    interaction.reply({
                        embeds: [new Discord.EmbedBuilder()
                            .setTitle(`Votos de la sugerencia`)
                            .addFields([ 
                                { name: `✅ Votos positivos`, value: msg_data.si.length >= 1 ? msg_data.si.map(u => `<@${u}> \n`).toString() : "No hay votos", inline: true }, 
                                { name: `❌ Votos negativos`, value: msg_data.no.length >= 1 ? msg_data.no.map(u => `<@${u}> \n`).toString() : "No hay votos", inline: true }
                            ])
                            .setColor(client.color)
                        ],
                        ephemeral: true,
                    })
                }
                    break;
            }
        } catch (e) {
            console.log(e)
        }
    })
}