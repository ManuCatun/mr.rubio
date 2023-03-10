const { GiveawaysManager } = require('discord-giveaways');
const sorteosSchema = require('../modelos/sorteos.js');

module.exports = async client => {
    //obtenemos la base de datos del sorteo
    let db = await sorteosSchema.findOne({ ID: "sorteos" });
    if (!db || db == null) {
        db = await new sorteosSchema();
        await db.save();
    }

    //creamos nuestro propio constructor
    const SorteosConMongoDB = class SorteosMongoDB extends GiveawaysManager {

        async getAllGiveaways() {
            //obtenemos la base de los sorteos
            let db = await sorteosSchema.findOne({ ID: "sorteos" });
            return db.data;
        }

        async saveGiveaway(messageID, datoSorteo) {
            //empujamos el sorteo en el array
            await sorteosSchema.findOneAndUpdate({ ID: "sorteos" }, {
                $push: {
                    data: datoSorteo
                }
            });
            return true;
        }

        async editGiveaway(messageID, datoSorteo) {
            //obtenemos la base de datos
            let db = await sorteosSchema.findOne({ ID: "sorteos" });
            let sorteos = db.data;

            let sorteoIndex = -1;
            //buscamos el index del sorteo con un mapeado
            sorteos.map((sorteo, index) => {
                if (sorteo.messageId.includes(messageID)) return sorteoIndex = index;
            })
            console.log(sorteoIndex);

            if (sorteoIndex > -1) {
                db.data[sorteoIndex] = datoSorteo;
                await sorteosSchema.findOneAndUpdate({ ID: "sorteos" }, db)
                return true;
            }
        }

        async deleteGiveaway(messageID) {
            //obtenemos la base de datos
            let db = await sorteosSchema.findOne({ ID: "sorteos" });
            let sorteos = db.data;
            let sorteoIndex = -1;
            //buscamos el index del sorteo con un mapeado
            sorteos.map((sorteo, index) => {
                if (sorteo.messageId.includes(messageID)) return sorteoIndex = index;
            })
            if (sorteoIndex > -1) {
                db.data.splice(sorteoIndex, 1)
                await sorteosSchema.findOneAndUpdate({ ID: "sorteos" }, db)
                return true;
            }
        }
    }

    //creamos el sistema de sorteos
    client.giveawaysManager = new SorteosConMongoDB(client, {
        default: {
            botsCanWin: false,
            embedColor: client.color,
            embedColorEnd: "Green",
            reaction: "????"
        }
    })
}