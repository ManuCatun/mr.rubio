const { readdirSync } = require('fs');
const Discord = require('discord.js');
module.exports = {
    name: "help",
    aliases: ["ayuda", "h", "comandos", "commands"],
    desc: "Sirve para ver los comandos que tiene el bot",
    permisos: [],

    run: async (client, message, args, prefix) => {

        //definimos las categorias del bot leyendo las rutas
        const categorias = readdirSync('./comandos');
        if (args[0]) {
            const comando = client.commands.get(args[0].toLowerCase()) || client.commands.find(c => c.aliases && c.aliases.includes(args[0].toLowerCase()));
            const categoria = categorias.find(categoria => categoria.toLowerCase().endsWith(args[0].toLowerCase()));
            if (comando) {
                let embed = new Discord.EmbedBuilder()
                    .setTitle(`Comando \`${comando.name}\``)
                    .setColor(client.color);

                //condicionales
                if (comando.desc) embed.addFields([ { name: `✍🏼 Descripción`, value: `\`\`\`${comando.desc}\`\`\`` } ]);
                if (comando.aliases && comando.aliases.length >= 1) embed.addFields([ { name: `🪓 Alias`, value: `${comando.aliases.map(alias => `\`${alias}\``).join(", ")}` } ]);
                if (comando.permisos && comando.permisos.length >= 1) embed.addFields([ { name: `👤 Permisos requeridos`, value: `${comando.permisos.map(permiso => `\`${permiso}\``).join(", ")}` } ]);
                if (comando.permisos_bot && comando.permisos_bot.length >= 1) embed.addFields([ { name: `🤖 Permisos de BOT requeridos`, value: `${comando.permisos_bot.map(permiso => `\`${permiso}\``).join(", ")}` } ]);
                return message.reply({ embeds: [embed] })

            } else if (categoria) {
                const comandos_de_categoria = readdirSync(`./comandos/${categoria}`).filter(archivo => archivo.endsWith('.js'));
                return message.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle(`${categoria.split(" ")[0]} ${categoria.split(" ")[1]} ${categoria.split(" ")[0]}`)
                            .setDescription(comandos_de_categoria.length >= 1 ? `>>> *${comandos_de_categoria.map(comando => `\`${comando.replace(/.js/g, "")}\``).join(" - ")}*` : `>>> *Todavía no se han agregado comandos en esta categoría...*`)
                            .setColor(client.color)
                    ]
                })
            } else {
                return message.reply(`<:nope_normal:1012749750459695114> **| No se ha encontrado el comando que has especificado!** \nUsa \`${prefix}help\` para ver los comandos y categorías!`)
            }
        } else {
            //definimos la seleccion de comandos
            const seleccion = new Discord.ActionRowBuilder().addComponents(new Discord.SelectMenuBuilder()
            .setCustomId('SelecciónMenuAyuda')
            .setMaxValues(5)
            .setMinValues(1)
            .addOptions(categorias.map(categoria => {
                //definimos el objeto que sera una opcion
                let objeto = {
                    label: categoria.split(" ")[1].substring(0, 50),
                    value: categoria,
                    description: `Mira los comandos de ${categoria.split(" ")[1].substring(0, 50)}`,
                    emoji: categoria.split(" ")[0],
                }
                //devolvemos el objeto
                return objeto;
            }))
            )
            let ayuda_embed = new Discord.EmbedBuilder()
            .setTitle(`Ayuda de __${client.user.tag}__`)
            .setDescription(`Bot multifuncional en desarrollo por \`ManuCatun#4439\``)
            .setColor(client.color)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setFooter({ text: '© desarrollado por ManuCatun#4439', iconURL: 'https://cdn.discordapp.com/avatars/758098123829805088/7efbc7f3a695b56f28668c7f04bb245d.png?size=1024' });

            let mensaje_ayuda = await message.reply({ embeds: [ayuda_embed], components: [seleccion] })     
            
            const collector = mensaje_ayuda.createMessageComponentCollector({ filter: (i) => (i.isSelectMenu()) && i.user && i.message.author.id == client.user.id, time: 180e3 });
       
            collector.on("collect", (interaccion) => {
                let embeds = [];
                for (const seleccionado of interaccion.values) {
                    //definimos los comandos 
                    const comandos_de_categoria = readdirSync(`./comandos/${seleccionado}`).filter(archivo => archivo.endsWith('.js'));

                    let embed = new Discord.EmbedBuilder()
                    .setTitle(`${seleccionado.split(" ")[0]} ${seleccionado.split(" ")[1]} ${seleccionado.split(" ")[0]}`)
                    .setDescription(comandos_de_categoria.length >= 1 ? `>>> *${comandos_de_categoria.map(comando => `\`${comando.replace(/.js/, "")}\``).join(" - ")}*` : `>>> *Todavía no se han agregado comandos en esta categoría...*`)
                    .setColor(client.color)

                    embeds.push(embed)
                }
                interaccion.reply({embeds, ephemeral: true})
            });

            collector.on("end", () => {
                mensaje_ayuda.edit({ content: `Tu tiempo ha expirado! Vuelve a escribir\`${prefix}help\` para verlo de nuevo!`, components: [] }).catch((e) => { console.log(e) });
            })
        }
    }
}