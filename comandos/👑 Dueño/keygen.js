const ms = require('ms');
const Discord = require('discord.js');
const keySchema = require('../../modelos/clave.js');
module.exports = {
    name: "keygen",
    aliases: ["generar-clave", "generarclave"],
    desc: "Sirve para generar una Clave Premium para un servidor",
    owner: true,
    permisos_bot: [],
    permisos: [],

    run: async (client, message, args, prefix) => {

        if (!args.length) return message.reply(`<:nope_normal:1012749750459695114> **| Debes especificar la duración de la clave!**`);
        const tiempo = ms(args[0])
        if (tiempo) {
            let clave = generar_clave()
            message.author.send({ embeds: [
                new Discord.EmbedBuilder()
                .setTitle('🔑 Nueva Clave')
                .setDescription("```"+clave+"```")
                .addFields([
                    { name: `Generada por:`, value: `\`${message.author.tag}\` • \`${message.author.id}\`` },
                    { name: `Suscripción:`, value: `${args[0]}` },
                    { name: `Estado:`, value: `\`SIN USAR\`` }
                ])
                .setColor(client.color)
            ] }).catch(() => {
                message.react("1012451217693221015")
                return message.reply(`<:error:1012451217693221015> *| No he podido enviarle el mensaje al usuario! \nClave Eliminada!*`)
            });
            let data = new keySchema({
                clave, 
                duracion: tiempo,
                activado: false
            });
            data.save();
            message.react('1012042903381610496')
            return message.reply("<:check:1012042903381610496> **| Nueva clave generada en la base de datos!** \nLa información de la clave ha sido enviada por mensaje directo!")
        } else {
            return message.reply(`<:nope_normal:1012749750459695114> **| El tiempo que has especificado no es válido!**`)
        }
    }
}  

function generar_clave() {
    let posibilidades = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let parte1 = "";
    let parte2 = "";
    let parte3 = "";
    let parte4 = "";
    for (let i = 0; i < 4; i++) {
        parte1 += posibilidades.charAt(Math.floor(Math.random() * posibilidades.length));
        parte2 += posibilidades.charAt(Math.floor(Math.random() * posibilidades.length));
        parte3 += posibilidades.charAt(Math.floor(Math.random() * posibilidades.length));
        parte4 += posibilidades.charAt(Math.floor(Math.random() * posibilidades.length));
    }
    //devolvemos la clave generada
    return `${parte1}-${parte2}-${parte3}-${parte4}`
}