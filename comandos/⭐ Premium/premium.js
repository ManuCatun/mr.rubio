module.exports = {
    name: "premium",
    aliases: [],
    desc: "Sirve para ver si eres un usuario premium!",
    premium: true,
    permisos_bot: [],
    permisos: [],

    run: async (client, message, args, prefix) => {

        message.reply(`⭐ **| Este es un servidor premium!**`)

    }
}