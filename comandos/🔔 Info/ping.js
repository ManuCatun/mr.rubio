const serverSchema = require('../../modelos/servidor.js');
const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: "ping",
    aliases: ["latencia", "lag"],
    desc: "Sirve para ver el ping del bot",
    permisos: [],

    run: async (client, message, args, prefix) => {

        //obtenemos el tiempo de antes
        let tiempoAntes = Date.now()
        //HACEMOS LA ACCIÓN (obtenemos los datos de la db)
        await serverSchema.findOne({ guildID: message.guild.id });
        //obtenemos el tiempo de después de haber realizado la acción
        let tiempoDespues = Date.now();

        //resultado en ms
        let resultadoMs = `\`${tiempoDespues - tiempoAntes}ms\``

        message.reply({ embeds: [
            new EmbedBuilder()
            .setTitle('<:ping:992435828733259869> | Ping del bot')
            .addFields([
                { name: '🏓 Bot:', value: `${client.ws.ping}ms` },
                { name: `<:database_ping:1014285041846726728> Base de Datos:`, value: `${tiempoDespues - tiempoAntes}ms` }
            ])
            .setColor('Green')
        ] })

    }
}