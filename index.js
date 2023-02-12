const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config/config.json')
require('colors')
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
    ],
    partials: [Discord.Partials.User, Discord.Partials.Channel, Discord.Partials.GuildMember, Discord.Partials.Message, Discord.Partials.Reaction],
    allowedMentions: { repliedUser: false },
})

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.color = config.color;

fs.readdirSync('./handlers').filter(handler => handler.endsWith(".js")).forEach(handler => {
    try {
        require(`./handlers/${handler}`)(client, Discord)
    } catch (e) {
        console.log(e.bgRed)
    }
})

client.login(config.token)

/*
╔═════════════════════════════════════════════════╗
║ || - || Desarrollado por ManuCatun#4439 || - || ║
║  ----------| discord.gg/CDUHjwxwjm |----------  ║
╚═════════════════════════════════════════════════╝
*/