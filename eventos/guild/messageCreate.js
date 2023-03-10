const { EmbedBuilder } = require("discord.js");
const { distance } = require('fastest-levenshtein');
const config = require(`${process.cwd()}/config/config.json`);
const serverSchema = require(`${process.cwd()}/modelos/servidor.js`);
const { asegurar_todo } = require(`${process.cwd()}/utils/funciones.js`)

module.exports = async (client, message) => {
    if (!message.guild || !message.channel || message.author.bot) return;
    await asegurar_todo(message.guild.id, message.author.id);
    let data = await serverSchema.findOne({ guildID: message.guild.id });

    if (message.content.includes(client.user.id)) return message.reply({
        embeds: [
            new EmbedBuilder()
                .setAuthor({ name: `¡Hola ${message.author.username}!`, iconURL: message.author.displayAvatarURL({ format: "png", dynamic: true }) })
                .setDescription(`Utiliza \`${data.prefijo}help\` para ver mis comandos`)
                .setColor(client.color)
        ]
    })

    if (!message.content.startsWith(data.prefijo)) return;
    const args = message.content.slice(data.prefijo.length).trim().split(" ");
    const cmd = args.shift()?.toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(c => c.aliases && c.aliases.includes(cmd));
    if (command) {

        if (command.owner) {
            if (!config.ownerIDS.includes(message.author.id)) return message.reply(`<:nope_normal:1012749750459695114>**| Solo los dueños de este bot pueden ejecutar este comando!**`)
        }

        if (command.premium) {
            if (data.premium) {
                if (data.premium <= Date.now()) return message.reply("<:nope_normal:1012749750459695114> **| Tu suscripción premium ha expirado!**")
            } else {
                return message.reply("<:nope_normal:1012749750459695114> **| Este es un comando premium!**")
            }
        }

        if (command.permisos_bot) {
            if (!message.guild.members.me.permissions.has(command.permisos_bot)) return message.reply(`<:nope_normal:1012749750459695114> **| No tengo suficientes permisos para ejecutar este comando!**`)
        }

        if (command.permisos) {
            if (!message.member.permissions.has(command.permisos)) return message.reply(`<:nope_normal:1012749750459695114> **| No tienes suficientes permisos para ejecutar este comando!**`)
        }

        //Ejecutamos el comando
        command.run(client, message, args, data.prefijo)
    } else {

        const comandos = client.commands.map((command) => ({
            name: command.name,
            distance: distance(cmd, command.name)
        }));

        const comandoCercano = comandos.sort((a, b) => a.distance - b.distance).slice(0, 1);

        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("<:nope_normal:1012749750459695114> | Este comando no existe!")
                    .addFields([
                        { name: "Tal vez quisiste decir: ", value: `${comandoCercano.map((c) => `\`\`\`${data.prefijo}${c.name}\`\`\``)}` },
                        { name: "Ve todos mis comandos con: ", value: `\`\`\`${data.prefijo}help\`\`\`` }
                    ])
                    .setColor(client.color)
            ]
        })

    }
}