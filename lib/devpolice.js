const { Presence } = require('@adiwajshing/baileys')
const fs = require('fs')
const cadastrar = async (client, isOwner, from, isGroup, isGroupAdmins, isBotGroupAdmins, args, body, groupMembers, usersjson, reply) => {

    client.updatePresence(from, Presence.composing)

    if (!isGroup) return reply(mess.only.grupo)

    if (!isOwner) return reply(mess.only.owner)

    if (!isGroupAdmins) return reply(mess.only.admin)

    if (!isBotGroupAdmins) return reply(mess.only.botadmin)

    texto = (args.length > 1) ? body.slice(8).trim() : ''

    texto += `Total de usuarios : ${groupMembers.length}\n`

    for (let mem of groupMembers) {
        isUseregistered = usersjson.includes(mem.jid)
        if (isUseregistered) return console.log('Pa')
        usersjson.push(mem.jid)
    }

    fs.writeFileSync('./database/json/usersjson.json', JSON.stringify(usersjson))

    client.sendMessage(from, texto, text, { quoted: mek })

}

module.exports = { cadastrar }
