const { ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const config = require(`../../config/config.json`);

module.exports = async client => {

    let palo = 53;

    //Conectar a la base de datos
    mongoose.connect(config.mongodb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log(`☁ Conectado a la base de datos de MongoDB`.blue)
    }).catch((err) => {
        console.log(`☁ Error al conectar a la base de datos de MongoDB`.bgRed);
        console.log(err)
    })

    const activities = [
        { name: `${client.guilds.cache.size} Servidores`, type: ActivityType.Competing },
        { name: `${config.actividad}`, type: ActivityType.Listening },
        { name: `-help`, type: ActivityType.Watching },
        { name: `PanaC???`, type: ActivityType.Playing }
    ];
    const status = [
        'online',
        'dnd',
        'idle'
    ];
    let i = 0;
    setInterval(() => {
        if(i >= activities.length) i = 0
        client.user.setActivity(activities[i])
        i++;
    }, 9000);

    let s = 0;
    setInterval(() => {
        if(s >= activities.length) s = 0
        client.user.setStatus(status[s])
        s++;
    }, 30000);

    console.log(`╔═════════════════════════════════════════════════════╗`.green)
    console.log(`║ `.green + " ".repeat(-1 + palo - 1) + " ║".green)
    console.log(`║ `.green + `      Conectado como ${client.user.tag}`.green + " ".repeat(-1 + palo - 1 - `      Conectado como ${client.user.tag}`.length) + " ║".green)
    console.log(`║ `.green + " ".repeat(-1 + palo - 1) + " ║".green)
    console.log(`╚═════════════════════════════════════════════════════╝`.green)
}