const setupSchema = require('../modelos/setups.js');
const { mongodb } = require('../config/config.json');
const { asegurar_todo } = require('../utils/funciones.js');
const Levels = require('discord-xp');
Levels.setURL(mongodb);

module.exports = client => {
    client.on("messageCreate", async message => {
        try {

            //comprobaciones
            if (!message.guild || !message.channel || message.author.bot) return;
            await asegurar_todo(message.guild.id, message.author.id);
            const setupData = await setupSchema.findOneAndUpdate({ guildID: message.guild.id });

            if (!setupData || !setupData.niveles || !message.guild.channels.cache.get(setupData.niveles.canal)) return;

            let xpRandom = Math.floor(Math.random() * 30) + 1;
            let subeNivel = await Levels.appendXp(message.author.id, message.guild.id, xpRandom);
            let usuario = await Levels.fetch(message.author.id, message.guild.id);

            let canalNotificaciones = message.guild.channels.cache.get(setupData.niveles.canal);
            let mensajeSubirNivel = setupData.niveles.mensaje.replace(/{usuario}/, message.author).replace(/{nivel}/, usuario.level);

            if (subeNivel && canalNotificaciones && mensajeSubirNivel) {
                canalNotificaciones.send(mensajeSubirNivel);
            }

        } catch (e) {
            console.log(e);
        }
    })
}   