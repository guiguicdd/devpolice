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

    while (i != groupMembers.length) {
        console.log(i)
        person = {
            numero: groupMembers[i].jid,
            othersugi: groupMembers[i],
            pontos: 1000
        };
        if (usersjson[i] == undefined) {
            await usersjson.push(person)
            console.log('undefined')

        } else {
            if (usersjson[i]['numero'] == groupMembers[i].jid) {
                console.log(groupMembers[i].jid)
            } else {
                usersjson.push(person)
                console.log(usersjson[i]['numero']+' diferente de '+groupMembers[i].jid)
            }
        }

        fs.writeFileSync('./database/json/usersjson.json', JSON.stringify(usersjson))
        i++

    }

    client.sendMessage(from, texto, text, { quoted: mek })

}

module.exports = { cadastrar }
