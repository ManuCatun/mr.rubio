const Discord = require('discord.js');
const Canvas = require("@napi-rs/canvas");
const moment = require("moment");
module.exports = {
    name: "spotify",
    aliases: ["musica"],
    desc: "Sirve para ver la canción de spotify que estás escuchando!",
    permisos_bot: [],
    permisos: [],

    run: async (client, message, args, prefix) => {

        try {

            const member = message.mentions.members.first() || message.member;

            let presence = member.presence;
            if (!presence) return message.reply("<:nope_normal:1012749750459695114> **| El usuario no está escuchando <:spotify:991915792050430052> Spotify!**");
            presence = presence.activities.filter(x => x.name === "Spotify" && x.details);
            if (!presence.length) return message.reply("<:nope_normal:1012749750459695114> **| El usuario no está escuchando <:spotify:991915792050430052> Spotify!**");
            presence = presence[0];

            const canvas = Canvas.createCanvas(828, 1713);
            const ctx = canvas.getContext("2d");
            const template = await Canvas.loadImage("https://media.discordapp.net/attachments/1067104741848535140/1071141896015073400/spotify.png");

            let songImage = presence.assets.largeImage.split(":")[1];
            songImage = await Canvas.loadImage(`https://i.scdn.co/image/${songImage}`);

            const now = moment();
            const startTime = moment(presence.timestamps.start);
            const duration = moment(presence.timestamps.end).diff(startTime);
            const playbackTime = now.diff(startTime);
            const playbackTimeFormatted = moment(playbackTime).format('mm:ss');
            const durationFormatted = moment(duration).format('mm:ss');
            const fillBar = (546 / duration) * playbackTime

                //Background
                ctx.filter = "blur(20px)"
                ctx.drawImage(songImage, -400, 0, 1713, 1713) //828
                ctx.filter = "blur(0px)"

                //ctx.drawImage(template, 0, 0)

                //Song Image
                ctx.drawImage(songImage, 60, 404, 708, 708)

                //Grey Square
                ctx.globalAlpha = 0.8
                ctx.fillStyle = "#272424"
                ctx.fillRect(30.5, 1165, 770, 180)
                ctx.globalAlpha = 0.7

                //Song Name
                ctx.fillStyle = "#FFFFFF"
                ctx.font = "35px Arial"
                ctx.textAlign = "center"
                ctx.fillText(presence.details, 414, 1228)

                //Song Author
                ctx.fillStyle = "#9C9C9B"
                ctx.font = "29px Arial"
                ctx.fillText(presence.state, 414, 1270)

                //Progress Bar
                ctx.fillStyle = "#34332F"
                ctx.fillRect(132, 1288, 546, 20)
                ctx.fillStyle = "#FFFFFF"
                ctx.fillRect(132, 1288, fillBar, 20)

                //Song Duration
                ctx.font = "22px Arial"
                ctx.fillText(playbackTimeFormatted, 85, 1308)
                ctx.fillText(durationFormatted, 730, 1308)

                //Actual Date
                ctx.font = "215px Arial"
                ctx.fillText(now.format("hh:mm"), 414, 350)

                ctx.font = "45px Arial"
                ctx.fillText(now.format("dddd Do, MMMM"), 414, 155)

                const file = new Discord.AttachmentBuilder(canvas.toBuffer("image/png"), { name: "spotify.png" })

                message.reply({ content: `${member} está escuchando ***${presence.details}*** de ***${presence.state}*** en <:spotify:991915792050430052> Spotify!`, files: [file] })
            } catch (e) {
                console.log(e);
                message.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle('<:error:1012451217693221015> | Ocurrio un error!')
                            .setDescription(`\`\`\`js\n${e.toString().substring(0, 2048)}\`\`\``)
                            .setColor('Red')
                            .setFooter({ text: `Por favor utiliza el comando ${prefix}report-bug para reportar este error!` })
                    ]
                })
            }
        }
}