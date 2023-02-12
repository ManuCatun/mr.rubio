const Canvas = require('canvas');
const setupSchema = require('../modelos/setups.js');
const Discord = require('discord.js');
module.exports = client => {
    client.on('guildMemberAdd', async member => {
        try {

            const { guild } = member;

            let setupData = await setupSchema.findOne({ guildID: guild.id });
            if (!setupData) return;
            let canalBienvenidas = guild.channels.cache.get(setupData?.bienvenidas?.canal);
            if (!canalBienvenidas) return;
            let imagenBienvenidas = setupData.bienvenidas.imagen;

            Canvas.registerFont("./KoyaSans-BlackItalic.ttf", { family: "koyaSans" })

            const canvas = Canvas.createCanvas(922, 450);
            const ctx = canvas.getContext("2d");

            const background = await Canvas.loadImage(imagenBienvenidas)
            const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: "png" }));

            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.beginPath();
            ctx.arc(461, 154, 116, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, 345, 38, 232, 232);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 14;
            ctx.stroke();
            ctx.restore();

            ctx.font = "60px koyaSans"
            ctx.fillStyle = "white"
            ctx.textAlign = "center"
            ctx.fillText("BIENVENID@", 461, 340)

            ctx.font = "35px koyaSans"
            ctx.fillStyle = "white"
            ctx.textAlign = "center"
            ctx.fillText(member.user.tag.toUpperCase(), 461, 385)

            const file = new Discord.AttachmentBuilder(canvas.toBuffer(), { name: "mr.rubio-welcomes.png" });

            canalBienvenidas.send({ content: `${member.user} bienvenido a ${member.guild.name}`, files: [file] })

        } catch (e) {
            console.log(e)
        }
    })
}