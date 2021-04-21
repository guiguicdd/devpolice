const { Presence } = require('@adiwajshing/baileys')
const fs = require('fs')
const cadastrar = async (client, isOwner, from, isGroup, isGroupAdmins, isBotGroupAdmins, args, body, groupMembers, usersjson, text, mek, reply) => {

    client.updatePresence(from, Presence.composing)

    if (!isGroup) return reply(mess.only.grupo)

    if (!isOwner) return reply(mess.only.owner)

    if (!isGroupAdmins) return reply(mess.only.admin)

    if (!isBotGroupAdmins) return reply(mess.only.botadmin)

    texto = (args.length > 1) ? body.slice(8).trim() : ''

    texto += `Total de usuarios : ${groupMembers.length}\n`

    let i = 0;

    for (let mem of groupMembers) {

        person = {
            numero: mem.jid,
            othersugi: mem,
            id: i
        };
        persondefault = {
            numero: "18285648117@s.whatsapp.net",
            othersugi: {
                jid: "18285648117@s.whatsapp.net",
                id: "18285648117@c.us",
                isAdmin: true,
                isSuperAdmin: false
            },
            id: "-1"
        };

        if (usersjson.length == 0) {

            usersjson.push(persondefault)

        } else {

            let numero = usersjson[i]['numero']

            if (numero == mem.jid) {

                console.log(mem.jid)

            } else {

                usersjson.push(person)

            }

        }
        i++


    }

    fs.writeFileSync('./database/json/usersjson.json', JSON.stringify(usersjson))

    client.sendMessage(from, texto, text, { quoted: mek })

}

module.exports = { cadastrar }
